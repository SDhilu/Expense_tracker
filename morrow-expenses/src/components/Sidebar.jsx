
import {
  ChartNoAxesCombined,
  LayoutDashboard,
  Settings,
  Wallet,
  X,
} from "lucide-react";

export default function Sidebar({
  activePage,
  onNavigate,
  budget,
  spent,
  open,
  onClose,
}) {
  const progress = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;

  return (
    <>
      {open && <button className="sidebar-backdrop" onClick={onClose} aria-label="Close menu" />}

      <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
        <div className="brand">
          <span className="brand-icon"><Wallet size={19} /></span>
          <span>morrow<span className="brand-dot">.</span></span>
          <button className="sidebar-close" onClick={onClose} aria-label="Close sidebar">
            <X size={20} />
          </button>
        </div>

        <div className="sidebar-label">WORKSPACE</div>

        <nav className="sidebar-nav">
          <button
            className={activePage === "overview" ? "nav-item active" : "nav-item"}
            onClick={() => onNavigate("overview")}
          >
            <LayoutDashboard size={18} />
            Overview
          </button>

          <button
            className={activePage === "transactions" ? "nav-item active" : "nav-item"}
            onClick={() => onNavigate("transactions")}
          >
            <Wallet size={18} />
            Transactions
          </button>

          <button
            className={activePage === "insights" ? "nav-item active" : "nav-item"}
            onClick={() => onNavigate("insights")}
          >
            <ChartNoAxesCombined size={18} />
            Insights
          </button>

          <button
            className={activePage === "budget" ? "nav-item active" : "nav-item"}
            onClick={() => onNavigate("budget")}
          >
            <Settings size={18} />
            Budget settings
          </button>
        </nav>

        <div className="sidebar-bottom">
          <div className="budget-mini">
            <div className="budget-mini-icon"><Wallet size={17} /></div>
            <p>Monthly budget</p>
            <h3>{budget.toLocaleString("en-LK")}</h3>
            <div className="progress-track">
              <div
                className={`progress-fill ${progress >= 100 ? "over-budget" : ""}`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="budget-mini-footer">
              <span>{Math.round(progress)}% used</span>
              <span>LKR</span>
            </div>
          </div>

          <div className="sidebar-profile">
            <div className="avatar">M</div>
            <div>
              <strong>My wallet</strong>
              <span>Personal account</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
