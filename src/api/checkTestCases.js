function checkTestCases(results) {
  const testCaseNumbers = Object.keys(results).map(Number);

  const lastTestCaseNumber = testCaseNumbers[testCaseNumbers.length - 1];

  const lastTestCaseResult = results[lastTestCaseNumber];

  if (lastTestCaseResult.status === "fail") {
    console.log(`Test Case #${lastTestCaseNumber} failed.`);
    const uid = localStorage.getItem('user')
    
  } else {
    console.log("All Test Cases passed")
    
  }
}

export default checkTestCases
