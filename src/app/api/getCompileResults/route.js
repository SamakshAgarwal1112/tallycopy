import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import getConstraints from "../getConstraints";

const execPromise = promisify(exec);

function generateTestCasesString(testCases) {
  return testCases.reduce((acc, testCase, index) => {
    const input = Object.values(testCase)[0];
    acc[index + 1] = String(input);
    return acc;
  }, {});
}

function validateOutput(expectedOutput, actualOutput) {
  const normalizeWhitespace = (str) =>
    str.trim().replace(/\s+/g, " ").replace(/ +/g, " ");

  const normalizedExpected = normalizeWhitespace(expectedOutput);
  const normalizedActual = normalizeWhitespace(actualOutput);

  return normalizedExpected === normalizedActual;
}

async function compileCode(cppFilePath, exeFilePath) {
  try {
    const { stdout, stderr } = await execPromise(
      `g++ ${cppFilePath} -o ${exeFilePath}`
    );
  } catch (error) {
    throw error;
  }
}

async function runCodeWithLimits(
  exeFilePath,
  input,
  timeLimit = 5,
  memoryLimit = 256
) {
  const tempInputPath = path.join(process.cwd(), "temp_input.txt");
  const tempOutputPath = path.join(process.cwd(), "temp_output.txt");

  fs.writeFileSync(tempInputPath, input);

  const command = `ulimit -v ${
    memoryLimit * 1024 * 1024
  } && timeout ${timeLimit}s ${exeFilePath} < ${tempInputPath} > ${tempOutputPath}`;

  try {
    await execPromise(command, { shell: "/bin/bash" });
    const output = fs.readFileSync(tempOutputPath, "utf8");

    // Clean up
    fs.unlinkSync(tempInputPath);
    fs.unlinkSync(tempOutputPath);

    return output;
  } catch (error) {
    fs.unlinkSync(tempInputPath);
    fs.unlinkSync(tempOutputPath);

    if (error.message.includes("timeout")) {
      throw new Error("TLE");
    }

    if (error.message.includes("memory limit exceeded")) {
      throw new Error("MLE");
    }

    return error.message;
  }
}

export async function POST(request) {
  const data = await request.json();
  const { code, testCase, expectedOutputs, question_id, userId } = data;

  const tc = generateTestCasesString(testCase);

  const tempDir = path.join(process.cwd(), "temp");
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
  const cppFilePath = path.join(tempDir, "temp.cpp");
  const exeFilePath = path.join(tempDir, "temp.out");

  fs.writeFileSync(cppFilePath, code);

  try {
    await compileCode(cppFilePath, exeFilePath);

    const results = {};

    for (const [name, input] of Object.entries(tc)) {
      let result;
      try {
        const { time_constraint, memory_constraint } = await getConstraints(
          question_id
        );

        result = await runCodeWithLimits(
          exeFilePath,
          input,
          time_constraint,
          memory_constraint
        );
      } catch (error) {
        if (error.message === "TLE") {
          result = "Time Limit Exceeded";
        } else if (error.message === "MLE") {
          result = "Memory Limit Exceeded";
        } else {
          result = error.message;
        }
      }

      const expectedOutput = expectedOutputs[parseInt(name, 10) - 1];
      const isOutputValid = validateOutput(expectedOutput, result);

      if (isOutputValid) {
        results[name] = { status: "pass" };
      } else {
        results[name] = {
          status: "fail",
          expected: expectedOutput,
          actual: result,
        };
      }
    }

    // Assuming checkTestCases is imported or defined elsewhere
    // checkTestCases(results, question_id, userId);

    return NextResponse.json({ results });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    if (fs.existsSync(cppFilePath)) fs.unlinkSync(cppFilePath);
    if (fs.existsSync(exeFilePath)) fs.unlinkSync(exeFilePath);
  }
}
