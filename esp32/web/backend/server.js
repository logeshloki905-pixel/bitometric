<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>WorkIQ — AI Workforce Intelligence Agent</title>
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&family=Epilogue:wght@300;400;500;600&display=swap" rel="stylesheet"/>
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js"></script>
<style>
:root{
  --bg:#07090e;--s1:#0e1118;--s2:#141822;--s3:#1a1f2e;
  --b1:#1e2438;--b2:#262d42;--b3:#2e3650;
  --accent:#00e5a0;--accent2:#0085ff;--accent3:#ff6b35;
  --warn:#ffcc00;--purple:#a855f7;--pink:#ec4899;
  --text:#e8ecf4;--muted:#5a6180;--muted2:#3a4060;
  --r:14px;--rsm:8px;--rxs:5px;
  --fh:'Syne',sans-serif;--fm:'DM Mono',monospace;--fb:'Epilogue',sans-serif;
  --shadow:0 4px 24px rgba(0,0,0,.4);
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html{scroll-behavior:smooth;}
body{background:var(--bg);color:var(--text);font-family:var(--fb);font-size:14px;min-height:100vh;overflow-x:hidden;}

/* ═══ LAYOUT ═══ */
.shell{display:flex;min-height:100vh;}

/* ═══ SIDEBAR ═══ */
.sidebar{
  width:256px;flex-shrink:0;background:var(--s1);border-right:1px solid var(--b1);
  display:flex;flex-direction:column;position:fixed;top:0;left:0;bottom:0;z-index:100;
  transition:transform .3s;
}
.sb-logo{padding:24px 22px 18px;border-bottom:1px solid var(--b1);}
.logo-chip{display:flex;align-items:center;gap:10px;}
.logo-icon{
  width:36px;height:36px;border-radius:10px;flex-shrink:0;
  background:linear-gradient(135deg,var(--accent),var(--accent2));
  display:flex;align-items:center;justify-content:center;
  font-family:var(--fh);font-weight:800;font-size:14px;color:#000;
}
.logo-text{font-family:var(--fh);font-size:20px;font-weight:800;
  background:linear-gradient(135deg,var(--accent),var(--accent2));
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;}
.logo-sub{font-size:9px;color:var(--muted);font-family:var(--fm);letter-spacing:2px;text-transform:uppercase;margin-top:2px;}

.sb-nav{flex:1;padding:14px 10px;overflow-y:auto;}
.sb-section{font-size:9px;color:var(--muted2);font-family:var(--fm);text-transform:uppercase;letter-spacing:2px;padding:14px 12px 5px;}
.nav-item{
  display:flex;align-items:center;gap:10px;padding:10px 13px;border-radius:var(--rsm);
  cursor:pointer;transition:all .18s;font-weight:500;font-size:13px;color:var(--muted);
  margin-bottom:2px;border:none;background:none;width:100%;text-align:left;font-family:var(--fb);
}
.nav-item:hover{background:var(--s2);color:var(--text);}
.nav-item.active{background:rgba(0,229,160,.08);color:var(--accent);border:1px solid rgba(0,229,160,.12);}
.nav-item svg{width:16px;height:16px;flex-shrink:0;}
.nav-badge{
  margin-left:auto;background:var(--accent3);color:#fff;
  font-size:9px;font-weight:700;padding:2px 6px;border-radius:20px;font-family:var(--fm);
}
.nav-badge.new{background:var(--accent);color:#000;}

.sb-footer{
  padding:14px 20px;border-top:1px solid var(--b1);
  font-size:10px;color:var(--muted);font-family:var(--fm);
}
.sb-status{display:flex;align-items:center;gap:6px;margin-bottom:4px;}
.led{width:6px;height:6px;border-radius:50%;}
.led.ok{background:var(--accent);box-shadow:0 0 6px var(--accent);}
.led.fail{background:#ff4444;}
.led.idle{background:var(--muted);}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
.led.ok{animation:pulse 2s infinite;}

/* ═══ MAIN ═══ */
.main{margin-left:256px;flex:1;display:flex;flex-direction:column;min-height:100vh;}

/* ═══ TOPBAR ═══ */
.topbar{
  position:sticky;top:0;z-index:50;
  background:rgba(7,9,14,.9);backdrop-filter:blur(16px);
  border-bottom:1px solid var(--b1);
  padding:0 28px;height:62px;
  display:flex;align-items:center;justify-content:space-between;
}
.topbar-left{display:flex;align-items:center;gap:14px;}
.topbar-title{font-family:var(--fh);font-size:17px;font-weight:700;}
.topbar-right{display:flex;align-items:center;gap:10px;}
.topbar-clock{
  font-family:var(--fm);font-size:12px;color:var(--muted);
  background:var(--s2);padding:5px 12px;border-radius:20px;border:1px solid var(--b1);
}
.btn{
  padding:8px 16px;border-radius:var(--rsm);border:none;cursor:pointer;
  font-family:var(--fb);font-size:13px;font-weight:600;transition:all .18s;
  display:inline-flex;align-items:center;gap:6px;
}
.btn-accent{background:var(--accent);color:#000;}
.btn-accent:hover{filter:brightness(1.1);transform:translateY(-1px);}
.btn-outline{background:transparent;color:var(--text);border:1px solid var(--b2);}
.btn-outline:hover{border-color:var(--accent);color:var(--accent);}
.btn-purple{background:rgba(168,85,247,.2);color:var(--purple);border:1px solid rgba(168,85,247,.3);}
.btn-purple:hover{background:rgba(168,85,247,.3);}
.btn-sm{padding:6px 12px;font-size:12px;}
.btn-danger{background:rgba(239,68,68,.15);color:#ff6b6b;border:1px solid rgba(239,68,68,.25);}
.btn-danger:hover{background:rgba(239,68,68,.25);}

/* ═══ PAGES ═══ */
.page{display:none;padding:28px;animation:fadeUp .3s ease;}
.page.active{display:block;}
@keyframes fadeUp{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);}}
.page-head{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:24px;}
.page-title{font-family:var(--fh);font-size:22px;font-weight:700;}
.page-sub{color:var(--muted);font-size:12px;margin-top:3px;}

/* ═══ STAT CARDS ═══ */
.stat-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:14px;margin-bottom:24px;}
.stat-card{
  background:var(--s1);border:1px solid var(--b1);border-radius:var(--r);
  padding:20px 22px;position:relative;overflow:hidden;transition:border-color .2s,transform .2s;
}
.stat-card:hover{border-color:var(--accent);transform:translateY(-2px);}
.stat-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,var(--accent),var(--accent2));}
.stat-card.blue::before{background:linear-gradient(90deg,var(--accent2),var(--purple));}
.stat-card.orange::before{background:linear-gradient(90deg,var(--accent3),var(--warn));}
.stat-card.red::before{background:linear-gradient(90deg,#ff4444,var(--accent3));}
.stat-card.purple::before{background:linear-gradient(90deg,var(--purple),var(--pink));}
.stat-label{font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:1px;font-family:var(--fm);}
.stat-val{font-family:var(--fh);font-size:34px;font-weight:800;margin:7px 0 3px;line-height:1;}
.stat-meta{font-size:11px;color:var(--muted);}
.stat-icon{position:absolute;right:18px;top:50%;transform:translateY(-50%);opacity:.05;font-size:54px;}

/* ═══ CARD ═══ */
.card{background:var(--s1);border:1px solid var(--b1);border-radius:var(--r);padding:22px;margin-bottom:18px;}
.card-title{font-family:var(--fh);font-size:14px;font-weight:700;margin-bottom:14px;display:flex;align-items:center;gap:8px;}
.card-badge{font-family:var(--fm);font-size:9px;background:var(--s2);border:1px solid var(--b1);padding:2px 7px;border-radius:20px;color:var(--muted);font-weight:400;}

/* ═══ GRID ═══ */
.g2{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:18px;}
.g3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;margin-bottom:18px;}
.g4{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:14px;margin-bottom:18px;}
@media(max-width:1100px){.g3{grid-template-columns:1fr 1fr;}.g4{grid-template-columns:1fr 1fr;}}
@media(max-width:780px){.g2,.g3,.g4{grid-template-columns:1fr;}.main{margin-left:0;}}

/* ═══ TABLE ═══ */
.tbl-wrap{overflow-x:auto;}
table{width:100%;border-collapse:collapse;}
thead th{text-align:left;padding:10px 13px;font-size:9.5px;text-transform:uppercase;letter-spacing:1.5px;color:var(--muted);font-family:var(--fm);border-bottom:1px solid var(--b1);white-space:nowrap;background:var(--s2);}
tbody tr{border-bottom:1px solid var(--b1);transition:background .13s;}
tbody tr:last-child{border-bottom:none;}
tbody tr:hover{background:var(--s2);}
tbody td{padding:11px 13px;font-size:13px;white-space:nowrap;}

/* ═══ BADGES ═══ */
.badge{display:inline-flex;align-items:center;gap:4px;padding:3px 9px;border-radius:20px;font-size:10px;font-weight:700;font-family:var(--fm);}
.b-green{background:rgba(0,229,160,.12);color:var(--accent);}
.b-blue{background:rgba(0,133,255,.12);color:var(--accent2);}
.b-orange{background:rgba(255,107,53,.12);color:var(--accent3);}
.b-yellow{background:rgba(255,204,0,.12);color:var(--warn);}
.b-red{background:rgba(255,68,68,.12);color:#ff6b6b;}
.b-purple{background:rgba(168,85,247,.12);color:var(--purple);}
.b-muted{background:var(--s2);color:var(--muted);}

/* ═══ FORMS ═══ */
.form-group{margin-bottom:16px;}
.form-label{display:block;font-size:10px;color:var(--muted);margin-bottom:5px;font-family:var(--fm);text-transform:uppercase;letter-spacing:1px;}
.form-input,.form-select,.form-textarea{
  width:100%;background:var(--s2);border:1px solid var(--b2);border-radius:var(--rsm);
  color:var(--text);padding:10px 13px;font-size:13px;font-family:var(--fb);outline:none;transition:border-color .18s;
}
.form-input:focus,.form-select:focus,.form-textarea:focus{border-color:var(--accent);}
.form-select{cursor:pointer;}
.form-select option{background:var(--s2);}
.form-textarea{resize:vertical;min-height:80px;}
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
.form-row3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px;}

/* ═══ CHART ═══ */
.chart-wrap{position:relative;height:230px;}
.chart-wrap.tall{height:300px;}

/* ═══ PROGRESS ═══ */
.pbar{background:var(--s3);border-radius:4px;height:7px;overflow:hidden;}
.pfill{height:100%;border-radius:4px;transition:width .8s ease;}

/* ═══ AI INSIGHT CARDS ═══ */
.insight-card{
  border-radius:var(--r);padding:18px 20px;margin-bottom:12px;
  border-left:4px solid;position:relative;overflow:hidden;
  background:var(--s1);border:1px solid var(--b1);
}
.insight-card.critical{border-left-color:#ff4444;background:rgba(255,68,68,.04);}
.insight-card.warning{border-left-color:var(--warn);background:rgba(255,204,0,.04);}
.insight-card.info{border-left-color:var(--accent2);background:rgba(0,133,255,.04);}
.insight-card.success{border-left-color:var(--accent);background:rgba(0,229,160,.04);}
.insight-card.purple{border-left-color:var(--purple);background:rgba(168,85,247,.04);}
.insight-icon{font-size:18px;margin-bottom:6px;}
.insight-title{font-weight:700;font-size:13px;margin-bottom:5px;}
.insight-body{font-size:12px;color:var(--muted);line-height:1.7;}
.insight-actions{display:flex;gap:8px;margin-top:10px;flex-wrap:wrap;}
.insight-tag{
  font-size:10px;font-family:var(--fm);padding:2px 8px;border-radius:4px;
  background:var(--s3);color:var(--muted);
}

/* ═══ AI CHAT ═══ */
.chat-container{
  display:flex;flex-direction:column;height:calc(100vh - 200px);min-height:500px;
}
.chat-messages{
  flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:14px;
  background:var(--s1);border:1px solid var(--b1);border-radius:var(--r);margin-bottom:12px;
}
.chat-msg{display:flex;gap:10px;max-width:90%;}
.chat-msg.user{align-self:flex-end;flex-direction:row-reverse;}
.chat-avatar{
  width:32px;height:32px;border-radius:50%;flex-shrink:0;
  display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;
}
.chat-avatar.ai{background:linear-gradient(135deg,var(--accent),var(--accent2));color:#000;}
.chat-avatar.user{background:var(--s3);color:var(--text);font-family:var(--fm);}
.chat-bubble{
  background:var(--s2);border:1px solid var(--b1);border-radius:12px;
  padding:12px 15px;font-size:13px;line-height:1.7;
}
.chat-msg.user .chat-bubble{background:rgba(0,229,160,.1);border-color:rgba(0,229,160,.2);}
.chat-bubble strong{color:var(--accent);}
.chat-bubble .metric{
  display:inline-block;background:var(--s3);border:1px solid var(--b2);
  border-radius:6px;padding:2px 8px;font-family:var(--fm);font-size:11px;margin:2px 3px;
  color:var(--text);
}
.chat-bubble ul{margin:8px 0 0 16px;}
.chat-bubble li{margin-bottom:4px;}
.chat-bubble .warn-text{color:var(--warn);}
.chat-bubble .ok-text{color:var(--accent);}
.chat-bubble .alert-text{color:#ff6b6b;}
.chat-typing{display:flex;gap:4px;padding:8px 12px;align-items:center;}
.typing-dot{width:6px;height:6px;border-radius:50%;background:var(--accent);animation:typingPulse 1.4s ease infinite;}
.typing-dot:nth-child(2){animation-delay:.2s;}
.typing-dot:nth-child(3){animation-delay:.4s;}
@keyframes typingPulse{0%,60%,100%{opacity:.3;transform:scale(.8)}30%{opacity:1;transform:scale(1)}}

.chat-input-row{display:flex;gap:10px;}
.chat-input{flex:1;background:var(--s2);border:1px solid var(--b2);border-radius:var(--rsm);color:var(--text);padding:11px 14px;font-size:13px;font-family:var(--fb);outline:none;transition:border-color .18s;}
.chat-input:focus{border-color:var(--accent);}
.chat-quick{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px;}
.quick-chip{
  padding:5px 12px;border-radius:20px;font-size:11px;font-weight:600;cursor:pointer;
  background:var(--s2);border:1px solid var(--b2);color:var(--muted);transition:all .15s;
  font-family:var(--fb);
}
.quick-chip:hover{border-color:var(--accent);color:var(--accent);}

/* ═══ SALARY PANEL ═══ */
.salary-card{
  background:var(--s1);border:1px solid var(--b1);border-radius:var(--r);
  overflow:hidden;margin-bottom:18px;
}
.salary-header{
  display:flex;align-items:center;gap:14px;padding:18px 22px;
  background:linear-gradient(135deg,rgba(0,229,160,.08),rgba(0,133,255,.05));
  border-bottom:1px solid var(--b1);
}
.salary-avatar{
  width:46px;height:46px;border-radius:12px;
  background:linear-gradient(135deg,var(--accent),var(--accent2));
  display:flex;align-items:center;justify-content:center;
  font-family:var(--fh);font-weight:800;font-size:17px;color:#000;flex-shrink:0;
}
.salary-name{font-family:var(--fh);font-size:16px;font-weight:700;}
.salary-role{font-size:11px;color:var(--muted);}
.salary-body{padding:18px 22px;}
.salary-row{display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--b1);font-size:13px;}
.salary-row:last-child{border-bottom:none;}
.salary-key{color:var(--muted);}
.salary-val{font-family:var(--fm);font-weight:500;}
.salary-total{background:linear-gradient(135deg,rgba(0,229,160,.06),rgba(0,133,255,.04));border:1px solid rgba(0,229,160,.2);border-radius:var(--rsm);padding:14px 18px;margin-top:12px;}
.salary-total-label{font-size:11px;color:var(--muted);font-family:var(--fm);text-transform:uppercase;letter-spacing:1px;}
.salary-total-val{font-family:var(--fh);font-size:28px;font-weight:800;color:var(--accent);margin-top:4px;}

/* ═══ MODAL ═══ */
.modal-overlay{display:none;position:fixed;inset:0;z-index:200;background:rgba(0,0,0,.7);backdrop-filter:blur(6px);align-items:center;justify-content:center;}
.modal-overlay.open{display:flex;}
.modal{background:var(--s1);border:1px solid var(--b2);border-radius:var(--r);width:90%;max-width:580px;max-height:90vh;overflow-y:auto;animation:modalIn .22s ease;box-shadow:var(--shadow);}
.modal-wide{max-width:760px;}
@keyframes modalIn{from{opacity:0;transform:scale(.95);}to{opacity:1;transform:scale(1);}}
.modal-header{padding:20px 26px 16px;border-bottom:1px solid var(--b1);display:flex;justify-content:space-between;align-items:center;}
.modal-title{font-family:var(--fh);font-size:17px;font-weight:700;}
.modal-close{background:none;border:none;color:var(--muted);cursor:pointer;font-size:22px;line-height:1;transition:color .15s;}
.modal-close:hover{color:var(--text);}
.modal-body{padding:22px 26px;}
.modal-footer{padding:14px 26px 22px;display:flex;gap:10px;justify-content:flex-end;border-top:1px solid var(--b1);}

/* ═══ TABS ═══ */
.tab-bar{display:flex;gap:3px;background:var(--s2);border-radius:var(--rsm);padding:4px;margin-bottom:22px;}
.tab-btn{flex:1;padding:8px 14px;border-radius:6px;border:none;cursor:pointer;font-family:var(--fb);font-size:12px;font-weight:600;color:var(--muted);background:transparent;transition:all .18s;}
.tab-btn.active{background:var(--s1);color:var(--text);}
.tab-pane{display:none;}
.tab-pane.active{display:block;}

/* ═══ OVERTIME / ALERTS ═══ */
.alert-row{display:flex;align-items:center;gap:12px;padding:12px 14px;border-radius:var(--rsm);margin-bottom:8px;background:var(--s2);border:1px solid var(--b1);}
.alert-icon{font-size:18px;flex-shrink:0;}
.alert-text-wrap{flex:1;}
.alert-title{font-weight:600;font-size:13px;}
.alert-detail{font-size:11px;color:var(--muted);margin-top:2px;}
.alert-badge{flex-shrink:0;}

/* ═══ HEATMAP ═══ */
.hm-grid{display:flex;flex-wrap:wrap;gap:3px;}
.hm-cell{width:16px;height:16px;border-radius:3px;cursor:default;transition:transform .1s;}
.hm-cell:hover{transform:scale(1.4);}
.hm-0{background:var(--s3);}
.hm-1{background:rgba(0,229,160,.25);}
.hm-2{background:rgba(0,229,160,.55);}
.hm-3{background:rgba(0,229,160,.85);}
.hm-leg{display:flex;align-items:center;gap:6px;margin-top:8px;font-size:10px;color:var(--muted);font-family:var(--fm);}

/* ═══ TOAST ═══ */
#toast-wrap{position:fixed;bottom:24px;right:24px;z-index:999;display:flex;flex-direction:column;gap:8px;}
.toast{background:var(--s1);border:1px solid var(--b1);border-radius:var(--rsm);padding:11px 18px;display:flex;align-items:center;gap:9px;font-size:12px;animation:fadeUp .25s ease;min-width:220px;box-shadow:var(--shadow);}
.toast.success{border-color:rgba(0,229,160,.35);}
.toast.error{border-color:rgba(255,68,68,.35);}
.toast.info{border-color:rgba(0,133,255,.35);}

/* ═══ RANGE INPUT ═══ */
input[type=range]{-webkit-appearance:none;width:100%;height:5px;background:var(--s3);border-radius:3px;outline:none;}
input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:16px;height:16px;border-radius:50%;background:var(--accent);cursor:pointer;}

/* ═══ SCROLLBAR ═══ */
::-webkit-scrollbar{width:5px;height:5px;}
::-webkit-scrollbar-track{background:transparent;}
::-webkit-scrollbar-thumb{background:var(--b2);border-radius:3px;}

/* ═══ NAV TOGGLE ═══ */
.nav-toggle{display:none;background:none;border:none;color:var(--text);cursor:pointer;font-size:22px;padding:0 6px;}
@media(max-width:780px){
  .sidebar{transform:translateX(-100%);}
  .sidebar.open{transform:translateX(0);}
  .nav-toggle{display:block;}
  .topbar{padding:0 16px;}
  .page{padding:18px 14px;}
}

/* ═══ DIVIDER ═══ */
.divider{height:1px;background:var(--b1);margin:18px 0;}

/* ═══ SCORE RING ═══ */
.score-ring-wrap{display:flex;align-items:center;justify-content:center;padding:16px 0;}
.score-ring{position:relative;width:120px;height:120px;}
.score-ring svg{transform:rotate(-90deg);}
.score-ring-num{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:var(--fh);font-size:26px;font-weight:800;}
.score-ring-label{text-align:center;font-size:11px;color:var(--muted);margin-top:6px;}

/* ═══ SALARY CONFIG ═══ */
.designation-card{
  background:var(--s2);border:1px solid var(--b1);border-radius:var(--rsm);
  padding:14px 16px;margin-bottom:10px;position:relative;
}
.designation-card-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;}
.designation-name{font-weight:700;font-size:13px;}
</style>
</head>
<body>
<div id="toast-wrap"></div>

<div class="shell">

<!-- ═══ SIDEBAR ═══ -->
<aside class="sidebar" id="sidebar">
  <div class="sb-logo">
    <div class="logo-chip">
      <div class="logo-icon">W</div>
      <div><div class="logo-text">WorkIQ</div><div class="logo-sub">AI Workforce Agent</div></div>
    </div>
  </div>
  <nav class="sb-nav">
    <div class="sb-section">Intelligence</div>
    <button class="nav-item active" onclick="nav('ai-agent',this)">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
      AI Agent <span class="nav-badge new" id="badge-ai">0</span>
    </button>
    <button class="nav-item" onclick="nav('insights',this)">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/></svg>
      Smart Insights <span class="nav-badge" id="badge-ins">0</span>
    </button>
    <button class="nav-item" onclick="nav('salary',this)">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
      Salary Engine
    </button>
    <div class="sb-section">Reports</div>
    <button class="nav-item" onclick="nav('performance',this)">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>
      Performance
    </button>
    <button class="nav-item" onclick="nav('overtime',this)">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>
      Overtime & Alerts <span class="nav-badge" id="badge-ot">0</span>
    </button>
    <button class="nav-item" onclick="nav('purchase-analysis',this)">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
      Purchase Analysis
    </button>
    <div class="sb-section">Config</div>
    <button class="nav-item" onclick="nav('config',this)">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
      Configuration
    </button>
  </nav>
  <div class="sb-footer">
    <div class="sb-status"><div class="led idle" id="led-fb"></div><span id="fb-status-text">Firebase: connecting…</span></div>
    <div class="sb-status"><div class="led idle" id="led-ai"></div><span>AI Agent: ready</span></div>
    <div style="margin-top:6px;color:var(--muted2);">WorkIQ v1.0 · SmartAttend</div>
  </div>
</aside>

<!-- ═══ MAIN ═══ -->
<div class="main">
  <header class="topbar">
    <div class="topbar-left">
      <button class="nav-toggle" onclick="document.getElementById('sidebar').classList.toggle('open')">☰</button>
      <span class="topbar-title" id="page-title">AI Agent</span>
    </div>
    <div class="topbar-right">
      <div style="font-size:11px;font-family:var(--fm);color:var(--muted);">
        <span class="led ok" style="display:inline-block;margin-right:4px;"></span>Live
      </div>
      <div class="topbar-clock" id="clock">--:--:--</div>
      <button class="btn btn-outline btn-sm" onclick="refreshData()">↻ Sync</button>
      <button class="btn btn-accent btn-sm" onclick="runFullAnalysis()">⚡ Analyse Now</button>
    </div>
  </header>

  <!-- ════════ AI AGENT PAGE ════════ -->
  <div class="page active" id="page-ai-agent">
    <div class="page-head">
      <div>
        <div class="page-title">AI Workforce Agent</div>
        <div class="page-sub">Powered by Claude · Analyses attendance, work patterns, salary & efficiency</div>
      </div>
      <button class="btn btn-purple" onclick="clearChat()">✕ Clear Chat</button>
    </div>
    <div class="chat-container">
      <div class="chat-quick" id="quick-prompts">
        <div class="quick-chip" onclick="sendQuick('Give me a full workforce analysis for today')">📊 Full Analysis</div>
        <div class="quick-chip" onclick="sendQuick('Who is working overtime today?')">⏰ Overtime Today</div>
        <div class="quick-chip" onclick="sendQuick('Show me duplicate purchase trips this week')">🛒 Duplicate Purchases</div>
        <div class="quick-chip" onclick="sendQuick('Calculate salary for all employees this month')">💰 Salary Report</div>
        <div class="quick-chip" onclick="sendQuick('Who has exceeded personal out time limits?')">⚠ Personal Limit Violations</div>
        <div class="quick-chip" onclick="sendQuick('Suggest work optimizations for the team')">🎯 Optimize Team</div>
        <div class="quick-chip" onclick="sendQuick('Who are the top performers this week?')">🏆 Top Performers</div>
        <div class="quick-chip" onclick="sendQuick('Show attendance trends for the last 30 days')">📈 30-Day Trends</div>
      </div>
      <div class="chat-messages" id="chat-messages">
        <div class="chat-msg">
          <div class="chat-avatar ai">W</div>
          <div class="chat-bubble">
            <strong>WorkIQ AI Agent ready.</strong><br><br>
            I have access to your full Firebase attendance data — employees, logs, daily summaries, and your configured salary/threshold settings.<br><br>
            Ask me anything about your workforce: salary calculations, overtime detection, duplicate purchase trips, personal time violations, performance rankings, or optimisation suggestions.<br><br>
            <span class="ok-text">Tip:</span> Use the quick buttons above or type freely below.
          </div>
        </div>
      </div>
      <div class="chat-input-row">
        <input class="chat-input" id="chat-input" placeholder="Ask anything about your workforce…" onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();sendChat();}"/>
        <button class="btn btn-accent" onclick="sendChat()">Send</button>
      </div>
    </div>
  </div>

  <!-- ════════ SMART INSIGHTS PAGE ════════ -->
  <div class="page" id="page-insights">
    <div class="page-head">
      <div><div class="page-title">Smart Insights</div><div class="page-sub">AI-generated alerts and recommendations</div></div>
      <button class="btn btn-accent btn-sm" onclick="loadInsights()">↻ Refresh</button>
    </div>
    <div class="g2" style="margin-bottom:10px;">
      <div class="stat-card"><div class="stat-label">Critical Alerts</div><div class="stat-val" id="ins-critical" style="color:#ff6b6b;">0</div><div class="stat-meta">need immediate action</div></div>
      <div class="stat-card orange"><div class="stat-label">Warnings</div><div class="stat-val" id="ins-warn">0</div><div class="stat-meta">review recommended</div></div>
      <div class="stat-card blue"><div class="stat-label">Optimizations</div><div class="stat-val" id="ins-opt">0</div><div class="stat-meta">efficiency suggestions</div></div>
      <div class="stat-card"><div class="stat-label">Positive Signals</div><div class="stat-val" id="ins-pos" style="color:var(--accent);">0</div><div class="stat-meta">good patterns</div></div>
    </div>
    <div id="insights-container">
      <div style="text-align:center;padding:60px;color:var(--muted);">Click Refresh to load AI insights</div>
    </div>
  </div>

  <!-- ════════ SALARY ENGINE PAGE ════════ -->
  <div class="page" id="page-salary">
    <div class="page-head">
      <div><div class="page-title">Salary Engine</div><div class="page-sub">Calculate payroll based on actual hours, thresholds & bonuses</div></div>
      <div style="display:flex;gap:8px;">
        <button class="btn btn-outline btn-sm" onclick="exportSalaryCSV()">↓ Export CSV</button>
        <button class="btn btn-accent btn-sm" onclick="calculateAllSalaries()">⚡ Calculate All</button>
      </div>
    </div>

    <div class="g2">
      <div class="card">
        <div class="card-title">Calculation Period</div>
        <div class="form-group">
          <div class="form-label">Month</div>
          <input type="month" class="form-input" id="sal-month"/>
        </div>
        <div class="form-group">
          <div class="form-label">Working Days in Period</div>
          <input type="number" class="form-input" id="sal-workdays" value="26" min="1" max="31"/>
        </div>
        <div class="form-group">
          <div class="form-label">Threshold Working Hours / Day</div>
          <input type="number" class="form-input" id="sal-threshold-hrs" value="8" min="1" max="24" step="0.5"/>
        </div>
        <div class="form-group">
          <div class="form-label">Overtime Rate (multiplier, e.g. 1.5)</div>
          <input type="number" class="form-input" id="sal-ot-rate" value="1.5" min="1" max="3" step="0.1"/>
        </div>
        <div class="form-group">
          <div class="form-label">Personal Out Limit (hrs/day)</div>
          <input type="number" class="form-input" id="sal-personal-limit" value="1" min="0" max="8" step="0.5"/>
        </div>
        <div class="form-group">
          <div class="form-label">Personal Time Penalty (% salary deducted per excess hr)</div>
          <input type="number" class="form-input" id="sal-personal-penalty" value="0.5" min="0" max="5" step="0.1"/>
        </div>
      </div>
      <div class="card">
        <div class="card-title">Designation Config <button class="btn btn-accent btn-sm" style="margin-left:auto;" onclick="addDesignation()">+ Add</button></div>
        <div id="designation-list">
          <div style="color:var(--muted);font-size:12px;">No designations configured. Add one to start.</div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-title">Salary Results <span class="card-badge" id="sal-period-label">—</span></div>
      <div class="tbl-wrap">
        <table>
          <thead><tr>
            <th>Employee</th><th>Designation</th><th>Work Hrs</th><th>OT Hrs</th>
            <th>Personal Hrs</th><th>Penalty</th><th>Base Pay</th>
            <th>OT Pay</th><th>Bonus</th><th>Deductions</th><th>Net Salary</th><th>Status</th>
          </tr></thead>
          <tbody id="salary-tbody">
            <tr><td colspan="12" style="text-align:center;padding:36px;color:var(--muted);">Configure designations and click Calculate All</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- ════════ PERFORMANCE PAGE ════════ -->
  <div class="page" id="page-performance">
    <div class="page-head">
      <div><div class="page-title">Performance</div><div class="page-sub">Employee performance scores and rankings</div></div>
      <div style="display:flex;gap:8px;">
        <select class="form-select" id="perf-period" onchange="loadPerformance()" style="width:140px;padding:8px 12px;font-size:12px;">
          <option value="7">Last 7 days</option>
          <option value="30" selected>Last 30 days</option>
          <option value="90">Last 90 days</option>
        </select>
      </div>
    </div>
    <div class="g2">
      <div class="card">
        <div class="card-title">Work Hours Distribution</div>
        <div class="chart-wrap"><canvas id="perf-hours-chart"></canvas></div>
      </div>
      <div class="card">
        <div class="card-title">Exit Reason Mix</div>
        <div class="chart-wrap"><canvas id="perf-reason-chart"></canvas></div>
      </div>
    </div>
    <div class="card">
      <div class="card-title">Employee Performance Ranking</div>
      <div class="tbl-wrap">
        <table>
          <thead><tr>
            <th>Rank</th><th>Employee</th><th>Score</th><th>Days Present</th>
            <th>Avg Hrs/Day</th><th>OT Days</th><th>Personal Exits</th>
            <th>Punctuality</th><th>Verdict</th>
          </tr></thead>
          <tbody id="perf-tbody"><tr><td colspan="9" style="text-align:center;padding:32px;color:var(--muted);">Loading…</td></tr></tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- ════════ OVERTIME & ALERTS ════════ -->
  <div class="page" id="page-overtime">
    <div class="page-head">
      <div><div class="page-title">Overtime & Alerts</div><div class="page-sub">Real-time threshold violations and overtime tracking</div></div>
      <button class="btn btn-accent btn-sm" onclick="loadOvertimeAlerts()">↻ Refresh</button>
    </div>
    <div class="stat-grid">
      <div class="stat-card red"><div class="stat-label">Overtime Today</div><div class="stat-val" id="ot-today">0</div><div class="stat-meta">employees over threshold</div></div>
      <div class="stat-card orange"><div class="stat-label">Personal Limit Exceeded</div><div class="stat-val" id="ot-personal">0</div><div class="stat-meta">today</div></div>
      <div class="stat-card blue"><div class="stat-label">Long Sessions</div><div class="stat-val" id="ot-long">0</div><div class="stat-meta">single session &gt; 6h</div></div>
      <div class="stat-card purple"><div class="stat-label">Missing Breaks</div><div class="stat-val" id="ot-breaks">0</div><div class="stat-meta">no lunch detected</div></div>
    </div>
    <div class="g2">
      <div class="card">
        <div class="card-title">⚠ Active Alerts</div>
        <div id="active-alerts-list"><div class="empty-state" style="padding:30px;text-align:center;color:var(--muted);">Loading…</div></div>
      </div>
      <div class="card">
        <div class="card-title">Weekly Overtime Trend</div>
        <div class="chart-wrap"><canvas id="ot-trend-chart"></canvas></div>
      </div>
    </div>
    <div class="card">
      <div class="card-title">Overtime Register — This Month</div>
      <div class="tbl-wrap">
        <table>
          <thead><tr><th>Employee</th><th>Date</th><th>Regular Hrs</th><th>OT Hrs</th><th>Reason</th><th>Suggested Action</th></tr></thead>
          <tbody id="ot-register-tbody"><tr><td colspan="6" style="text-align:center;padding:32px;color:var(--muted);">Loading…</td></tr></tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- ════════ PURCHASE ANALYSIS ════════ -->
  <div class="page" id="page-purchase-analysis">
    <div class="page-head">
      <div><div class="page-title">Purchase Trip Analysis</div><div class="page-sub">Detect redundant trips and suggest batch consolidation</div></div>
      <button class="btn btn-accent btn-sm" onclick="loadPurchaseAnalysis()">↻ Analyse</button>
    </div>
    <div class="stat-grid">
      <div class="stat-card"><div class="stat-label">Total Trips</div><div class="stat-val" id="pur-total">0</div><div class="stat-meta">this month</div></div>
      <div class="stat-card red"><div class="stat-label">Duplicate Days</div><div class="stat-val" id="pur-dup">0</div><div class="stat-meta">2+ trips same day</div></div>
      <div class="stat-card orange"><div class="stat-label">Time Wasted</div><div class="stat-val" id="pur-wasted">0h</div><div class="stat-meta">est. on extra trips</div></div>
      <div class="stat-card blue"><div class="stat-label">Consolidation Saving</div><div class="stat-val" id="pur-saving">₹0</div><div class="stat-meta">est. labour cost saved</div></div>
    </div>
    <div id="purchase-insights-wrap"></div>
    <div class="card">
      <div class="card-title">Purchase Trip Log <span class="card-badge">Last 30 days</span></div>
      <div class="tbl-wrap">
        <table>
          <thead><tr><th>Employee</th><th>Date</th><th>Trips That Day</th><th>Est. Duration</th><th>Flag</th><th>Suggestion</th></tr></thead>
          <tbody id="purchase-tbody"></tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- ════════ CONFIG PAGE ════════ -->
  <div class="page" id="page-config">
    <div class="page-head">
      <div><div class="page-title">Configuration</div><div class="page-sub">Firebase, thresholds, AI settings</div></div>
      <button class="btn btn-accent btn-sm" onclick="saveConfig()">Save All</button>
    </div>
    <div class="g2">
      <div class="card">
        <div class="card-title">Firebase Connection</div>
        <div class="form-group">
          <div class="form-label">Firebase Realtime DB URL</div>
          <input class="form-input" id="cfg-fb-url" placeholder="https://your-project.firebaseio.com"/>
        </div>
        <div class="form-group">
          <div class="form-label">Anthropic API Key (for AI Agent)</div>
          <input class="form-input" id="cfg-api-key" type="password" placeholder="sk-ant-…"/>
        </div>
        <button class="btn btn-accent" onclick="saveConfig()" style="width:100%;margin-top:6px;">Save & Test</button>
        <div id="cfg-status" style="margin-top:10px;font-size:12px;color:var(--muted);"></div>
      </div>
      <div class="card">
        <div class="card-title">Work Thresholds</div>
        <div class="form-group">
          <div class="form-label">Daily Work Threshold (hrs) — triggers OT above this</div>
          <input type="number" class="form-input" id="cfg-ot-threshold" value="8" min="4" max="16" step="0.5"/>
        </div>
        <div class="form-group">
          <div class="form-label">Max Personal Out per Day (hrs)</div>
          <input type="number" class="form-input" id="cfg-personal-max" value="1" min="0" max="4" step="0.5"/>
        </div>
        <div class="form-group">
          <div class="form-label">Max Field Work per Day (hrs)</div>
          <input type="number" class="form-input" id="cfg-field-max" value="4" min="0" max="12" step="0.5"/>
        </div>
        <div class="form-group">
          <div class="form-label">Purchase Trip Duration Estimate (mins)</div>
          <input type="number" class="form-input" id="cfg-purchase-dur" value="45" min="10" max="240"/>
        </div>
        <div class="form-group">
          <div class="form-label">Long Session Alert (hrs — single continuous login)</div>
          <input type="number" class="form-input" id="cfg-long-session" value="6" min="2" max="12" step="0.5"/>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-title">AI Agent Behaviour</div>
      <div class="form-row">
        <div class="form-group">
          <div class="form-label">AI Analysis Depth</div>
          <select class="form-select" id="cfg-ai-depth">
            <option value="quick">Quick (faster)</option>
            <option value="standard" selected>Standard</option>
            <option value="deep">Deep (thorough)</option>
          </select>
        </div>
        <div class="form-group">
          <div class="form-label">Currency Symbol</div>
          <input class="form-input" id="cfg-currency" value="₹"/>
        </div>
      </div>
      <div class="form-group">
        <div class="form-label">Company Name (shown in reports)</div>
        <input class="form-input" id="cfg-company" value="My Company"/>
      </div>
    </div>
  </div>

</div><!-- /main -->
</div><!-- /shell -->

<!-- ═══ ADD DESIGNATION MODAL ═══ -->
<div class="modal-overlay" id="modal-designation">
  <div class="modal">
    <div class="modal-header">
      <div class="modal-title" id="desig-modal-title">Add Designation</div>
      <button class="modal-close" onclick="closeModal('modal-designation')">×</button>
    </div>
    <div class="modal-body">
      <div class="form-group">
        <div class="form-label">Designation / Role Name</div>
        <input class="form-input" id="d-name" placeholder="e.g. Senior Engineer"/>
      </div>
      <div class="form-row">
        <div class="form-group">
          <div class="form-label">Monthly Base Salary (₹)</div>
          <input class="form-input" type="number" id="d-base" placeholder="e.g. 50000"/>
        </div>
        <div class="form-group">
          <div class="form-label">Monthly Bonus (₹)</div>
          <input class="form-input" type="number" id="d-bonus" placeholder="e.g. 5000" value="0"/>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <div class="form-label">HRA (₹/month)</div>
          <input class="form-input" type="number" id="d-hra" placeholder="e.g. 10000" value="0"/>
        </div>
        <div class="form-group">
          <div class="form-label">Allowances (₹/month)</div>
          <input class="form-input" type="number" id="d-allowances" placeholder="e.g. 3000" value="0"/>
        </div>
      </div>
      <div class="form-group">
        <div class="form-label">Performance Bonus Trigger (min attendance %)</div>
        <input class="form-input" type="number" id="d-bonus-trigger" placeholder="e.g. 90" value="90" min="0" max="100"/>
      </div>
      <div class="form-group">
        <div class="form-label">Assign Employees (comma-sep IDs or leave blank for unassigned)</div>
        <input class="form-input" id="d-employees" placeholder="e.g. 1,3,5"/>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-outline" onclick="closeModal('modal-designation')">Cancel</button>
      <button class="btn btn-accent" onclick="saveDesignation()">Save Designation</button>
    </div>
  </div>
</div>

<script>
// ═══════════════════════════════════════════════════════════════════
//   APP STATE
// ═══════════════════════════════════════════════════════════════════
const APP = {
  fbUrl: localStorage.getItem('wb_fb_url') || 'https://attendace-system-5599c-default-rtdb.firebaseio.com',
  apiKey: localStorage.getItem('wb_api_key') || '',
  currency: localStorage.getItem('wb_currency') || '₹',
  company: localStorage.getItem('wb_company') || 'My Company',
  config: {
    otThreshold: parseFloat(localStorage.getItem('wb_ot_threshold')||'8'),
    personalMax: parseFloat(localStorage.getItem('wb_personal_max')||'1'),
    fieldMax: parseFloat(localStorage.getItem('wb_field_max')||'4'),
    purchaseDur: parseInt(localStorage.getItem('wb_purchase_dur')||'45'),
    longSession: parseFloat(localStorage.getItem('wb_long_session')||'6'),
  },
  designations: JSON.parse(localStorage.getItem('wb_designations')||'[]'),
  data: { users:{}, logs:[], daily:{} },
  charts: {},
  salaryResults: [],
};

// ═══════════════════════════════════════════════════════════════════
//   INIT
// ═══════════════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  loadCfgInputs();
  initClock();
  const sm = document.getElementById('sal-month');
  if(sm) sm.value = new Date().toISOString().slice(0,7);
  renderDesignationList();
  refreshData();
});

function loadCfgInputs() {
  setVal('cfg-fb-url', APP.fbUrl);
  setVal('cfg-api-key', APP.apiKey);
  setVal('cfg-currency', APP.currency);
  setVal('cfg-company', APP.company);
  setVal('cfg-ot-threshold', APP.config.otThreshold);
  setVal('cfg-personal-max', APP.config.personalMax);
  setVal('cfg-field-max', APP.config.fieldMax);
  setVal('cfg-purchase-dur', APP.config.purchaseDur);
  setVal('cfg-long-session', APP.config.longSession);
  setVal('sal-threshold-hrs', APP.config.otThreshold);
  setVal('sal-personal-limit', APP.config.personalMax);
}

function setVal(id, v) { const el = document.getElementById(id); if(el) el.value = v; }
function getVal(id) { const el = document.getElementById(id); return el ? el.value : ''; }
function getNum(id, def=0) { return parseFloat(getVal(id))||def; }

// ═══════════════════════════════════════════════════════════════════
//   CLOCK
// ═══════════════════════════════════════════════════════════════════
function initClock() {
  const tick = () => {
    const n = new Date();
    document.getElementById('clock').textContent = n.toLocaleTimeString('en-IN',{hour12:false});
  };
  tick(); setInterval(tick, 1000);
}

// ═══════════════════════════════════════════════════════════════════
//   NAVIGATION
// ═══════════════════════════════════════════════════════════════════
function nav(page, btn) {
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  document.getElementById('page-'+page).classList.add('active');
  btn.classList.add('active');
  const titles = {
    'ai-agent':'AI Agent','insights':'Smart Insights','salary':'Salary Engine',
    'performance':'Performance','overtime':'Overtime & Alerts',
    'purchase-analysis':'Purchase Analysis','config':'Configuration'
  };
  document.getElementById('page-title').textContent = titles[page]||page;
  document.getElementById('sidebar').classList.remove('open');
  if(page==='insights') loadInsights();
  else if(page==='overtime') loadOvertimeAlerts();
  else if(page==='purchase-analysis') loadPurchaseAnalysis();
  else if(page==='performance') loadPerformance();
}

// ═══════════════════════════════════════════════════════════════════
//   FIREBASE
// ═══════════════════════════════════════════════════════════════════
async function fbGet(path) {
  try {
    const r = await fetch(APP.fbUrl + path + '.json');
    if(!r.ok) throw new Error('HTTP '+r.status);
    return await r.json();
  } catch(e) { console.error(e); return null; }
}

async function refreshData() {
  document.getElementById('led-fb').className = 'led idle';
  document.getElementById('fb-status-text').textContent = 'Firebase: syncing…';
  try {
    const [users, logs, daily] = await Promise.all([
      fbGet('/users'), fbGet('/attendance_log'), fbGet('/daily_summary')
    ]);
    APP.data.users = users || {};
    APP.data.daily = daily || {};
    if(logs) {
      APP.data.logs = Object.values(logs).filter(l=>String(l.id)!=='0').sort((a,b)=>{
        const da=(a.date||'')+(a.time||a.logout_time||a.login_time||'');
        const db=(b.date||'')+(b.time||b.logout_time||b.login_time||'');
        return db.localeCompare(da);
      });
    }
    document.getElementById('led-fb').className = 'led ok';
    document.getElementById('fb-status-text').textContent = 'Firebase: connected';
    // Update badge counts
    updateBadges();
    toast('Data synced from Firebase', 'success');
  } catch(e) {
    document.getElementById('led-fb').className = 'led fail';
    document.getElementById('fb-status-text').textContent = 'Firebase: failed';
    toast('Firebase sync failed: '+e.message, 'error');
  }
}

function updateBadges() {
  const today = todayStr();
  const todayLogs = APP.data.logs.filter(l=>l.date===today);
  // OT badge
  const otCount = Object.entries(APP.data.users)
    .filter(([id])=>id!=='0')
    .filter(([id]) => {
      const hrs = getUserWorkHoursToday(id, today);
      return hrs > APP.config.otThreshold;
    }).length;
  document.getElementById('badge-ot').textContent = otCount;
  document.getElementById('badge-ai').textContent = '!';
  // Insights badge
  const ins = generateInsights();
  document.getElementById('badge-ins').textContent = ins.filter(i=>i.level==='critical'||i.level==='warning').length;
}

// ═══════════════════════════════════════════════════════════════════
//   HELPERS
// ═══════════════════════════════════════════════════════════════════
function todayStr() { return new Date().toISOString().slice(0,10); }
function pad(n) { return n<10?'0'+n:n; }
function fmtMins(m) { if(!m||m<0) return '0m'; const h=Math.floor(m/60),mn=Math.round(m%60); return h?`${h}h ${mn}m`:`${mn}m`; }
function fmtHrs(h) { return h.toFixed(2)+'h'; }
function getUserName(id) { return APP.data.users[id]?.name||APP.data.users[String(id)]?.name||('User #'+id); }
function initials(n) { return n?n.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2):'?'; }
function cur() { return APP.currency||'₹'; }

// ── Core work-time engine ──────────────────────────────────────────────
// Uses ONLY stored work_minutes from Firebase. No live calculation.
// Rules:
//  1. Currently logged IN           → work_minutes = 0 (not stored yet, session open)
//  2. Day Close / Personal          → use stored work_minutes (login → logout, fixed)
//  3. Field/Meeting/Purchase (OOO)  → use stored work_minutes (login → logout)
//       + if current time <= estimated_return: trip still active, consider working
//       + if current time >  estimated_return: trip overdue, no extra work counted
//  4. Special: if estimated_return >= end of working day, count full remaining as work
//  5. Multiple sessions per day are summed.
// ─────────────────────────────────────────────────────────────────────
function timeStrToMins(t) {
  if (!t || !t.includes(':')) return 0;
  const p = t.split(':').map(Number);
  return p[0] * 60 + p[1];
}

function computeWorkMinutesForDay(id, date) {
  const isToday = (date === todayStr());
  const nowMins = new Date().getHours() * 60 + new Date().getMinutes();

  const dayLogs = APP.data.logs
    .filter(l => String(l.id) === String(id) && l.date === date)
    .slice().reverse(); // oldest first

  let totalWork = 0;
  let pendingLogin = null;

  dayLogs.forEach(l => {
    if (l.type === 'login') {
      pendingLogin = l;
    } else if (l.type === 'logout' && pendingLogin) {
      const stored = l.work_minutes || 0;
      const reason = l.reason || '';

      if (reason === 'Day Close' || reason === 'Personal') {
        // Session complete — use stored value
        totalWork += stored;

      } else if (['Field Work', 'Meeting', 'Purchase'].includes(reason)) {
        // OOO trip — stored work (login→logout) is the base
        totalWork += stored;

        if (isToday && l.estimated_return) {
          const estReturnMins = timeStrToMins(l.estimated_return);
          const logoutMins    = timeStrToMins(l.logout_time || l.time || '00:00');

          if (nowMins <= estReturnMins) {
            // Still within estimated trip window — add time from logout until now
            totalWork += Math.max(0, nowMins - logoutMins);
          } else {
            // Past estimated return — add only up to estimated_return, not beyond
            totalWork += Math.max(0, estReturnMins - logoutMins);
          }
        }
      } else {
        totalWork += stored;
      }
      pendingLogin = null;
    }
  });

  // Employee still logged in — stored work_minutes = 0 (session not closed)
  // We do NOT add live time per user requirement

  return Math.round(totalWork);
}

function getUserWorkHoursToday(id, date) {
  return computeWorkMinutesForDay(id, date) / 60;
}

function getUserLogsForPeriod(id, startDate, endDate) {
  return APP.data.logs.filter(l=>String(l.id)===String(id)&&l.date>=startDate&&l.date<=endDate);
}

function getPeriodDates(days) {
  const dates = [];
  for(let i=days-1;i>=0;i--){
    const d=new Date();d.setDate(d.getDate()-i);dates.push(d.toISOString().slice(0,10));
  }
  return dates;
}

function getMonthDates(month) {
  const [y,m] = month.split('-').map(Number);
  const days = new Date(y,m,0).getDate();
  return Array.from({length:days},(_,i)=>`${month}-${pad(i+1)}`);
}

function reasonBadge(r) {
  const map={'Personal':'b-red','Meeting':'b-blue','Field Work':'b-green','Day Close':'b-yellow','Purchase':'b-orange'};
  return `<span class="badge ${map[r]||'b-muted'}">${r||'—'}</span>`;
}

function scoreColor(s) {
  if(s>=85) return 'var(--accent)';
  if(s>=70) return 'var(--accent2)';
  if(s>=55) return 'var(--warn)';
  return '#ff6b6b';
}

function calcPerformanceScore(id, days=30) {
  const dates = getPeriodDates(days);
  const start = dates[0], end = dates[dates.length-1];
  const logs = getUserLogsForPeriod(id, start, end);
  if(!logs.length) return 0;

  const daysPresent = new Set(logs.map(l=>l.date)).size;
  const logouts = logs.filter(l=>l.type==='logout');
  const totalWork = logouts.filter(l=>l.reason!=='Personal').reduce((s,l)=>s+(l.work_minutes||0),0)/60;
  const avgWorkPerDay = daysPresent ? totalWork/daysPresent : 0;
  const personalExits = logouts.filter(l=>l.reason==='Personal').length;
  const otDays = dates.filter(d=>{
    const h = getUserWorkHoursToday(id,d);
    return h>APP.config.otThreshold;
  }).length;

  const attendanceScore = Math.min(100, (daysPresent/days)*100) * 0.35;
  const hoursScore = Math.min(100, (avgWorkPerDay/APP.config.otThreshold)*100) * 0.40;
  const personalPenalty = Math.max(0, 100 - personalExits*8) * 0.15;
  const otBonus = Math.min(10, otDays*1.5) * 0.10;

  return Math.round(attendanceScore + hoursScore + personalPenalty + otBonus);
}

// ═══════════════════════════════════════════════════════════════════
//   CHART DEFAULTS
// ═══════════════════════════════════════════════════════════════════
const CD = {
  color:'#e8ecf4',
  plugins:{
    legend:{labels:{color:'#5a6180',font:{family:'DM Mono',size:10}}},
    tooltip:{backgroundColor:'#0e1118',borderColor:'#1e2438',borderWidth:1,titleColor:'#e8ecf4',bodyColor:'#5a6180',cornerRadius:8}
  },
  scales:{
    x:{ticks:{color:'#5a6180',font:{family:'DM Mono',size:9}},grid:{color:'#1e2438'}},
    y:{ticks:{color:'#5a6180',font:{family:'DM Mono',size:9}},grid:{color:'#1e2438'}}
  }
};

function mkChart(id, type, labels, datasets, extraOpts={}) {
  const ctx = document.getElementById(id);
  if(!ctx) return;
  if(APP.charts[id]) APP.charts[id].destroy();
  APP.charts[id] = new Chart(ctx, {type, data:{labels,datasets}, options:{responsive:true,maintainAspectRatio:false,...CD,...extraOpts}});
}

// ═══════════════════════════════════════════════════════════════════
//   AI AGENT CHAT
// ═══════════════════════════════════════════════════════════════════
function buildDataContext() {
  const today = todayStr();
  const users = Object.entries(APP.data.users).filter(([id])=>id!=='0');
  const todayLogs = APP.data.logs.filter(l=>l.date===today);
  const last30 = getPeriodDates(30);
  const start30 = last30[0];

  const empSummaries = users.map(([id,u]) => {
    const logs = APP.data.logs.filter(l=>String(l.id)===String(id)&&l.date>=start30);
    const logouts = logs.filter(l=>l.type==='logout');
    // Total 30-day work using new engine
    const totalWork = [...new Set(logs.map(l=>l.date))].reduce((s,d)=>s+computeWorkMinutesForDay(id,d),0);
    const personalExits = logouts.filter(l=>l.reason==='Personal').length;
    const fieldTrips = logouts.filter(l=>l.reason==='Field Work').length;
    const purchaseTrips = logouts.filter(l=>l.reason==='Purchase').length;
    const meetings = logouts.filter(l=>l.reason==='Meeting').length;
    const daysPresent = new Set(logs.map(l=>l.date)).size;
    const score = calcPerformanceScore(id, 30);

    // Today work via new engine (live for active sessions)
    const todayWorkMins = computeWorkMinutesForDay(id, today);
    const todayWork = todayWorkMins / 60;

    // Current status
    const todayEmpLogs = todayLogs.filter(l => String(l.id) === String(id));
    const lastLog = todayEmpLogs[0]; // newest-first
    let currentStatus = 'absent';
    if (lastLog) {
      if (lastLog.type === 'login') {
        currentStatus = 'in-office';
      } else if (['Field Work','Meeting','Purchase'].includes(lastLog.reason)) {
        const estReturn = lastLog.estimated_return;
        const nowMins2  = new Date().getHours()*60 + new Date().getMinutes();
        const overdue   = estReturn && nowMins2 > timeStrToMins(estReturn);
        currentStatus = overdue ? 'ooo-overdue' : 'ooo';
      } else {
        currentStatus = 'done';
      }
    }

    // Purchase duplicate detection
    const purDates = logouts.filter(l=>l.reason==='Purchase').map(l=>l.date);
    const dupPurDays = purDates.filter((d,i)=>purDates.indexOf(d)!==i);

    // OT check today
    const isOT = todayWork > APP.config.otThreshold;
    const personalHrsToday = todayLogs.filter(l=>String(l.id)===String(id)&&l.type==='logout'&&l.reason==='Personal')
      .reduce((s,l)=>s+(l.work_minutes||0),0)/60;

    return {
      id, name:u.name||('User '+id), phone:u.phone||'', role:u.role||'Employee',
      daysPresent30: daysPresent, totalWorkHrs30: +(totalWork/60).toFixed(2),
      avgHrsPerDay: daysPresent ? +((totalWork/60)/daysPresent).toFixed(2) : 0,
      personalExits30: personalExits, fieldTrips30: fieldTrips,
      purchaseTrips30: purchaseTrips, meetings30: meetings,
      duplicatePurchaseDays: [...new Set(dupPurDays)],
      todayWorkHrs: +todayWork.toFixed(2),
      todayWorkMins: Math.round(todayWorkMins),
      currentStatus,
      todayOT: isOT,
      todayPersonalHrs: +personalHrsToday.toFixed(2),
      performanceScore: score
    };
  });

  const cfg = {
    otThresholdHrs: APP.config.otThreshold,
    personalMaxHrs: APP.config.personalMax,
    fieldMaxHrs: APP.config.fieldMax,
    purchaseTripDurMins: APP.config.purchaseDur,
    longSessionHrs: APP.config.longSession,
    currency: cur(),
    company: APP.company,
    designations: APP.designations
  };

  return { today, employees: empSummaries, config: cfg, totalEmployees: users.length };
}

async function sendChat() {
  const input = document.getElementById('chat-input');
  const msg = input.value.trim();
  if(!msg) return;
  input.value = '';
  appendUserMsg(msg);
  await callAI(msg);
}

function sendQuick(msg) { document.getElementById('chat-input').value = msg; sendChat(); }

function appendUserMsg(msg) {
  const el = document.createElement('div');
  el.className = 'chat-msg user';
  el.innerHTML = `<div class="chat-avatar user">Me</div><div class="chat-bubble">${escHtml(msg)}</div>`;
  document.getElementById('chat-messages').appendChild(el);
  scrollChat();
}

function appendAIMsg(html) {
  const el = document.createElement('div');
  el.className = 'chat-msg';
  el.innerHTML = `<div class="chat-avatar ai">W</div><div class="chat-bubble">${html}</div>`;
  document.getElementById('chat-messages').appendChild(el);
  scrollChat();
}

function showTyping() {
  const el = document.createElement('div');
  el.className = 'chat-msg'; el.id = 'typing-indicator';
  el.innerHTML = `<div class="chat-avatar ai">W</div><div class="chat-bubble"><div class="chat-typing"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div></div>`;
  document.getElementById('chat-messages').appendChild(el);
  scrollChat();
}

function hideTyping() {
  const el = document.getElementById('typing-indicator');
  if(el) el.remove();
}

function scrollChat() {
  const c = document.getElementById('chat-messages');
  c.scrollTop = c.scrollHeight;
}

function clearChat() {
  document.getElementById('chat-messages').innerHTML = `
    <div class="chat-msg">
      <div class="chat-avatar ai">W</div>
      <div class="chat-bubble"><strong>Chat cleared.</strong> I'm ready for your next question about the workforce.</div>
    </div>`;
}

async function callAI(userMessage) {
  if(!APP.apiKey) {
    appendAIMsg('⚠ <strong>No API key configured.</strong> Go to <strong>Configuration</strong> and add your Anthropic API key to enable the AI agent.<br><br>In the meantime, you can use the <strong>Smart Insights</strong>, <strong>Salary Engine</strong>, and other pages — those work without an API key.');
    return;
  }

  showTyping();
  document.getElementById('led-ai').className = 'led ok';

  const ctx = buildDataContext();
  const systemPrompt = `You are WorkIQ, an expert AI Workforce Intelligence Agent for ${ctx.config.company}. You analyse employee attendance data from a fingerprint-based ESP32 system and provide actionable, professional insights.

CURRENT DATA SNAPSHOT (${ctx.today}):
- Total employees: ${ctx.totalEmployees}
- Configured thresholds: OT threshold=${ctx.config.otThresholdHrs}h/day, Personal max=${ctx.config.personalMaxHrs}h/day, Field max=${ctx.config.fieldMaxHrs}h/day
- Currency: ${ctx.config.currency}
- Designations configured: ${ctx.config.designations.length}

HOW todayWorkHrs IS CALCULATED (important for accuracy):
- Employee currently IN office: work_minutes not yet stored (session open) → todayWorkHrs may be 0 or from earlier sessions
- Day Close / Personal logout: work_minutes = login → logout (stored by device, fixed)
- Field Work / Meeting / Purchase logout: work_minutes (login→logout) + time from logout until estimated_return (if current time is still before estimated_return). Once past estimated_return, no more work is counted until they re-login.
- estimated_return is a clock time string like "14:30" stored in each OOO logout record
- currentStatus values: "in-office" | "ooo" (within estimated_return) | "ooo-overdue" (past estimated_return, not back) | "done" (day closed/personal) | "absent"
- If todayWorkHrs shows 0 for an in-office employee, it means they haven't logged out yet today — their session is still open.

EMPLOYEE DATA (last 30 days + today):
${JSON.stringify(ctx.employees, null, 2)}

DESIGNATION/SALARY CONFIG:
${JSON.stringify(ctx.config.designations, null, 2)}

RULES:
1. For salary calculations: Use base salary, HRA, allowances, bonus. Deduct for absent days proportionally. Add OT pay at the configured multiplier for hours above threshold. Deduct personal time penalty for excess personal hours.
2. For overtime: Any day where work_hours > threshold is overtime. Suggest break schedules, rest days, or task redistribution.
3. For purchase trips: If same employee has 2+ purchase trips on same day, flag as "consolidatable" — estimate time wasted and cost.
4. For personal time: If personalHrs exceeds personalMax threshold, flag as violation. Suggest counselling or formal warning based on frequency.
5. Performance score is 0-100: 85+ = Excellent, 70-84 = Good, 55-69 = Average, below 55 = Needs Improvement.
6. Always be professional, specific, and actionable. Use actual names and numbers from the data.
7. Format responses with HTML: use <strong> for emphasis, <ul><li> for lists, <span class="metric"> for numbers, <span class="warn-text"> for warnings, <span class="ok-text"> for positives, <span class="alert-text"> for critical alerts.
8. Keep responses focused and concise unless asked for full analysis.
9. When reporting todayWorkHrs, note the employee's currentStatus so context is clear (e.g. "currently in office", "out for field work", "day closed").`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMessage }]
      })
    });
    const data = await response.json();
    hideTyping();
    document.getElementById('led-ai').className = 'led idle';
    if(data.content && data.content[0]) {
      appendAIMsg(data.content[0].text);
    } else if(data.error) {
      appendAIMsg(`<span class="alert-text">API Error: ${escHtml(data.error.message)}</span>`);
    }
  } catch(e) {
    hideTyping();
    document.getElementById('led-ai').className = 'led fail';
    appendAIMsg(`<span class="alert-text">Connection error: ${escHtml(e.message)}</span>`);
  }
}

async function runFullAnalysis() {
  nav('ai-agent', document.querySelector('[onclick*="ai-agent"]'));
  sendQuick('Run a complete workforce analysis: identify overtime workers, personal time violations, duplicate purchase trips, performance rankings, and give top 3 optimisation recommendations for the team.');
}

// ═══════════════════════════════════════════════════════════════════
//   SMART INSIGHTS (rule-based, no API needed)
// ═══════════════════════════════════════════════════════════════════
function generateInsights() {
  const insights = [];
  const today = todayStr();
  const users = Object.entries(APP.data.users).filter(([id])=>id!=='0');
  const last30 = getPeriodDates(30);
  const start30 = last30[0];

  users.forEach(([id, u]) => {
    const name = u.name || ('User '+id);
    const logs = APP.data.logs.filter(l=>String(l.id)===String(id)&&l.date>=start30);
    const logouts = logs.filter(l=>l.type==='logout');

    // 1. Overtime today
    const todayWork = getUserWorkHoursToday(id, today);
    if(todayWork > APP.config.otThreshold) {
      const extra = (todayWork - APP.config.otThreshold).toFixed(1);
      insights.push({
        level:'warning', employee:name, id,
        title:`${name} working overtime today`,
        body:`Currently at <strong>${todayWork.toFixed(1)}h</strong> — ${extra}h over the ${APP.config.otThreshold}h threshold. Consider scheduling a break or redistributing pending tasks.`,
        tags:['Overtime','Today']
      });
    }

    // 2. Duplicate purchase trips
    const purByDay = {};
    logouts.filter(l=>l.reason==='Purchase').forEach(l=>{
      purByDay[l.date] = (purByDay[l.date]||0)+1;
    });
    const dupDays = Object.entries(purByDay).filter(([,c])=>c>=2);
    if(dupDays.length) {
      const totalDup = dupDays.reduce((s,[,c])=>s+(c-1),0);
      const estWasted = totalDup * APP.config.purchaseDur;
      insights.push({
        level:'critical', employee:name, id,
        title:`${name} made ${totalDup} redundant purchase trips`,
        body:`Found <strong>${dupDays.length} days</strong> with 2+ purchase trips: ${dupDays.map(([d,c])=>`${d} (${c} trips)`).join(', ')}. Estimated <strong>${fmtMins(estWasted)}</strong> wasted. Suggest consolidating into single daily purchase run.`,
        tags:['Purchase','Redundancy','Efficiency']
      });
    }

    // 3. Personal time violations
    const personalExits = logouts.filter(l=>l.reason==='Personal');
    const personalHrs = personalExits.reduce((s,l)=>s+(l.work_minutes||0),0)/60;
    const avgPersonalPerDay = personalHrs / Math.max(1, new Set(logs.map(l=>l.date)).size);
    if(avgPersonalPerDay > APP.config.personalMax) {
      insights.push({
        level:'critical', employee:name, id,
        title:`${name} exceeds personal out limit`,
        body:`Average <strong>${avgPersonalPerDay.toFixed(1)}h/day</strong> personal time against ${APP.config.personalMax}h limit. Total ${personalExits.length} personal exits in 30 days (${personalHrs.toFixed(1)}h). Consider formal discussion.`,
        tags:['Personal Time','Policy Violation']
      });
    }

    // 4. Low attendance
    const daysPresent = new Set(logs.map(l=>l.date)).size;
    const attendancePct = (daysPresent/30)*100;
    if(attendancePct < 70 && daysPresent > 0) {
      insights.push({
        level:'warning', employee:name, id,
        title:`${name} low attendance — ${attendancePct.toFixed(0)}%`,
        body:`Only <strong>${daysPresent} of 30 days</strong> present. Review attendance record and check for unplanned leaves.`,
        tags:['Attendance','HR']
      });
    }

    // 5. High performer
    const score = calcPerformanceScore(id, 30);
    if(score >= 88) {
      insights.push({
        level:'success', employee:name, id,
        title:`${name} — top performer`,
        body:`Performance score <strong>${score}/100</strong>. Consistently meets/exceeds threshold hours with minimal personal exits. Consider recognition or advancement.`,
        tags:['Performance','Recognition']
      });
    }

    // 6. Needs improvement
    if(score < 50 && daysPresent > 3) {
      insights.push({
        level:'warning', employee:name, id,
        title:`${name} needs performance support`,
        body:`Performance score <strong>${score}/100</strong>. Low attendance or below-threshold work hours. Recommend performance review meeting.`,
        tags:['Performance','HR Action']
      });
    }

    // 7. Long unbroken sessions
    const loginLogs = logs.filter(l=>l.type==='login');
    loginLogs.forEach(login => {
      const matchLogout = logouts.find(l=>l.date===login.date&&(l.login_time===login.time||true));
      if(matchLogout && matchLogout.work_minutes > APP.config.longSession*60) {
        insights.push({
          level:'info', employee:name, id,
          title:`${name} had a ${(matchLogout.work_minutes/60).toFixed(1)}h continuous session`,
          body:`On <strong>${matchLogout.date}</strong>, worked for ${fmtMins(matchLogout.work_minutes)} continuously. Long sessions without breaks reduce productivity. Suggest enforcing a lunch break policy.`,
          tags:['Wellbeing','Break Policy']
        });
      }
    });
  });

  // Team-level: purchase coordination
  const allPurchaseDays = {};
  APP.data.logs.filter(l=>l.type==='logout'&&l.reason==='Purchase'&&l.date>=start30).forEach(l=>{
    const key=l.date;
    if(!allPurchaseDays[key]) allPurchaseDays[key]=[];
    allPurchaseDays[key].push(l.name||getUserName(l.id));
  });
  const multiPersonPurchaseDays = Object.entries(allPurchaseDays).filter(([,names])=>names.length>=2);
  if(multiPersonPurchaseDays.length >= 3) {
    insights.push({
      level:'purple', employee:'Team', id:'team',
      title:'Multiple employees making purchase trips on same days',
      body:`Found <strong>${multiPersonPurchaseDays.length} days</strong> where 2+ employees went for purchases. Coordinate a single person per day for purchases to save time. Affected days: ${multiPersonPurchaseDays.slice(0,3).map(([d,n])=>`${d} (${n.join(', ')})`).join(' | ')}`,
      tags:['Team Efficiency','Coordination']
    });
  }

  return insights;
}

function loadInsights() {
  const insights = generateInsights();
  const container = document.getElementById('insights-container');
  const critical = insights.filter(i=>i.level==='critical');
  const warn = insights.filter(i=>i.level==='warning');
  const opt = insights.filter(i=>i.level==='info'||i.level==='purple');
  const pos = insights.filter(i=>i.level==='success');

  document.getElementById('ins-critical').textContent = critical.length;
  document.getElementById('ins-warn').textContent = warn.length;
  document.getElementById('ins-opt').textContent = opt.length;
  document.getElementById('ins-pos').textContent = pos.length;

  if(!insights.length) {
    container.innerHTML = '<div style="text-align:center;padding:60px;color:var(--muted);">No data loaded. Sync Firebase first.</div>';
    return;
  }

  const sorted = [...critical,...warn,...opt,...pos];
  container.innerHTML = sorted.map(ins => `
    <div class="insight-card ${ins.level}">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;">
        <div style="flex:1;">
          <div class="insight-title">${
            ins.level==='critical'?'🔴 ':ins.level==='warning'?'🟡 ':ins.level==='success'?'🟢 ':ins.level==='purple'?'🟣 ':'🔵 '
          }${ins.title}</div>
          <div class="insight-body" style="margin-top:6px;">${ins.body}</div>
        </div>
        <div style="flex-shrink:0;">${ins.id!=='team'?`<span class="badge b-muted">#${ins.id}</span>`:''}</div>
      </div>
      <div class="insight-actions">
        ${ins.tags.map(t=>`<span class="insight-tag">${t}</span>`).join('')}
        ${ins.id!=='team'?`<button class="btn btn-outline btn-sm" style="padding:3px 10px;font-size:10px;" onclick="sendQuick('Deep dive on ${ins.employee}: analyse their full attendance pattern and give specific recommendations')">Ask AI →</button>`:''}
      </div>
    </div>
  `).join('');
}

// ═══════════════════════════════════════════════════════════════════
//   SALARY ENGINE
// ═══════════════════════════════════════════════════════════════════
function renderDesignationList() {
  const container = document.getElementById('designation-list');
  if(!APP.designations.length) {
    container.innerHTML = '<div style="color:var(--muted);font-size:12px;padding:8px 0;">No designations. Click + Add to create one.</div>';
    return;
  }
  container.innerHTML = APP.designations.map((d,i) => `
    <div class="designation-card">
      <div class="designation-card-header">
        <div>
          <div class="designation-name">${escHtml(d.name)}</div>
          <div style="font-size:11px;color:var(--muted);">Base: ${cur()}${(d.base||0).toLocaleString()} · Bonus: ${cur()}${(d.bonus||0).toLocaleString()} · HRA: ${cur()}${(d.hra||0).toLocaleString()}</div>
        </div>
        <div style="display:flex;gap:6px;">
          <button class="btn btn-outline btn-sm" onclick="editDesignation(${i})">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deleteDesignation(${i})">×</button>
        </div>
      </div>
      <div style="font-size:11px;color:var(--muted);">Employees: ${d.employees||'None assigned'} · Bonus trigger: ${d.bonusTrigger||90}% attendance</div>
    </div>
  `).join('');
}

let editingDesigIdx = -1;
function addDesignation() {
  editingDesigIdx = -1;
  document.getElementById('desig-modal-title').textContent = 'Add Designation';
  ['d-name','d-base','d-bonus','d-hra','d-allowances','d-bonus-trigger','d-employees'].forEach(id=>{
    const el=document.getElementById(id); if(el) el.value = id==='d-bonus-trigger'?'90':id.startsWith('d-bonus')||id.startsWith('d-hra')||id.startsWith('d-all')?'0':'';
  });
  document.getElementById('modal-designation').classList.add('open');
}

function editDesignation(i) {
  editingDesigIdx = i;
  const d = APP.designations[i];
  document.getElementById('desig-modal-title').textContent = 'Edit Designation';
  setVal('d-name', d.name); setVal('d-base', d.base); setVal('d-bonus', d.bonus||0);
  setVal('d-hra', d.hra||0); setVal('d-allowances', d.allowances||0);
  setVal('d-bonus-trigger', d.bonusTrigger||90); setVal('d-employees', d.employees||'');
  document.getElementById('modal-designation').classList.add('open');
}

function saveDesignation() {
  const name = getVal('d-name').trim();
  if(!name) { toast('Designation name required','error'); return; }
  const d = {
    name, base:getNum('d-base'), bonus:getNum('d-bonus'), hra:getNum('d-hra'),
    allowances:getNum('d-allowances'), bonusTrigger:getNum('d-bonus-trigger',90),
    employees:getVal('d-employees').trim()
  };
  if(editingDesigIdx>=0) APP.designations[editingDesigIdx]=d;
  else APP.designations.push(d);
  localStorage.setItem('wb_designations',JSON.stringify(APP.designations));
  renderDesignationList();
  closeModal('modal-designation');
  toast('Designation saved','success');
}

function deleteDesignation(i) {
  if(!confirm('Delete this designation?')) return;
  APP.designations.splice(i,1);
  localStorage.setItem('wb_designations',JSON.stringify(APP.designations));
  renderDesignationList();
  toast('Deleted','success');
}

function getEmployeeDesignation(id) {
  return APP.designations.find(d => {
    if(!d.employees) return false;
    return d.employees.split(',').map(s=>s.trim()).includes(String(id));
  });
}

function calculateAllSalaries() {
  const month = getVal('sal-month');
  if(!month) { toast('Select a month','error'); return; }
  const workdays = getNum('sal-workdays',26);
  const thresholdHrs = getNum('sal-threshold-hrs',8);
  const otRate = getNum('sal-ot-rate',1.5);
  const personalLimit = getNum('sal-personal-limit',1);
  const personalPenaltyPct = getNum('sal-personal-penalty',0.5)/100;

  document.getElementById('sal-period-label').textContent = month;
  const monthDates = getMonthDates(month);
  const users = Object.entries(APP.data.users).filter(([id])=>id!=='0');

  const results = users.map(([id,u]) => {
    const desig = getEmployeeDesignation(id);
    const base = desig ? (desig.base||0) : 0;
    const bonus = desig ? (desig.bonus||0) : 0;
    const hra = desig ? (desig.hra||0) : 0;
    const allowances = desig ? (desig.allowances||0) : 0;
    const bonusTrigger = desig ? (desig.bonusTrigger||90) : 90;

    const logs = APP.data.logs.filter(l=>String(l.id)===String(id)&&l.date.startsWith(month));
    const logouts = logs.filter(l=>l.type==='logout');
    const daysPresent = new Set(logs.map(l=>l.date)).size;

    const dailyRate = (base+hra+allowances) / workdays;
    const hourlyRate = dailyRate / thresholdHrs;

    let totalWorkHrs = 0, otHrs = 0, personalHrs = 0;
    monthDates.forEach(date => {
      const dayLogouts = logouts.filter(l=>l.date===date);
      const workMins = dayLogouts.filter(l=>l.reason!=='Personal').reduce((s,l)=>s+(l.work_minutes||0),0);
      const persMins = dayLogouts.filter(l=>l.reason==='Personal').reduce((s,l)=>s+(l.work_minutes||0),0);
      const dayWorkHrs = workMins/60;
      totalWorkHrs += dayWorkHrs;
      personalHrs += persMins/60;
      if(dayWorkHrs > thresholdHrs) otHrs += dayWorkHrs - thresholdHrs;
    });

    const attendancePct = (daysPresent/workdays)*100;
    const absentDays = workdays - daysPresent;
    const absentDeduction = absentDays * dailyRate;

    const basePay = Math.max(0, base - absentDeduction);
    const otPay = otHrs * hourlyRate * otRate;

    // Personal time penalty
    const excessPersonal = Math.max(0, personalHrs - (personalLimit * daysPresent));
    const personalPenalty = excessPersonal * hourlyRate * (personalPenaltyPct * 100);

    const earnedBonus = attendancePct >= bonusTrigger ? bonus : 0;
    const netSalary = basePay + hra + allowances + otPay + earnedBonus - personalPenalty;

    return {
      id, name:u.name||('User '+id), designation:desig?desig.name:'Unassigned',
      daysPresent, totalWorkHrs:+totalWorkHrs.toFixed(2), otHrs:+otHrs.toFixed(2),
      personalHrs:+personalHrs.toFixed(2), basePay:Math.round(basePay),
      otPay:Math.round(otPay), earnedBonus:Math.round(earnedBonus),
      personalPenalty:Math.round(personalPenalty), netSalary:Math.round(netSalary),
      attendancePct:+attendancePct.toFixed(1)
    };
  });

  APP.salaryResults = results;
  const tbody = document.getElementById('salary-tbody');
  const c = cur();
  tbody.innerHTML = results.map(r => `
    <tr>
      <td><div style="display:flex;align-items:center;gap:8px;">
        <div style="width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,var(--accent),var(--accent2));display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:#000;">${initials(r.name)}</div>
        <div><div style="font-weight:600;">${escHtml(r.name)}</div><div style="font-size:10px;color:var(--muted);">ID: ${r.id}</div></div>
      </div></td>
      <td><span class="badge b-blue">${escHtml(r.designation)}</span></td>
      <td style="font-family:var(--fm);">${r.totalWorkHrs}h</td>
      <td style="font-family:var(--fm);color:${r.otHrs>0?'var(--warn)':'var(--muted)'};">${r.otHrs>0?'+':''} ${r.otHrs}h</td>
      <td style="font-family:var(--fm);color:${r.personalHrs>0?'#ff6b6b':'var(--muted)'};">${r.personalHrs}h</td>
      <td style="font-family:var(--fm);color:#ff6b6b;">${r.personalPenalty>0?'-'+c+r.personalPenalty.toLocaleString():'—'}</td>
      <td style="font-family:var(--fm);">${c}${r.basePay.toLocaleString()}</td>
      <td style="font-family:var(--fm);color:var(--warn);">${r.otPay>0?'+'+c+r.otPay.toLocaleString():'—'}</td>
      <td style="font-family:var(--fm);color:var(--accent);">${r.earnedBonus>0?'+'+c+r.earnedBonus.toLocaleString():'—'}</td>
      <td style="font-family:var(--fm);color:#ff6b6b;">${(r.personalPenalty)>0?'-'+c+r.personalPenalty.toLocaleString():'—'}</td>
      <td style="font-family:var(--fm);font-weight:700;font-size:14px;color:var(--accent);">${c}${r.netSalary.toLocaleString()}</td>
      <td>${r.attendancePct>=90?'<span class="badge b-green">Excellent</span>':r.attendancePct>=75?'<span class="badge b-blue">Good</span>':r.attendancePct>=60?'<span class="badge b-yellow">Average</span>':'<span class="badge b-red">Low</span>'}</td>
    </tr>
  `).join('');
  toast('Salary calculated for '+results.length+' employees','success');
}

function exportSalaryCSV() {
  if(!APP.salaryResults.length){toast('Run calculation first','error');return;}
  const headers=['ID','Name','Designation','Days Present','Work Hrs','OT Hrs','Personal Hrs','Base Pay','OT Pay','Bonus','Penalty','Net Salary','Attendance %'];
  const c = cur();
  const csv=[headers.join(','),...APP.salaryResults.map(r=>[
    r.id,`"${r.name}"`,`"${r.designation}"`,r.daysPresent,r.totalWorkHrs,r.otHrs,r.personalHrs,
    r.basePay,r.otPay,r.earnedBonus,r.personalPenalty,r.netSalary,r.attendancePct
  ].join(','))].join('\n');
  dlFile(csv,'salary_report_'+getVal('sal-month')+'.csv','text/csv');
}

// ═══════════════════════════════════════════════════════════════════
//   PERFORMANCE
// ═══════════════════════════════════════════════════════════════════
function loadPerformance() {
  const days = parseInt(getVal('perf-period'))||30;
  const dates = getPeriodDates(days);
  const start = dates[0];
  const users = Object.entries(APP.data.users).filter(([id])=>id!=='0');

  // Work hours chart (top 6 users)
  const datasets = users.slice(0,6).map(([id,u],i)=>{
    const colors=['#00e5a0','#0085ff','#ff6b35','#ffcc00','#a855f7','#ff6b6b'];
    const data = dates.map(d=>{
      const m=APP.data.logs.filter(l=>String(l.id)===String(id)&&l.date===d&&l.type==='logout'&&l.reason!=='Personal').reduce((s,l)=>s+(l.work_minutes||0),0);
      return +(m/60).toFixed(2);
    });
    return {label:u.name||('User '+id),data,borderColor:colors[i],backgroundColor:colors[i]+'22',tension:.4,fill:false,pointRadius:2};
  });
  mkChart('perf-hours-chart','line',dates.map(d=>d.slice(5)),datasets);

  // Reason distribution
  const rc={};
  APP.data.logs.filter(l=>l.date>=start&&l.type==='logout'&&l.reason).forEach(l=>{rc[l.reason]=(rc[l.reason]||0)+1;});
  const RCOLS={'Personal':'#ff6b6b','Meeting':'#0085ff','Field Work':'#00e5a0','Day Close':'#ffcc00','Purchase':'#ff6b35'};
  mkChart('perf-reason-chart','doughnut',Object.keys(rc),[{data:Object.values(rc),backgroundColor:Object.keys(rc).map(k=>RCOLS[k]||'#5a6180'),borderWidth:0}],{plugins:{legend:{labels:{color:'#5a6180',font:{family:'DM Mono',size:10}}},tooltip:CD.plugins.tooltip},cutout:'60%'});

  // Ranking table
  const ranked = users.map(([id,u])=>{
    const logs = APP.data.logs.filter(l=>String(l.id)===String(id)&&l.date>=start);
    const logouts = logs.filter(l=>l.type==='logout');
    const daysPresent = new Set(logs.map(l=>l.date)).size;
    const totalWork = logouts.filter(l=>l.reason!=='Personal').reduce((s,l)=>s+(l.work_minutes||0),0)/60;
    const avgWork = daysPresent ? totalWork/daysPresent : 0;
    const personalExits = logouts.filter(l=>l.reason==='Personal').length;
    const otDays = dates.filter(d=>getUserWorkHoursToday(id,d)>APP.config.otThreshold).length;
    const score = calcPerformanceScore(id,days);
    const firstLogins = dates.map(d=>{
      const l=APP.data.logs.filter(ll=>String(ll.id)===String(id)&&ll.date===d&&ll.type==='login').sort((a,b)=>(a.time||'').localeCompare(b.time||''))[0];
      return l?l.time:null;
    }).filter(Boolean);
    const avgIn = firstLogins.length?firstLogins.reduce((s,t)=>{const[h,m]=t.split(':').map(Number);return s+h*60+m;},0)/firstLogins.length:0;
    const punctuality = avgIn>0&&avgIn<=9*60?'On-time':'Variable';
    return {id,name:u.name||('User '+id),score,daysPresent,avgWork:+avgWork.toFixed(2),otDays,personalExits,punctuality};
  }).filter(r=>r.daysPresent>0).sort((a,b)=>b.score-a.score);

  const tbody = document.getElementById('perf-tbody');
  tbody.innerHTML = ranked.map((r,i)=>`
    <tr>
      <td><span style="font-family:var(--fm);font-weight:700;color:${i===0?'var(--warn)':i===1?'var(--muted)':i===2?'var(--accent3)':'var(--muted)'};">${i===0?'🥇':i===1?'🥈':i===2?'🥉':'#'+(i+1)}</span></td>
      <td><div style="display:flex;align-items:center;gap:8px;"><div style="width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,var(--accent),var(--accent2));display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:#000;">${initials(r.name)}</div>${escHtml(r.name)}</div></td>
      <td>
        <div style="display:flex;align-items:center;gap:8px;">
          <span style="font-family:var(--fm);font-weight:700;color:${scoreColor(r.score)};">${r.score}</span>
          <div style="flex:1;"><div class="pbar" style="width:80px;"><div class="pfill" style="width:${r.score}%;background:${scoreColor(r.score)};"></div></div></div>
        </div>
      </td>
      <td style="font-family:var(--fm);">${r.daysPresent}d</td>
      <td style="font-family:var(--fm);">${r.avgWork}h</td>
      <td style="font-family:var(--fm);color:${r.otDays>0?'var(--warn)':'var(--muted)'};">${r.otDays}</td>
      <td style="font-family:var(--fm);color:${r.personalExits>5?'#ff6b6b':'var(--muted)'};">${r.personalExits}</td>
      <td><span class="badge ${r.punctuality==='On-time'?'b-green':'b-yellow'}">${r.punctuality}</span></td>
      <td>${r.score>=85?'<span class="badge b-green">Excellent</span>':r.score>=70?'<span class="badge b-blue">Good</span>':r.score>=55?'<span class="badge b-yellow">Average</span>':'<span class="badge b-red">Needs Improvement</span>'}</td>
    </tr>
  `).join('');
}

// ═══════════════════════════════════════════════════════════════════
//   OVERTIME & ALERTS
// ═══════════════════════════════════════════════════════════════════
function loadOvertimeAlerts() {
  const today = todayStr();
  const last7 = getPeriodDates(7);
  const last30 = getPeriodDates(30);
  const users = Object.entries(APP.data.users).filter(([id])=>id!=='0');

  let otToday=0, personalViolations=0, longSessions=0, noBreaks=0;
  const alerts = [];
  const otRegister = [];

  users.forEach(([id,u])=>{
    const name = u.name||('User '+id);
    // Today OT
    const todayWork = getUserWorkHoursToday(id, today);
    if(todayWork > APP.config.otThreshold) {
      otToday++;
      alerts.push({
        icon:'⏰', level:'critical',
        title:`${name} overtime today`,
        detail:`${todayWork.toFixed(1)}h worked, ${(todayWork-APP.config.otThreshold).toFixed(1)}h over limit`
      });
    }

    // Personal violations today
    const persMinsToday = APP.data.logs.filter(l=>String(l.id)===String(id)&&l.date===today&&l.type==='logout'&&l.reason==='Personal').reduce((s,l)=>s+(l.work_minutes||0),0);
    if(persMinsToday/60 > APP.config.personalMax) {
      personalViolations++;
      alerts.push({
        icon:'🚶',level:'warning',
        title:`${name} exceeded personal limit today`,
        detail:`${(persMinsToday/60).toFixed(1)}h personal time vs ${APP.config.personalMax}h limit`
      });
    }

    // Long sessions
    const todayLogouts = APP.data.logs.filter(l=>String(l.id)===String(id)&&l.date===today&&l.type==='logout');
    todayLogouts.forEach(l=>{
      if(l.work_minutes>APP.config.longSession*60){
        longSessions++;
        alerts.push({icon:'🔥',level:'warning',title:`${name} long session`,detail:`${fmtMins(l.work_minutes)} single session today`});
      }
    });

    // This month OT register
    last30.forEach(date=>{
      const dayWork = getUserWorkHoursToday(id, date);
      if(dayWork > APP.config.otThreshold) {
        const otHrs = dayWork - APP.config.otThreshold;
        otRegister.push({id, name, date, regularHrs:APP.config.otThreshold, otHrs:+otHrs.toFixed(2)});
      }
    });
  });

  document.getElementById('ot-today').textContent = otToday;
  document.getElementById('ot-personal').textContent = personalViolations;
  document.getElementById('ot-long').textContent = longSessions;
  document.getElementById('ot-breaks').textContent = noBreaks;

  // Alerts list
  const al = document.getElementById('active-alerts-list');
  al.innerHTML = alerts.length ? alerts.map(a=>`
    <div class="alert-row">
      <div class="alert-icon">${a.icon}</div>
      <div class="alert-text-wrap">
        <div class="alert-title">${a.title}</div>
        <div class="alert-detail">${a.detail}</div>
      </div>
      <span class="badge ${a.level==='critical'?'b-red':'b-yellow'}">${a.level}</span>
    </div>
  `).join('') : '<div style="text-align:center;padding:30px;color:var(--muted);">No active alerts today ✓</div>';

  // OT trend chart (last 7 days)
  const otCounts = last7.map(date=>users.filter(([id])=>getUserWorkHoursToday(id,date)>APP.config.otThreshold).length);
  mkChart('ot-trend-chart','bar',last7.map(d=>d.slice(5)),[{
    label:'Employees OT',data:otCounts,backgroundColor:'rgba(255,204,0,.3)',borderColor:'var(--warn)',borderWidth:1.5,borderRadius:4
  }]);

  // OT register table
  const tbody = document.getElementById('ot-register-tbody');
  const sorted = otRegister.sort((a,b)=>b.date.localeCompare(a.date)).slice(0,30);
  tbody.innerHTML = sorted.length ? sorted.map(r=>`
    <tr>
      <td>${escHtml(r.name)}</td>
      <td style="font-family:var(--fm);">${r.date}</td>
      <td style="font-family:var(--fm);">${r.regularHrs}h</td>
      <td style="font-family:var(--fm);color:var(--warn);">+${r.otHrs}h</td>
      <td><span class="badge b-yellow">Overtime</span></td>
      <td style="font-size:12px;color:var(--muted);">${r.otHrs>=2?'Consider next-day comp-off':'Schedule earlier check-out tomorrow'}</td>
    </tr>
  `).join('') : '<tr><td colspan="6" style="text-align:center;padding:24px;color:var(--muted);">No OT recorded this month</td></tr>';
}

// ═══════════════════════════════════════════════════════════════════
//   PURCHASE ANALYSIS
// ═══════════════════════════════════════════════════════════════════
function loadPurchaseAnalysis() {
  const last30 = getPeriodDates(30);
  const start30 = last30[0];
  const purchaseLogs = APP.data.logs.filter(l=>l.type==='logout'&&l.reason==='Purchase'&&l.date>=start30);
  const users = Object.entries(APP.data.users).filter(([id])=>id!=='0');

  // By employee by day
  const byEmpDay = {};
  purchaseLogs.forEach(l=>{
    const key = `${l.id}::${l.date}`;
    if(!byEmpDay[key]) byEmpDay[key]={id:l.id,name:l.name||getUserName(l.id),date:l.date,count:0};
    byEmpDay[key].count++;
  });

  const allTrips = Object.values(byEmpDay);
  const dupTrips = allTrips.filter(t=>t.count>=2);
  const totalExtra = dupTrips.reduce((s,t)=>s+(t.count-1),0);
  const timeWasted = totalExtra * APP.config.purchaseDur; // mins

  // Estimated cost (use avg salary)
  const avgSalary = APP.designations.length
    ? APP.designations.reduce((s,d)=>s+(d.base||0),0)/APP.designations.length
    : 25000;
  const hourlyAvg = avgSalary/(26*8);
  const costWasted = (timeWasted/60)*hourlyAvg;

  document.getElementById('pur-total').textContent = purchaseLogs.length;
  document.getElementById('pur-dup').textContent = dupTrips.length;
  document.getElementById('pur-wasted').textContent = fmtMins(timeWasted);
  document.getElementById('pur-saving').textContent = cur()+Math.round(costWasted).toLocaleString();

  // Insights
  const wrap = document.getElementById('purchase-insights-wrap');
  const insights = [];
  if(dupTrips.length>0) {
    // Group by employee
    const byEmp = {};
    dupTrips.forEach(t=>{ if(!byEmp[t.name]) byEmp[t.name]=[]; byEmp[t.name].push(t); });
    Object.entries(byEmp).forEach(([name,trips])=>{
      insights.push(`<div class="insight-card critical">
        <div class="insight-title">🛒 ${escHtml(name)} — ${trips.length} duplicate purchase day(s)</div>
        <div class="insight-body">
          Made multiple purchase trips on: ${trips.map(t=>`<strong>${t.date}</strong> (${t.count} trips)`).join(', ')}.<br>
          Estimated <strong>${fmtMins(trips.reduce((s,t)=>s+(t.count-1),0)*APP.config.purchaseDur)}</strong> wasted.<br>
          <strong>Suggestion:</strong> Consolidate into a single morning purchase run. Prepare a checklist the day before.
        </div>
        <div class="insight-actions"><span class="insight-tag">Purchase</span><span class="insight-tag">Efficiency</span></div>
      </div>`);
    });
  }

  // Multi-person same day
  const byDay = {};
  purchaseLogs.forEach(l=>{ if(!byDay[l.date]) byDay[l.date]=[]; byDay[l.date].push(l.name||getUserName(l.id)); });
  const multiPerson = Object.entries(byDay).filter(([,names])=>new Set(names).size>=2);
  if(multiPerson.length>0) {
    insights.push(`<div class="insight-card purple">
      <div class="insight-title">🤝 Team coordination: multiple employees buying on same day</div>
      <div class="insight-body">
        Found <strong>${multiPerson.length} days</strong> where 2+ employees made separate purchase trips. Assign a single designated buyer per day.<br>
        Days: ${multiPerson.slice(0,5).map(([d,n])=>`<strong>${d}</strong>: ${[...new Set(n)].join(', ')}`).join(' | ')}
      </div>
      <div class="insight-actions"><span class="insight-tag">Team Policy</span><span class="insight-tag">Coordination</span></div>
    </div>`);
  }

  if(!insights.length) {
    wrap.innerHTML = '<div class="insight-card success"><div class="insight-title">✅ No redundant purchase trips detected</div><div class="insight-body">All purchase trips in the last 30 days appear well-coordinated.</div></div>';
  } else {
    wrap.innerHTML = insights.join('');
  }

  // Table
  const tbody = document.getElementById('purchase-tbody');
  tbody.innerHTML = allTrips.sort((a,b)=>b.date.localeCompare(a.date)).map(t=>`
    <tr>
      <td>${escHtml(t.name)}</td>
      <td style="font-family:var(--fm);">${t.date}</td>
      <td style="font-family:var(--fm);font-weight:700;color:${t.count>=2?'var(--warn)':'var(--text)'};">${t.count}</td>
      <td style="font-family:var(--fm);">${fmtMins(t.count*APP.config.purchaseDur)}</td>
      <td>${t.count>=2?'<span class="badge b-red">Duplicate</span>':'<span class="badge b-green">OK</span>'}</td>
      <td style="font-size:12px;color:var(--muted);">${t.count>=2?'Consolidate into 1 trip. Prepare item list in advance.':'Good'}</td>
    </tr>
  `).join('');
}

// ═══════════════════════════════════════════════════════════════════
//   CONFIG
// ═══════════════════════════════════════════════════════════════════
function saveConfig() {
  APP.fbUrl = getVal('cfg-fb-url').trim();
  APP.apiKey = getVal('cfg-api-key').trim();
  APP.currency = getVal('cfg-currency').trim()||'₹';
  APP.company = getVal('cfg-company').trim()||'My Company';
  APP.config.otThreshold = getNum('cfg-ot-threshold',8);
  APP.config.personalMax = getNum('cfg-personal-max',1);
  APP.config.fieldMax = getNum('cfg-field-max',4);
  APP.config.purchaseDur = getNum('cfg-purchase-dur',45);
  APP.config.longSession = getNum('cfg-long-session',6);

  localStorage.setItem('wb_fb_url', APP.fbUrl);
  localStorage.setItem('wb_api_key', APP.apiKey);
  localStorage.setItem('wb_currency', APP.currency);
  localStorage.setItem('wb_company', APP.company);
  localStorage.setItem('wb_ot_threshold', APP.config.otThreshold);
  localStorage.setItem('wb_personal_max', APP.config.personalMax);
  localStorage.setItem('wb_field_max', APP.config.fieldMax);
  localStorage.setItem('wb_purchase_dur', APP.config.purchaseDur);
  localStorage.setItem('wb_long_session', APP.config.longSession);

  setVal('sal-threshold-hrs', APP.config.otThreshold);
  setVal('sal-personal-limit', APP.config.personalMax);

  document.getElementById('cfg-status').textContent = '';
  toast('Configuration saved','success');
  refreshData();
}

// ═══════════════════════════════════════════════════════════════════
//   MODAL
// ═══════════════════════════════════════════════════════════════════
function closeModal(id) { document.getElementById(id).classList.remove('open'); }
document.querySelectorAll('.modal-overlay').forEach(m=>{
  m.addEventListener('click',e=>{if(e.target===m)m.classList.remove('open');});
});

// ═══════════════════════════════════════════════════════════════════
//   UTILS
// ═══════════════════════════════════════════════════════════════════
function escHtml(s) {
  if(!s) return '';
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function toast(msg, type='info') {
  const c = document.getElementById('toast-wrap');
  const el = document.createElement('div');
  el.className = 'toast '+type;
  const icon = {success:'✓',error:'✕',info:'ℹ'}[type]||'•';
  const col = {success:'var(--accent)',error:'#ff6b6b',info:'var(--accent2)'}[type]||'var(--muted)';
  el.innerHTML = `<span style="color:${col};font-weight:700;">${icon}</span> ${escHtml(msg)}`;
  c.appendChild(el);
  setTimeout(()=>el.remove(),3500);
}

function dlFile(content, name, mime='text/csv') {
  const a=document.createElement('a');
  a.href=`data:${mime};charset=utf-8,`+encodeURIComponent(content);
  a.download=name; a.click();
}
</script>
</body>
</html>
