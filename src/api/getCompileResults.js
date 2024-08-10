import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs";
import path from "path";
import checkTestCases from "./checkTestCases";

const execPromise = promisify(exec);

function formatMatrix(matrix) {
  return matrix.map((row) => row.join(" ")).join("\n");
}

function generateTestCasesString(testCases) {
  return testCases.reduce((acc, testCase, index) => {
    const matricesString = Object.values(testCase).map(formatMatrix).join("\n");
    acc[index + 1] = matricesString;
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

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function compileCode(cppFilePath, exeFilePath) {
  try {
    await execPromise(`g++ ${cppFilePath} -o ${exeFilePath}`);
  } catch (error) {
    console.error("Compilation error:", error.message);
    throw error;
  }
}

async function runCodeWithLimits(
  exeFilePath,
  input,
  timeLimit = 5,
  memoryLimit = 256
) {
  const tempInputPath = path.join(__dirname, "temp_input.txt");
  const tempOutputPath = path.join(__dirname, "temp_output.txt");

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

async function getCompileResults(code, testCase, expectedOutputs) {

  const tc = generateTestCasesString(testCase);

  const tempDir = path.join(__dirname, "temp");
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
  const cppFilePath = path.join(tempDir, "temp.cpp");
  const exeFilePath = path.join(tempDir, "temp.out");
  fs.writeFileSync(cppFilePath, code);

  try {
    await compileCode(cppFilePath, exeFilePath);

    const results = {};

    for (const [name, input] of Object.entries(tc)) {
      // console.log(`Running Test Case ${name}`);
      let result;
      try {
        result = await runCodeWithLimits(exeFilePath, input);
      } catch (error) {
        if (error.message === "TLE") {
          result = "Time Limit Exceeded";
        } else if (error.message === "MLE") {
          result = "Memory Limit Exceeded";
        } else {
          result = error.message;
        }
      }

      // console.log(`Output for Test Case ${name}:`);
      // console.log(result);

      const expectedOutput = expectedOutputs[parseInt(name, 10) - 1];
      const isOutputValid = validateOutput(expectedOutput, result);

      if (isOutputValid) {
        results[name] = { status: "pass" };
        // console.log(`Test Case ${name} passed.`);
      } else {
        results[name] = { status: "fail" };
        checkTestCases(results);
        return;
      }
    }

    // console.log("Execution completed.");
    checkTestCases(results);
  } catch (error) {
  } finally {
    if (fs.existsSync(cppFilePath)) fs.unlinkSync(cppFilePath);
    if (fs.existsSync(exeFilePath)) fs.unlinkSync(exeFilePath);
  }
}

export default getCompileResults;
