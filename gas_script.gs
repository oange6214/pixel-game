function doGet(e) {
  var action = e.parameter.action;
  
  if (action === 'getQuestions') {
    return handleGetQuestions(e);
  } else if (action === 'submitScore') {
    var data = {
      id: e.parameter.id,
      answers: e.parameter.answers ? JSON.parse(e.parameter.answers) : {},
      threshold: parseInt(e.parameter.threshold) || 3
    };
    return handleSubmitScore(data);
  }
  
  return ContentService.createTextOutput(JSON.stringify({ error: "Invalid action" }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({ error: "Invalid JSON body" }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  var action = data.action;
  if (action === 'submitScore') {
    return handleSubmitScore(data);
  }
  
  return ContentService.createTextOutput(JSON.stringify({ error: "Invalid action" }))
    .setMimeType(ContentService.MimeType.JSON);
}

// 處理取得題目
function handleGetQuestions(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("題目");
  if (!sheet) {
    return ContentService.createTextOutput(JSON.stringify({ error: "找不到「題目」工作表" }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  var count = parseInt(e.parameter.count) || 5; // 預設 5 題
  var data = sheet.getDataRange().getValues();
  
  // 第一列為標題 (題號、A、B、C、D、解答)
  var headers = data[0];
  var questions = [];
  
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    if (row[0] === "") continue; // 略過空列
    
    questions.push({
      id: row[0],
      question: row[1],
      A: row[2],
      B: row[3],
      C: row[4],
      D: row[5],
      answer: row[6], // 這次將解答傳給前端，以便在結算畫面顯示正確答案
    });
  }
  
  // 隨機打亂並取前 count 題
  questions.sort(function() { return 0.5 - Math.random() });
  var selectedQuestions = questions.slice(0, count);
  
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    data: selectedQuestions
  })).setMimeType(ContentService.MimeType.JSON);
}

// 處理送出成績並計算
function handleSubmitScore(data) {
  var id = data.id;
  var answers = data.answers; // 格式: { "題號1": "A", "題號2": "B" ... }
  var threshold = data.threshold || 3;
  
  if (!id || !answers) {
    return ContentService.createTextOutput(JSON.stringify({ error: "缺少必要參數 ID 或 answers" }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  // 1. 計算分數
  var qSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("題目");
  var qData = qSheet.getDataRange().getValues();
  var correctMap = {}; // { "題號": "解答" }
  
  for (var i = 1; i < qData.length; i++) {
    var row = qData[i];
    correctMap[row[0].toString()] = row[6]; // 第 7 欄是解答
  }
  
  var score = 0;
  var totalQuestions = Object.keys(answers).length;
  
  for (var qId in answers) {
    var ans = answers[qId];
    if (correctMap[qId.toString()] && correctMap[qId.toString()].toString().toUpperCase() === ans.toString().toUpperCase()) {
      score++;
    }
  }
  
  var isPassed = score >= threshold;
  
  // 2. 更新「回答」工作表
  // ID、闖關次數、總分、最高分、第一次通關分數、花了幾次通關、最近遊玩時間
  var aSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("回答");
  if (!aSheet) {
    return ContentService.createTextOutput(JSON.stringify({ error: "找不到「回答」工作表" }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  var aData = aSheet.getDataRange().getValues();
  var rowIndex = -1;
  
  for (var i = 1; i < aData.length; i++) {
    if (aData[i][0].toString() === id.toString()) {
      rowIndex = i + 1; // getRange 是 1-based
      break;
    }
  }
  
  var now = new Date();
  var timestamp = Utilities.formatDate(now, Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss");
  
  if (rowIndex === -1) {
    // 新玩家
    var playCount = 1;
    var totalScore = score;
    var highestScore = score;
    var firstPassScore = isPassed ? score : "";
    var passCountUsed = isPassed ? 1 : "";
    
    aSheet.appendRow([id, playCount, totalScore, highestScore, firstPassScore, passCountUsed, timestamp]);
  } else {
    // 舊玩家
    // 取得舊資料
    var oldPlayCount = parseInt(aSheet.getRange(rowIndex, 2).getValue()) || 0;
    var oldTotalScore = parseInt(aSheet.getRange(rowIndex, 3).getValue()) || 0;
    var oldHighestScore = parseInt(aSheet.getRange(rowIndex, 4).getValue()) || 0;
    var oldFirstPassScore = aSheet.getRange(rowIndex, 5).getValue();
    var oldPassCountUsed = aSheet.getRange(rowIndex, 6).getValue();
    
    var newPlayCount = oldPlayCount + 1;
    var newTotalScore = oldTotalScore + score;
    var newHighestScore = Math.max(oldHighestScore, score);
    
    var newFirstPassScore = oldFirstPassScore;
    var newPassCountUsed = oldPassCountUsed;
    
    // 若以前未通過，而這次通過了
    if (oldFirstPassScore === "" && isPassed) {
      newFirstPassScore = score;
      newPassCountUsed = newPlayCount;
    }
    
    aSheet.getRange(rowIndex, 2).setValue(newPlayCount);
    aSheet.getRange(rowIndex, 3).setValue(newTotalScore);
    aSheet.getRange(rowIndex, 4).setValue(newHighestScore);
    aSheet.getRange(rowIndex, 5).setValue(newFirstPassScore);
    aSheet.getRange(rowIndex, 6).setValue(newPassCountUsed);
    aSheet.getRange(rowIndex, 7).setValue(timestamp);
  }
  
  // 回傳結果
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    score: score,
    isPassed: isPassed,
    totalQuestions: totalQuestions
  })).setMimeType(ContentService.MimeType.JSON);
}

// 支援 CORS
function doOptions(e) {
  return ContentService.createTextOutput("OK")
    .setMimeType(ContentService.MimeType.TEXT);
}
