
import { ArrowDownLeft, ArrowUpRight, Wallet, ReceiptText } from "lucide-react";
import { formatCurrency } from "../data";

export default function SummaryCards({ total, budget, count, previousTotal }) {
  const remaining = budget - total;
  const difference = previousTotal > 0
    ? ((total - previousTotal) / previousTotal) * 100
    : null;

  return (
    <div className="summary-grid">
      <article className="summary-card primary-summary">
        <div className="summary-card-top">
          <span>Total expenses</span>
          <div className="summary-icon olive-icon"><Wallet size={19} /></div>
        </div>
        <h2>{formatCurrency(total)}</h2>
        <div className="summary-foot">
          {difference === null ? (
            <span className="summary-muted">Your selected month's spending</span>
          ) : (
            <span className={difference > 0 ? "trend-bad" : "trend-good"}>
              {difference > 0 ? <ArrowUpRight size={15} /> : <ArrowDownLeft size={15} />}
              {Math.abs(difference).toFixed(1)}% vs last month
            </span>
          )}
        </div>
      </article>

      <article className="summary-card">
        <div className="summary-card-top">
          <span>Remaining budget</span>
          <div className="summary-icon beige-icon"><Wallet size={19} /></div>
        </div>
        <h2 className={remaining < 0 ? "negative-value" : ""}>
          {formatCurrency(remaining)}
        </h2>
        <div className="summary-foot">
          <span className="summary-muted">
            {budget > 0
              ? `${Math.round((total / budget) * 100)}% of budget used`
              : "Set a monthly budget"}
          </span>
        </div>
      </article>

      <article className="summary-card">
        <div className="summary-card-top">
          <span>Transactions</span>
          <div className="summary-icon blue-icon"><ReceiptText size={19} /></div>
        </div>
        <h2>{count}</h2>
        <div className="summary-foot">
          <span className="summary-muted">For this month</span>
        </div>
      </article>
    </div>
  );
}
