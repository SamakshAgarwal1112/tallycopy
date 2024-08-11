import updateQuestionStatus from "./updateQuestionStatus";

function checkTestCases(results, question_id, userId) {
  const testCaseNumbers = Object.keys(results).map(Number);

  const lastTestCaseNumber = testCaseNumbers[testCaseNumbers.length - 1];

  const lastTestCaseResult = results[lastTestCaseNumber];

  let status;
  let error = null

  if (lastTestCaseResult.status === "pass") {
    console.log("All Test Cases passed");
    status = "Solved";
  } else {
    console.log(`Test Case #${lastTestCaseNumber} failed.`);
    status = "Attempted";
    error = lastTestCaseResult.message
  }

  updateQuestionStatus(question_id, status, error, userId)}

export default checkTestCases;
