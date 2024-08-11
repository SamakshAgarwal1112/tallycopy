import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import path from "path";
import checkTestCases from "../checkTestCases";
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
  const normalizeWhitespace = (str) => str.trim().replace(/\s+/g, " ");
  return (
    normalizeWhitespace(expectedOutput) === normalizeWhitespace(actualOutput)
  );
}

async function compileCode(cppFilePath, exeFilePath) {
  try {
    await execPromise(`g++ ${cppFilePath} -o ${exeFilePath}`);
  } catch {
    throw new Error("Compilation error");
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

  await fs.writeFile(tempInputPath, input);

  const command = `ulimit -v ${
    memoryLimit * 1024 * 1024
  } && timeout ${timeLimit}s ${exeFilePath} < ${tempInputPath} > ${tempOutputPath}`;

  try {
    await execPromise(command, { shell: "/bin/bash" });
    const output = await fs.readFile(tempOutputPath, "utf8");
    return output;
  } catch (error) {
    if (error.message.includes("timeout")) throw new Error("TLE");
    if (error.message.includes("memory limit exceeded")) throw new Error("MLE");
    throw new Error(error.message);
  } finally {
    await fs.unlink(tempInputPath).catch(() => {});
    await fs.unlink(tempOutputPath).catch(() => {});
  }
}

export async function POST(request) {
  const data = await request.json();
  const { code, testCase, expectedOutputs, question_id, userId } = data;

  const tc = generateTestCasesString(testCase);
  const tempDir = path.join(process.cwd(), "temp");

  await fs.mkdir(tempDir, { recursive: true });
  const cppFilePath = path.join(tempDir, "temp.cpp");
  const exeFilePath = path.join(tempDir, "temp.out");

  await fs.writeFile(cppFilePath, code);

  try {
    await compileCode(cppFilePath, exeFilePath);

    const results = {};
    let hasFailed = false;

    for (const [name, input] of Object.entries(tc)) {
      if (hasFailed) break;

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

      const expectedOutput = expectedOutputs[parseInt(name, 10) - 1];
      const isOutputValid = validateOutput(expectedOutput, result);

        results[name] = isOutputValid
          ? { status: "pass" }
          : { status: "fail", expected: expectedOutput, actual: result };

        if (!isOutputValid) break;
      } catch (error) {
        results[name] = { status: "error", message: error.message };
        hasFailed = true;
      }
    }

    await checkTestCases(results, question_id, userId);
    return new Response(JSON.stringify(results), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ status: "error", message: error.message }),
      { status: 500 }
    );
  } finally {
    await fs.unlink(cppFilePath).catch(() => {});
    await fs.unlink(exeFilePath).catch(() => {});
  }
}
