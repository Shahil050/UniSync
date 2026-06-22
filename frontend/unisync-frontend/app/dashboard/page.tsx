"use client";

import "./dashboard.css";

export default function DashboardPage() {
  return (
    <>
      <Sidebar />
      <main className="main">
        <Topbar />
        <ProfileCard />
        <StatsRow />

        <div className="dash-grid">
          <div className="col-left">
            <ActiveProjectsPanel />
            <RecentActivityPanel />
            <SkillsPanel />
          </div>

          <div className="col-right">
            <CredentialsPanel />
            <SuggestedPeersPanel />
            <AgreementStatusPanel />
          </div>
        </div>
      </main>
    </>
  );
}

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sb-logo">
        Uni<span>Sync</span>
      </div>

      <nav className="sb-nav">
        <a className="sb-link active" href="#">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <rect x="3" y="3" width="7" height="9" rx="1" />
            <rect x="14" y="3" width="7" height="5" rx="1" />
            <rect x="14" y="12" width="7" height="9" rx="1" />
            <rect x="3" y="16" width="7" height="5" rx="1" />
          </svg>
          Dashboard
        </a>
        <a className="sb-link" href="#">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21v-1a7 7 0 0114 0v1" />
          </svg>
          My profile
        </a>
        <a className="sb-link" href="#">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M9 11l3 3L22 4" />
            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
          </svg>
          My projects
          <span className="sb-badge-count">3</span>
        </a>
        <a className="sb-link" href="/discover">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
          Discover peers
        </a>
        <a className="sb-link" href="/agreements">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
            <path d="M14 2v6h6" />
          </svg>
          Agreements
        </a>
        <a className="sb-link" href="/credentials">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <circle cx="12" cy="8" r="6" />
            <path d="M9 14l-2 8 5-3 5 3-2-8" />
          </svg>
          Credentials
        </a>
        <a className="sb-link" href="#">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          </svg>
          Messages
        </a>

        <div className="sb-section-label">Settings</div>
        <a className="sb-link" href="#">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06A1.65 1.65 0 005 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06A1.65 1.65 0 008 4.6c.5.21 1 .1 1.51-.33V3a2 2 0 014 0v.09A1.65 1.65 0 0015 5c.21.5.33 1 1.82.33l.06-.06a2 2 0 112.83 2.83l-.06.06A1.65 1.65 0 0019.4 9c.21.5.1 1 1.51 1.51z" />
          </svg>
          Settings
        </a>
      </nav>

      <div className="sb-footer">
        <div className="sb-avatar">RY</div>
        <div className="sb-footer-info">
          <h5>Rabindra Yadav</h5>
          <p>22070498 · Computer Eng.</p>
        </div>
      </div>
    </aside>
  );
}

function Topbar() {
  return (
    <div className="topbar">
      <div className="topbar-greeting">
        <h1>Welcome back, Rabindra</h1>
        <p>Here&apos;s what&apos;s happening across your projects today.</p>
      </div>
      <div className="topbar-actions">
        <button className="icon-btn" title="Messages">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          </svg>
        </button>
        <button className="icon-btn" title="Notifications">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 01-3.46 0" />
          </svg>
          <span className="notif-dot"></span>
        </button>
        <button className="btn-primary-sm">+ Post idea</button>
      </div>
    </div>
  );
}

function ProfileCard() {
  return (
    <div className="profile-card">
      <div className="profile-avatar-lg">RY</div>
      <div className="profile-main-info">
        <h2>
          Rabindra Yadav <span className="verified-tick">✓</span>
        </h2>
        <p className="role">Cyber security · ML engineer</p>
        <p className="meta">22070498 · Computer engineering · Batch 2022 · Everest Engineering College</p>
      </div>
      <div className="reputation-block">
        <div className="rep-score">87</div>
        <div className="rep-label">Reputation score</div>
      </div>
      <button className="profile-edit-btn">Edit profile</button>
    </div>
  );
}

const STATS = [
  { icon: "🟢", bg: "rgba(249,115,22,0.12)", trend: "+2 this month", trendClass: "up", value: 3, label: "Active projects" },
  { icon: "🏅", bg: "rgba(34,197,94,0.12)", trend: "+1 this month", trendClass: "up", value: 5, label: "Completion badges" },
  { icon: "⚠️", bg: "rgba(239,68,68,0.1)", trend: "0 new", trendClass: "down", value: 0, label: "Penalty tags" },
  { icon: "🤝", bg: "rgba(234,179,8,0.12)", trend: "12 new", trendClass: "up", value: 34, label: "Peer matches" },
];

function StatsRow() {
  return (
    <div className="stats-row">
      {STATS.map((stat) => (
        <div className="stat-card" key={stat.label}>
          <div className="stat-top">
            <div className="stat-icon-sm" style={{ background: stat.bg }}>
              {stat.icon}
            </div>
            <span className={`stat-trend ${stat.trendClass}`}>{stat.trend}</span>
          </div>
          <div className="stat-value">{stat.value}</div>
          <div className="stat-name">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}

const PROJECTS = [
  { icon: "🔍", name: "NLP-based search engine", meta: "4 members · due in 3 weeks", progress: 78, status: "active", statusLabel: "Active" },
  { icon: "🔗", name: "Blockchain voting system", meta: "3 members · due in 1 week", progress: 94, status: "review", statusLabel: "In review" },
  { icon: "📱", name: "Campus navigation AR app", meta: "5 members · due in 6 weeks", progress: 32, status: "active", statusLabel: "Active" },
  { icon: "📊", name: "Sentiment analysis dashboard", meta: "2 members · completed Mar 2026", progress: 100, status: "done", statusLabel: "Completed" },
];

function ActiveProjectsPanel() {
  return (
    <div className="panel">
      <div className="panel-head">
        <h3>Active projects</h3>
        <a href="#">View all →</a>
      </div>

      {PROJECTS.map((p) => (
        <div className="project-item" key={p.name}>
          <div className="project-icon">{p.icon}</div>
          <div className="project-info">
            <h4>{p.name}</h4>
            <p>{p.meta}</p>
          </div>
          <div className="project-progress-wrap">
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: `${p.progress}%` }}></div>
            </div>
            <div className="progress-pct">{p.progress}%</div>
          </div>
          <span className={`status-chip ${p.status}`}>{p.statusLabel}</span>
        </div>
      ))}
    </div>
  );
}

const ACTIVITY = [
  { dot: "green", text: <><b>Hina Tamrakar</b> marked task &quot;API integration&quot; as complete in NLP search engine</>, time: "2 hours ago" },
  { dot: "teal", text: <>You signed the project agreement for <b>Campus navigation AR app</b></>, time: "Yesterday, 4:12 PM" },
  { dot: "amber", text: <><b>Kajal Kumari Kushwaha</b> requested to join your project &quot;Sentiment analysis dashboard&quot;</>, time: "2 days ago" },
  { dot: "green", text: <>You earned the <b>&quot;Reliable collaborator&quot;</b> completion badge</>, time: "4 days ago" },
  { dot: "teal", text: <><b>Shahil Shrestha</b> uploaded &quot;Final_Report_Draft.pdf&quot; to Blockchain voting system</>, time: "5 days ago" },
];

function RecentActivityPanel() {
  return (
    <div className="panel">
      <div className="panel-head">
        <h3>Recent activity</h3>
        <a href="#">View log →</a>
      </div>

      {ACTIVITY.map((a, i) => (
        <div className="activity-item" key={i}>
          <div className={`activity-dot ${a.dot}`}></div>
          <div className="activity-text">
            <p>{a.text}</p>
            <span>{a.time}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function SkillsPanel() {
  const skills = ["Python", "Cyber security", "Django", "Machine learning", "NLP"];
  const interests = ["Artificial intelligence", "Web development", "HCI"];

  return (
    <div className="panel">
      <div className="panel-head">
        <h3>Skills & interests</h3>
        <a href="#">Edit →</a>
      </div>
      <p style={{ fontSize: "0.78rem", color: "var(--slate)", marginBottom: "0.6rem" }}>Skills</p>
      <div className="chips-wrap" style={{ marginBottom: "1.2rem" }}>
        {skills.map((s) => (
          <span className="chip-display" key={s}>{s}</span>
        ))}
      </div>
      <p style={{ fontSize: "0.78rem", color: "var(--slate)", marginBottom: "0.6rem" }}>Research interests</p>
      <div className="chips-wrap">
        {interests.map((s) => (
          <span className="chip-display" key={s}>{s}</span>
        ))}
      </div>
    </div>
  );
}

const BADGES = [
  { icon: "🏅", name: "Reliable collaborator", date: "Mar 2026" },
  { icon: "🎯", name: "Project lead", date: "Jan 2026" },
  { icon: "⚡", name: "Fast closer", date: "Dec 2025" },
  { icon: "🧠", name: "ML specialist", date: "Nov 2025" },
  { icon: "🤝", name: "Team player", date: "Oct 2025" },
  { icon: "🔒", name: "Mentor", date: "Locked", locked: true },
];

function CredentialsPanel() {
  return (
    <div className="panel">
      <div className="panel-head">
        <h3>Earned credentials</h3>
        <a href="#">View all →</a>
      </div>
      <div className="badges-grid">
        {BADGES.map((b) => (
          <div className={`badge-tile ${b.locked ? "locked" : ""}`} key={b.name}>
            <div className="badge-tile-icon">{b.icon}</div>
            <h5>{b.name}</h5>
            <p>{b.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const PEERS = [
  { initials: "RY", name: "Kajal Kushwaha", meta: "NLP · Backend development", match: 94 },
  { initials: "SS", name: "Shahil Shrestha", meta: "UI/UX · React", match: 89 },
  { initials: "PB", name: "Priya Basnet", meta: "Data science · Python", match: 86 },
  { initials: "AK", name: "Hina Tamrakar", meta: "Cybersecurity · Cloud", match: 81 },
];

function SuggestedPeersPanel() {
  return (
    <div className="panel">
      <div className="panel-head">
        <h3>Suggested peers</h3>
        <a href="#">See more →</a>
      </div>
      {PEERS.map((p) => (
        <div className="peer-item" key={p.name}>
          <div className="peer-avatar">{p.initials}</div>
          <div className="peer-info">
            <h5>{p.name}</h5>
            <p>{p.meta}</p>
          </div>
          <div className="match-pct">{p.match}%</div>
        </div>
      ))}
    </div>
  );
}

function AgreementStatusPanel() {
  return (
    <div className="panel">
      <div className="panel-head">
        <h3>Agreement status</h3>
        <a href="#">Manage →</a>
      </div>

      <div className="contract-card">
        <div className="contract-top">
          <h5>Campus navigation AR app</h5>
          <span className="status-chip active">Active</span>
        </div>
        <p>All members signed · started Apr 2026</p>
        <div className="signers">
          <div className="signer-dot">KK</div>
          <div className="signer-dot">HT</div>
          <div className="signer-dot">+3</div>
        </div>
      </div>

      <div className="contract-card">
        <div className="contract-top">
          <h5>NLP-based search engine</h5>
          <span className="status-chip review">1 pending</span>
        </div>
        <p>3 of 4 members signed</p>
        <div className="signers">
          <div className="signer-dot">KK</div>
          <div className="signer-dot">HT</div>
          <div className="signer-dot">SS</div>
          <div className="signer-dot pending">?</div>
        </div>
      </div>
    </div>
  );
}