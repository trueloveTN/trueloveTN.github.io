+++
title = "員工專區"
date = 2025-01-01T00:00:00+08:00
draft = false
description = "員工專區 - 開會通知與教育訓練"
+++
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700&display=swap" rel="stylesheet">

<!-- ===== 權限檢查 ===== -->
<script>
(function() {
  if (sessionStorage.getItem("staff_auth") !== "ok") {
    document.body.innerHTML = '<div style="max-width:420px;margin:80px auto;text-align:center;font-family:sans-serif;">\
      <h2>🔒</h2><p>請先 <a href="/staff/login/">登入</a></p></div>';
  }
})();
</script>

<style>
body { font-family: 'Noto Sans TC', 'Helvetica Neue', sans-serif; }
.page-header { background: linear-gradient(135deg,#2c3e50,#34495e); color:#fff; padding:36px 0 32px; margin-bottom:36px; }
.page-header h1 { margin:0; font-size:26px; font-weight:600; }
.page-header p { margin:6px 0 0; opacity:0.75; font-size:14px; }
.staff-nav { margin-bottom:32px; }
.staff-nav a { display:inline-block; padding:8px 20px; border-radius:20px; background:#eee; color:#555; text-decoration:none; margin-right:8px; font-size:14px; transition:background 0.2s; }
.staff-nav a:hover, .staff-nav a.active { background:#e07b54; color:#fff; }
.section-title { color:#2c3e50; font-size:20px; font-weight:700; margin-bottom:20px; padding-bottom:10px; border-bottom:2px solid #e07b54; }
.notice-item { background:#fff; border-radius:8px; padding:20px; margin-bottom:14px; border-left:4px solid #e07b54; box-shadow:0 1px 6px rgba(0,0,0,0.07); }
.notice-item h4 { margin:0 0 6px; color:#2c3e50; font-size:16px; }
.notice-item .notice-date { font-size:12px; color:#aaa; }
.notice-item .notice-tag { display:inline-block; background:#fdf0ea; color:#c4623a; font-size:11px; padding:2px 8px; border-radius:10px; margin-left:8px; }
.video-card { background:#fff; border-radius:10px; overflow:hidden; box-shadow:0 2px 12px rgba(0,0,0,0.08); margin-bottom:28px; border:1px solid #eee; }
.video-card iframe { width:100%; aspect-ratio:16/9; display:block; border:none; }
.video-info { padding:18px 20px; }
.video-info h4 { margin:0 0 6px; color:#2c3e50; font-size:16px; }
.video-meta { font-size:13px; color:#888; margin-bottom:10px; }
.video-desc { font-size:13px; color:#555; line-height:1.6; margin-bottom:12px; }
.progress-bar-wrap { background:#f0f0f0; border-radius:10px; height:8px; overflow:hidden; }
.progress-bar-fill { height:100%; background:linear-gradient(90deg,#7a9e7e,#5a8e5e); border-radius:10px; transition:width 0.5s ease; width:0%; }
.watched-badge { background:#7a9e7e; color:#fff; font-size:11px; padding:3px 10px; border-radius:20px; display:inline-block; }
.not-watched { background:#ccc; color:#666; font-size:11px; padding:3px 10px; border-radius:20px; display:inline-block; }
.stats-summary { display:grid; grid-template-columns:repeat(auto-fit,minmax(150px,1fr)); gap:16px; margin-bottom:36px; }
.stats-card { background:linear-gradient(135deg,#e07b54,#c4623a); color:#fff; border-radius:12px; padding:22px 16px; text-align:center; }
.stats-card.dark { background:linear-gradient(135deg,#2c3e50,#34495e); }
.stats-card h2 { font-size:32px; margin:0; font-weight:700; }
.stats-card p { margin:4px 0 0; opacity:0.85; font-size:13px; }
</style>

<div class="container">

  <!-- 頁首 -->
  <div class="page-header">
    <div class="container">
      <h1>👥 員工專區</h1>
      <p>開會通知 & 教育訓練課程</p>
    </div>
  </div>

  <!-- 快速導航 -->
  <div class="staff-nav">
    <a href="#notice" class="active">📢 開會通知</a>
    <a href="#training">🎓 教育訓練</a>
  </div>

  <!-- ===== 觀看統計摘要 ===== -->
  <div class="stats-summary" id="stats-summary">
    <div class="stats-card dark">
      <h2 id="stat-total">載入中…</h2>
      <p>已觀看影片數</p>
    </div>
    <div class="stats-card">
      <h2 id="stat-watch-time">--</h2>
      <p>總觀看時數（分鐘）</p>
    </div>
    <div class="stats-card dark">
      <h2 id="stat-done">--</h2>
      <p>已完成課程</p>
    </div>
    <div class="stats-card">
      <h2 id="stat-remaining">--</h2>
      <p>待完成課程</p>
    </div>
  </div>

  <!-- ===== 開會通知 ===== -->
  <h2 class="section-title" id="notice">📢 開會通知</h2>

  <div class="notice-item">
    <h4>113年度照服員在職教育訓練籌備會議 <span class="notice-tag">重要</span></h4>
    <div class="notice-date">📅 2025/01/10（五）14:00</div>
    <p style="margin:10px 0 0; font-size:14px; color:#555;">地點：機構辦公室（臺南市東區東門路三段253號11樓之3）<br>出席人員：全體照服員、管理師<br>主持人：吳主任<br>請準時出席，若無法參加請提前告知。</p>
  </div>

  <div class="notice-item">
    <h4>個案管理系統教育訓練說明會</h4>
    <div class="notice-date">📅 2025/01/18（六）10:00</div>
    <p style="margin:10px 0 0; font-size:14px; color:#555;">地點：機構會議室<br>攜帶：筆電（可自行攜帶或使用機構平板）<br>內容：新個案系統操作說明、常見問題演練</p>
  </div>

  <!-- ===== 教育訓練 ===== -->
  <h2 class="section-title" id="training">🎓 教育訓練影片</h2>
  <p style="color:#888; font-size:13px; margin-bottom:20px;">
    💡 觀看完畢後系統會記錄您的觀看進度。請使用 Chrome/Firefox 以獲得最佳體驗。
  </p>

  <!-- 影片 1 -->
  <div class="video-card" data-video-id="B0S50-7a5P0" data-duration="480">
    <div class="video-embed-wrap">
      <iframe
        id="video-B0S50-7a5P0"
        src="https://www.youtube.com/embed/B0S50-7a5P0?enablejsapi=1&rel=0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen>
      </iframe>
    </div>
    <div class="video-info">
      <h4>🔥 長期照顧服務人員在職教育訓練（110年度修訂版）</h4>
      <div class="video-meta">
        <i class="far fa-clock"></i> 片長：約8分鐘 &nbsp;|&nbsp;
        <i class="far fa-calendar"></i> 2024/12/05
      </div>
      <div class="video-desc">本影片為衛福部111年公告之長照人員在職教育訓練標準課程，適用於全體照服員及個管師。請確實觀看完畢並完成測驗。</div>
      <div style="margin-bottom:8px;">
        <span class="watch-status not-watched">未觀看</span>
        <span style="float:right; font-size:12px; color:#aaa;" class="watch-pct">0%</span>
      </div>
      <div class="progress-bar-wrap">
        <div class="progress-bar-fill"></div>
      </div>
    </div>
  </div>

  <!-- 影片 2 -->
  <div class="video-card" data-video-id="_y07M0a0cTU" data-duration="600">
    <div class="video-embed-wrap">
      <iframe
        id="video-_y07M0a0cTU"
        src="https://www.youtube.com/embed/_y07M0a0cTU?enablejsapi=1&rel=0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen>
      </iframe>
    </div>
    <div class="video-info">
      <h4>🩺 急救訓練：CPR+AED 完整操作教學</h4>
      <div class="video-meta">
        <i class="far fa-clock"></i> 片長：約10分鐘 &nbsp;|&nbsp;
        <i class="far fa-calendar"></i> 2024/12/05
      </div>
      <div class="video-desc">110年修訂版 CPR+AED 完整操作流程（含成人、兒童、嬰兒情境）。每位照服員須每年複訓，請確實觀看。</div>
      <div style="margin-bottom:8px;">
        <span class="watch-status not-watched">未觀看</span>
        <span style="float:right; font-size:12px; color:#aaa;" class="watch-pct">0%</span>
      </div>
      <div class="progress-bar-wrap">
        <div class="progress-bar-fill"></div>
      </div>
    </div>
  </div>

  <!-- 影片 3 -->
  <div class="video-card" data-video-id="k3V0c1HqMdA" data-duration="720">
    <div class="video-embed-wrap">
      <iframe
        id="video-k3V0c1HqMdA"
        src="https://www.youtube.com/embed/k3V0c1HqMdA?enablejsapi=1&rel=0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen>
      </iframe>
    </div>
    <div class="video-info">
      <h4>🌿 居家服務倫理與個案隱私保護</h4>
      <div class="video-meta">
        <i class="far fa-clock"></i> 片長：約12分鐘 &nbsp;|&nbsp;
        <i class="far fa-calendar"></i> 2024/11/14
      </div>
      <div class="video-desc">居家服務過程中的倫理議題與個案隱私保護注意事項，幫助照服員在提供服務時維護個案尊嚴與權益。</div>
      <div style="margin-bottom:8px;">
        <span class="watch-status not-watched">未觀看</span>
        <span style="float:right; font-size:12px; color:#aaa;" class="watch-pct">0%</span>
      </div>
      <div class="progress-bar-wrap">
        <div class="progress-bar-fill"></div>
      </div>
    </div>
  </div>

  <!-- 管理員區（顯示統計後台） -->
  <div style="margin-top:48px; padding:24px; background:#f8f8f8; border-radius:10px; border:1px dashed #ccc;">
    <h4 style="color:#888; margin:0 0 8px; font-size:14px;">📊 機構管理員檢視（管理師/主任）</h4>
    <p style="font-size:13px; color:#aaa; margin:0 0 12px;">
      ⚠️ 以下統計為「目前瀏覽此頁的員工」之本機資料（localStorage）。若要集體管理觀看時數，需建置後端系統。
    </p>
    <button onclick="exportStaffData()" class="btn btn-sm" style="background:#2c3e50; color:#fff; border:none; padding:8px 16px; border-radius:6px; font-size:13px;">
      📥 匯出我的觀看記錄（JSON）
    </button>
  </div>

</div><!-- /.container -->

<script>
// ===== 觀看時數追蹤系統（localStorage）=====

var TOTAL_VIDEOS = 3;
var staffId = "staff_" + (sessionStorage.getItem("staff_auth") || "guest");

function getStore() {
  try {
    return JSON.parse(localStorage.getItem("tltn_watch_" + staffId) || "{}");
  } catch(e) { return {}; }
}

function saveStore(data) {
  localStorage.setItem("tltn_watch_" + staffId, JSON.stringify(data));
}

function initVideoTracking() {
  var store = getStore();

  document.querySelectorAll(".video-card").forEach(function(card) {
    var vid = card.getAttribute("data-video-id");
    var duration = parseInt(card.getAttribute("data-duration")) || 480;
    var data = store[vid] || { watched: 0, done: false, lastTime: 0 };

    updateCardUI(card, data, duration);

    // 嘗試從 YouTube iframe 取得實際播放時間
    var iframe = card.querySelector("iframe");
    var player = null;
    if (typeof YT !== "undefined" && YT.Player) {
      player = new YT.Player(iframe.id, {
        events: {
          "onStateChange": function(e) {
            // YT.PlayerState.PLAYING = 1, PAUSED = 2, ENDED = 0
            if (e.data === 1) {
              startTimer(vid, duration, card, player);
            }
            if (e.data === 2 || e.data === 0) {
              stopTimer(vid, card);
            }
          }
        }
      });
    } else {
      // 如果 YouTube API 未載入，嘗試定時檢查
      var checkInterval = setInterval(function() {
        if (typeof YT !== "undefined" && YT.Player) {
          clearInterval(checkInterval);
          // 重新初始化
          initVideoTracking();
        }
      }, 500);
      // fallback: 當使用者點擊 iframe（進入全螢幕）就開始計時
      iframe.addEventListener("click", function() {
        if (!player || player.getPlayerState() !== 1) return;
        startTimer(vid, duration, card, player);
      });
    }
  });

  updateStats();
}

var activeTimers = {};

function startTimer(vid, duration, card, player) {
  if (activeTimers[vid]) return;
  var started = Date.now();
  activeTimers[vid] = setInterval(function() {
    var store = getStore();
    var elapsed = Math.floor((Date.now() - started) / 1000) + (store[vid] ? store[vid].watched : 0);
    var pct = Math.min(100, Math.round((elapsed / duration) * 100));
    card.querySelector(".progress-bar-fill").style.width = pct + "%";
    card.querySelector(".watch-pct").textContent = pct + "%";
    store[vid] = { watched: elapsed, done: elapsed >= duration * 0.8, lastTime: Date.now() };
    saveStore(store);
    updateBadge(card, elapsed, duration);
  }, 5000); // 每5秒存一次
}

function stopTimer(vid, card) {
  if (activeTimers[vid]) {
    clearInterval(activeTimers[vid]);
    delete activeTimers[vid];
  }
  updateStats();
}

function updateBadge(card, watched, duration) {
  var pct = Math.min(100, Math.round((watched / duration) * 100));
  var status = card.querySelector(".watch-status");
  if (watched >= duration * 0.8) {
    status.className = "watch-status watched-badge";
    status.textContent = "✓ 已看完";
  } else {
    status.className = "watch-status not-watched";
    status.textContent = "觀看中 " + pct + "%";
  }
}

function updateCardUI(card, data, duration) {
  var pct = Math.min(100, Math.round((data.watched / duration) * 100));
  card.querySelector(".progress-bar-fill").style.width = pct + "%";
  card.querySelector(".watch-pct").textContent = pct + "%";
  updateBadge(card, data.watched, duration);
}

function updateStats() {
  var store = getStore();
  var cards = document.querySelectorAll(".video-card");
  var done = 0, totalWatchedSec = 0;
  cards.forEach(function(c) {
    var v = c.getAttribute("data-video-id");
    if (store[v]) {
      totalWatchedSec += store[v].watched || 0;
      if (store[v].done) done++;
    }
  });
  var watchedMin = Math.round(totalWatchedSec / 60);

  document.getElementById("stat-total").textContent = Object.keys(store).length;
  document.getElementById("stat-watch-time").textContent = watchedMin;
  document.getElementById("stat-done").textContent = done;
  document.getElementById("stat-remaining").textContent = TOTAL_VIDEOS - done;
}

function exportStaffData() {
  var store = getStore();
  var blob = new Blob([JSON.stringify({ staffId: staffId, records: store, exportedAt: new Date().toISOString() }, null, 2)], { type: "application/json" });
  var a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "tltn_watch_record_" + new Date().toISOString().slice(0,10) + ".json";
  a.click();
}

// YouTube IFrame API
var tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
var firstScript = document.getElementsByTagName("script")[0];
firstScript.parentNode.insertBefore(tag, firstScript);

window.onYouTubeIframeAPIReady = function() {
  initVideoTracking();
};

// 若API已載入直接初始化
if (typeof YT !== "undefined" && YT.Player) {
  initVideoTracking();
}

// 登出
function staffLogout() {
  sessionStorage.removeItem("staff_auth");
  window.location.href = "/staff/login/";
}
</script>
