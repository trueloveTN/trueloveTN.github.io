+++
title = "員工登入"
date = 2025-01-01T00:00:00+08:00
draft = false
description = "員工專區 - 請輸入密碼登入"
+++
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700&display=swap" rel="stylesheet">

<style>
body { background: #f5f5f5; font-family: 'Noto Sans TC', 'Helvetica Neue', sans-serif; }
.staff-logo { text-align: center; margin-bottom: 24px; }
.staff-logo h2 { margin: 12px 0 4px; color: #2c3e50; font-size: 22px; font-weight: 700; }
.staff-logo p { color: #888; font-size: 13px; margin: 0; }
</style>

<div id="login-section">
  <div class="staff-login-wrapper">
    <div class="staff-logo">
      <h2>👥 員工專區</h2>
      <p>請輸入員工密碼以繼續</p>
    </div>

    <div class="login-error" id="login-error">
      密碼錯誤，請重新輸入
    </div>

    <form id="login-form">
      <div class="form-group">
        <label for="staff-password" style="font-weight:500; color:#444;">員工密碼</label>
        <input type="password" class="form-control" id="staff-password"
               placeholder="請輸入密碼" autocomplete="current-password">
      </div>
      <button type="submit" class="btn btn-block" style="margin-top:8px;">
        <i class="fas fa-sign-in-alt"></i>&nbsp; 登入員工專區
      </button>
    </form>

    <div class="password-hint">
      💡 密碼為LINE群組公告之員工密碼，如需查詢請洽主管
    </div>
  </div>
</div>

<script>
(function() {
  // 如果已經登入，直接跳轉
  if (sessionStorage.getItem("staff_auth") === "ok") {
    window.location.href = "/staff/dashboard/";
    return;
  }

  var form = document.getElementById("login-form");
  form.addEventListener("submit", function(e) {
    e.preventDefault();
    var pw = document.getElementById("staff-password").value;
    // 密碼可在這裡修改
    var correct = "tltn2025";
    if (pw === correct) {
      sessionStorage.setItem("staff_auth", "ok");
      window.location.href = "/staff/dashboard/";
    } else {
      var err = document.getElementById("login-error");
      err.style.display = "block";
      document.getElementById("staff-password").value = "";
      document.getElementById("staff-password").focus();
    }
  });
})();
</script>
