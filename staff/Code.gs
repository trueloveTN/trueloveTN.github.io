// =============================================
//  崇愛居家員工教育訓練系統 - GAS 後端
//  A=姓名, B=身份證, C=觀看日期, D=影片ID, E=課程名稱, F=觀看分鐘, G=是否完成, H=備註, I=目前觀看秒數
// =============================================

var SPREADSHEET_ID = "1BLxAXErHDbvR-A-RysJYSF6tkcPNCg1CYXXAXWTwNjE";
var SHEET_ACCOUNTS = "員工帳號";
var SHEET_RECORDS  = "訓練紀錄";
var COURSES = [
   { id: "AOwC6qQVmvo", title: "⚠️ 職業安全衛生教育訓練",            duration: 185  },
   { id: "IVbYrbcB4C4", title: "🩺 居家服務感染控制 上",   duration: 161  },
   { id: "0VPBY33uJKk", title: "🩺 居家服務感染控制 下",    duration: 99   },
   { id: "e3Y4Jfe4U6I", title: "⚠️ 居家服務 意外事件處理", duration: 103  }
];

// ==========================================
//  統一錯誤包裝（讓所有入口函式例外時仍回傳 JSON）
// ==========================================
function safeExecute(fn) {
  return function(e) {
    try {
      return fn(e);
    } catch (err) {
      return json({ error: err.toString() }, 500);
    }
  };
}

// ==========================================
//  Web App 進入點（GET）
// ==========================================
function doGet(e) {
  var action = e.parameter.action || "";
  if (action === "login_check") return loginCheck(e);
  if (action === "getProfile")  return getProfile(e);
  if (action === "getRecords")   return getRecords(e);
  if (action === "saveWatch")    return doGetSaveWatch(e);
  return HtmlService.createHtmlOutput("員工教育訓練 API 正常");
}
doGet = safeExecute(doGet);

// ==========================================
//  GET: saveWatch（對應 dashboard.html 的 fetch GET）
// ==========================================
function doGetSaveWatch(e) {
  var ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(SHEET_RECORDS);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_RECORDS);
    sheet.getRange(1,1,1,9).setValues([["姓名","身份證","觀看日期","影片ID","課程名稱","觀看分鐘","是否完成","備註","目前觀看秒數"]]);
  }

  var idCard   = (e.parameter.idCard   || "").toUpperCase().trim();
  var videoId  = (e.parameter.videoId  || "").trim();
  var minutes  = parseInt(e.parameter.minutes, 10) || 0;
  var done     = e.parameter.done === "true";
  var note     = e.parameter.note || "";
  var currentTime = parseInt(e.parameter.currentTime) || 0;

  // 查課程標題
  var title = videoId;
  COURSES.forEach(function(c){ if(c.id === videoId) title = c.title; });

  // 查姓名
  var name = getNameByIdCard(idCard);

  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if ((data[i][1]||"").toString().toUpperCase().trim() === idCard &&
        (data[i][3]||"").toString().trim() === videoId) {
      // 找到同身份證+同影片→更新 C~I 欄
      sheet.getRange(i+1,3,1,7).setValues([[new Date(), videoId, title, minutes, done, note, currentTime]]);
      if (!data[i][0]) sheet.getRange(i+1,1).setValue(name);  // 若姓名空白才補
      // ---- 完成判斷 ----
      evaluateAndUpdateCompletion(ss, idCard);
      return json({ ok: true, updated: true, name: name });
    }
  }
  // 沒找到→新增一列
  sheet.appendRow([name, idCard, new Date(), videoId, title, minutes, done, note, currentTime]);
  // ---- 完成判斷 ----
  evaluateAndUpdateCompletion(ss, idCard);
  return json({ ok: true, updated: false, name: name });
}

// ==========================================
//  Web App 進入點（POST）
// ==========================================
function doPost(e) {
  var p = JSON.parse(e.postData.contents);
  var action = p.action || "";
  try {
    if (action === "login")     return login(p);
    if (action === "saveWatch") return doPostSaveWatch(p);
    if (action === "getCourses") return getCourses(p);
    return json({ error: "未知指令" }, 400);
  } catch(err) {
    return json({ error: err.message }, 500);
  }
}

// ==========================================
//  POST: saveWatch
// ==========================================
function doPostSaveWatch(p) {
  var ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(SHEET_RECORDS);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_RECORDS);
    sheet.getRange(1,1,1,9).setValues([["姓名","身份證","觀看日期","影片ID","課程名稱","觀看分鐘","是否完成","備註","目前觀看秒數"]]);
  }

  var idCard  = (p.idCard  || "").toUpperCase().trim();
  var videoId = (p.videoId || "").trim();
  var minutes = parseInt(p.minutes) || 0;
  var done    = p.done === true || p.done === "true";
  var note    = p.note || "";
  var currentTime = parseInt(p.currentTime) || 0;

  var title = videoId;
  COURSES.forEach(function(c){ if(c.id === videoId) title = c.title; });

  var name  = name || getNameByIdCard(idCard);
  var data  = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if ((data[i][1]||"").toString().toUpperCase().trim() === idCard &&
        (data[i][3]||"").toString().trim() === videoId) {
      sheet.getRange(i+1,3,1,7).setValues([[new Date(), videoId, title, minutes, done, note, currentTime]]);
      if (!data[i][0]) sheet.getRange(i+1,1).setValue(name);
      // ---- 完成判斷 ----
      evaluateAndUpdateCompletion(ss, idCard);
      return json({ ok: true, updated: true, name: name });
    }
  }
  sheet.appendRow([name, idCard, new Date(), videoId, title, minutes, done, note, currentTime]);
  // ---- 完成判斷 ----
  evaluateAndUpdateCompletion(ss, idCard);
  return json({ ok: true, updated: false, name: name });
}

// ==========================================
//  GET: 驗證登入
// ==========================================
function loginCheck(e) {
  var ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(SHEET_ACCOUNTS);
  if (!sheet) return json({ error: "找不到員工帳號表" });
  var data   = sheet.getDataRange().getValues();
  var idCard    = (e.parameter.idCard    || "").toUpperCase().trim();
  var birthday  = (e.parameter.birthday || "").trim();
  for (var i = 1; i < data.length; i++) {
    var rowId = (data[i][0] || "").toString().toUpperCase().trim();
    var rowPw = (data[i][2] || "").toString().trim();
    if (rowId === idCard && rowPw === birthday) {
      return json({ ok: true, idCard: idCard, name: data[i][1] || "" });
    }
  }
  return json({ ok: false, error: "身份證字號或生日錯誤" });
}
loginCheck = safeExecute(loginCheck);

// ==========================================
//  POST: 登入
// ==========================================
function login(p) {
  var ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(SHEET_ACCOUNTS);
  if (!sheet) return json({ error: "找不到員工帳號表" }, 500);
  var data   = sheet.getDataRange().getValues();
  var idCard    = (p.idCard    || "").toUpperCase().trim();
  var birthday  = (p.birthday || "").trim();
  for (var i = 1; i < data.length; i++) {
    var rowId = (data[i][0] || "").toString().toUpperCase().trim();
    var rowPw = (data[i][2] || "").toString().trim();
    if (rowId === idCard && rowPw === birthday) {
      return json({ ok: true, idCard: idCard, name: data[i][1] || "" });
    }
  }
  return json({ error: "身份證字號或生日錯誤" }, 401);
}
login = safeExecute(login);

// ==========================================
//  GET: 讀取觀看紀錄
// ==========================================
function getRecords(e) {
  var ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(SHEET_RECORDS);
  if (!sheet) return json({ records: [] });
  var data   = sheet.getDataRange().getValues();
  var idCard  = (e.parameter.idCard || "").toUpperCase().trim();
  var result  = [];
  for (var i = 1; i < data.length; i++) {
    if ((data[i][1]||"").toString().toUpperCase().trim() === idCard) {
      result.push({
        name:    data[i][0] || "",
        idCard:  data[i][1] || "",
        date:    data[i][2],
        videoId: data[i][3] || "",
        title:   data[i][4] || "",
        minutes: data[i][5] || 0,
        done:    data[i][6] || false,
        currentTime: data[i][8] || 0
      });
    }
  }
  return json({ records: result });
}
getRecords = safeExecute(getRecords);

// ==========================================
//  GET: 取得員工姓名
// ==========================================
function getProfile(e) {
  var ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(SHEET_ACCOUNTS);
  if (!sheet) return json({ name: "" });
  var data   = sheet.getDataRange().getValues();
  var idCard  = (e.parameter.idCard || "").toUpperCase().trim();
  for (var i = 1; i < data.length; i++) {
    if ((data[i][0]||"").toString().toUpperCase().trim() === idCard) {
      return json({ name: data[i][1] || "" });
    }
  }
  return json({ name: "" });
}
getProfile = safeExecute(getProfile);

// ==========================================
//  POST: 課程列表
// ==========================================
function getCourses(p) {
  return json({ courses: COURSES });
}
getCourses = safeExecute(getCourses);

// ==========================================
//  工具：透過 idCard 查詢員工姓名
//  （員工帳號表 A=身份證, B=姓名）
// ==========================================
function getNameByIdCard(idCard) {
  var ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(SHEET_ACCOUNTS);
  if (!sheet) return "";
  var data  = sheet.getDataRange().getValues();
  var card  = (idCard || "").toString().toUpperCase().trim();
  for (var i = 1; i < data.length; i++) {
    if ((data[i][0]||"").toString().toUpperCase().trim() === card) {
      return data[i][1] || "";
    }
  }
  return "";
}

// ==========================================
//  工具：依照評鑑標準自動更新完成狀式（是否完成 欄）
// ==========================================
function evaluateAndUpdateCompletion(ss, idCard) {
  var sheet = ss.getSheetByName(SHEET_RECORDS);
  if (!sheet) return;

  var data   = sheet.getDataRange().getValues(); // 包含標題列
  var COL_DONE = 7; // G 欄 = 是否完成

  // 先把該 idCard 的所有紀錄讀進來：videoId -> {row, minutes}
  var records = {}; // videoId => {row: Number (1‑based sheet row), minutes: Number}
  for (var r = 1; r < data.length; r++) {
    var rowIdCard = (data[r][1] || "").toString().toUpperCase().trim();
    if (rowIdCard !== idCard) continue;
    var vid = (data[r][3] || "").toString().trim();
    var min = parseInt(data[r][5]) || 0;
    // 關鍵修正：使用試算表的實際列號 = r + 1
    records[vid] = {row: r + 1, minutes: min};
  }

  var updates = []; // 每筆為 [rowIndex, colIndex, value]

  // ---- 職業安全衛生教育訓練 (需要 180 分鐘) ----
  var safetyVid = "AOwC6qQVmvo";
  if (records[safetyVid] && records[safetyVid].minutes >= 180) {
    updates.push([records[safetyVid].row, COL_DONE, true]);
  }

  // ---- 居家服務 意外事件處理 (需要 60 分鐘) ----
  var accidentVid = "e3Y4Jfe4U6I";
  if (records[accidentVid] && records[accidentVid].minutes >= 60) {
    updates.push([records[accidentVid].row, COL_DONE, true]);
  }

  // ---- 感染控制群組：上+下 總分鐘 >= 240 ----
  var infUp   = "IVbYrbcB4C4";
  var infDown = "0VPBY33uJKk";
  var totalInf = 0;
  if (records[infUp])   totalInf += records[infUp].minutes;
  if (records[infDown]) totalInf += records[infDown].minutes;
  if (totalInf >= 240) {
    if (records[infUp])   updates.push([records[infUp].row,   COL_DONE, true]);
    if (records[infDown]) updates.push([records[infDown].row, COL_DONE, true]);
  }

  // 執行更新（如果有需要）
  if (updates.length > 0) {
    updates.forEach(function(u){
      // 防止超出工作表範圍（可選）
      var maxRow = sheet.getMaxRows();
      var maxCol = sheet.getMaxColumns();
      if (u[0] >= 1 && u[0] <= maxRow && u[1] >= 1 && u[1] <= maxCol) {
        sheet.getRange(u[0], u[1]).setValue(u[2]);
      }
    });
  }
}

// ==========================================
//  工具
// ==========================================
function json(obj, status) {
  var out = ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
  if (status) out.setStatusCode(status);
  return out;
}