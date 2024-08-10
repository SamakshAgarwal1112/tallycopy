import updateQuestionStatus from "./updateQuestionStatus";

function checkTestCases(results, question_id, userId) {
  const testCaseNumbers = Object.keys(results).map(Number);

  const lastTestCaseNumber = testCaseNumbers[testCaseNumbers.length - 1];

  const lastTestCaseResult = results[lastTestCaseNumber];

  let status;

  if (lastTestCaseResult.status === "fail") {
    console.log(`Test Case #${lastTestCaseNumber} failed.`);
    status = "Attempted";
  } else {
    console.log("All Test Cases passed");
    status = "Solved";
  }

  updateQuestionStatus(question_id, status, userId)}

export default checkTestCases;
