const keywordScoreSheetID = "1oS97Q1yXQmXX79PDSIZXTp0s1UP7gWwM9uL-L0FWAhk"

async function displayGoalScore(){
  let exampleGoals = [
    'A U B B C D E F',
    'A A B B C D E F',
    'A F B D C D E F',
    'A E B B C D E F',
  ]
  // Convert the text values into numerical values
  let scores = await convertGoalFromTextToNumerical(exampleGoals)
  console.log("Goal Scores:", scores)
}

/**
 * Convert from text values into numerical values for a goal.
 * 
 * @params {goals} an array of goals in String format.
 * @return {scores} an array of corresponding score for each goal.
 */
async function convertGoalFromTextToNumerical(goals){
  // Retrieve the keywords and its mapping value here 
  let keywordScores = await getKeyWordNumericalValue()
  let keywords = keywordScores.map(kwScore => kwScore[0])
  let mappingScores = keywordScores.map(kwScore => kwScore[1])

  // Perform the conversion
  let scores = []
  for (const goalIndex in goals){
    let goal = goals[goalIndex]
    let score = await generateScore(goal, keywords, mappingScores)
    scores.push(score)
  }
  return scores
}

// Generate score based on text-valued goal and prepropulated keywords and mapping scored
async function generateScore(goal, keywords, mappingScores) {
  let partialScores = []

  // Preprocessing the goal
  let words = await preprocessingText(goal)

  // Get the mapping score for each keyword found
  for (const wordIndex in words) {
    const word = words[wordIndex]
    if (keywords.includes(word)){
      let index = keywords.indexOf(word)
      partialScores.push(Number(mappingScores[index]))
    }
  }

  // Processing the score of the goal 
  const score = calculateGoalScore(partialScores)
  return score
}

// Preprocessing the text-valued goal
function preprocessingText(goal){
  return goal.toLowerCase().split(' ')
}

// Calculate the representative score for a goal
function calculateGoalScore(scores){
  // Decide an algorithm to calculate the overall score for a goal
  // For example, calculate the average score
  let goalScore = 0
  scores.forEach(score => goalScore += score)
  return goalScore / scores.length
}

function getKeyWordNumericalValue() {
  // Retrieve the keywords and value from Google Sheet 
  // https://docs.google.com/spreadsheets/d/1oS97Q1yXQmXX79PDSIZXTp0s1UP7gWwM9uL-L0FWAhk/edit#gid=0
  const rangeName = 'Sheet1!A2:B'
  let keywords = []
  try {
    // Get the values from the spreadsheet using spreadsheetId and range.
    const values = Sheets.Spreadsheets.Values.get(keywordScoreSheetID, rangeName).values;
    //  Print the values from spreadsheet if values are available.
    if (!values) {
      console.log('No data found.');
      return;
    }
    for (const row in values) {
      keywords.push([String(values[row][0]).toLowerCase(), values[row][1]])
    }
    return keywords
  } catch (err) {
    // TODO (developer) - Handle Values.get() exception from Sheet API
    console.log(err.message);
  }
}
