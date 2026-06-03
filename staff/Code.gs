// =============================================
//  崇愛居家員工教育訓練系統 - GAS 後端
//  A=姓名, B=身份證, C=觀看日期, D=影片ID, E=課程名稱, F=觀看分鐘, G=是否完成, H=備註
// =============================================

var SPREADSHEET_ID = "1BLxAXErHDbvR-A-RysJYSF6tkcPNCg1CYXXAXWTwNjE";
var SHEET_ACCOUNTS = "員工帳號";
var SHEET_RECORDS  = "訓練紀錄";
var COURSES = [
   { id: "k8wKvRatFDY", title: "職業安全衛生教育訓練",            duration: 6  },
   { id: "B0S50-7a5P0", title: "長期照顧服務人員在職教育訓練",   duration: 8  },
   { id: "_y07M0a0cTU", title: "CPR+AED 急救訓練",                duration: 10 },
   { id: "k3V0c1HqMdA", title: "居家服務倫理與個案隱私保護",      duration: 12 }
];

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

// ==========================================
//  GET: saveWatch（對應 dashboard.html 的 fetch GET）
// ==========================================
function doGetSaveWatch(e) {
  var ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(SHEET_RECORDS);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_RECORDS);
    sheet.getRange(1,1,1,8).setValues([["姓名","身份證","觀看日期","影片ID","課程名稱","觀看分鐘","是否完成","備註"]]);
  }

  var idCard   = (e.parameter.idCard   || "").toUpperCase().trim();
  var name     = (e.parameter.name     || "").trim();
  var videoId  = (e.parameter.videoId  || "").trim();
  var minutes  = parseInt(e.parameter.minutes, 10) || 0;
  var done     = e.parameter.done === "true";
  var note     = e.parameter.note || "";

  // 查課程標題
  var title = videoId;
  COURSES.forEach(function(c){ if(c.id === videoId) title = c.title; });

  // 查姓名（優先用傳入的 name，沒有才查表）
  if (!name) name = getNameByIdCard(idCard);

  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if ((data[i][1]||"").toString().toUpperCase().trim() === idCard &&
        (data[i][3]||"").toString().trim() === videoId) {
      // 找到同身份證+同影片→更新 C~H 欄
      sheet.getRange(i+1,3,1,6).setValues([[new Date(), videoId, title, minutes, done, note]]);
      if (!data[i][0]) sheet.getRange(i+1,1).setValue(name);  // 若姓名空白才補
      return json({ ok: true, updated: true, name: name });
    }
  }
  // 沒找到→新增一列
  sheet.appendRow([name, idCard, new Date(), videoId, title, minutes, done, note]);
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
    sheet.getRange(1,1,1,8).setValues([["姓名","身份證","觀看日期","影片ID","課程名稱","觀看分鐘","是否完成","備註"]]);
  }

  var idCard  = (p.idCard  || "").toUpperCase().trim();
  var name    = (p.name    || "").trim();
  var videoId = (p.videoId || "").trim();
  var minutes = parseInt(p.minutes) || 0;
  var done    = p.done === true || p.done === "true";
  var note    = p.note || "";

  var title = videoId;
  COURSES.forEach(function(c){ if(c.id === videoId) title = c.title; });

  var name  = name || getNameByIdCard(idCard);
  var data  = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if ((data[i][1]||"").toString().toUpperCase().trim() === idCard &&
        (data[i][3]||"").toString().trim() === videoId) {
      sheet.getRange(i+1,3,1,6).setValues([[new Date(), videoId, title, minutes, done, note]]);
      if (!data[i][0]) sheet.getRange(i+1,1).setValue(name);
      return json({ ok: true, updated: true, name: name });
    }
  }
  sheet.appendRow([name, idCard, new Date(), videoId, title, minutes, done, note]);
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
        done:    data[i][6] || false
      });
    }
  }
  return json({ records: result });
}

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

// ==========================================
//  POST: 課程列表
// ==========================================
function getCourses(p) {
  return json({ courses: COURSES });
}

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
//  工具
// ==========================================
function json(obj, status) {
  var out = ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
  if (status) out.setStatusCode(status);
  return out;
}