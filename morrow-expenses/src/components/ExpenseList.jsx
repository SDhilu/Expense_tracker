
import {
  Utensils,
  CarFront,
  ShoppingBag,
  Receipt,
  HeartPulse,
  Ticket,
  Ellipsis,
  Pencil,
  Trash2,
  Search,
} from "lucide-react";
import { categories, formatCurrency } from "../data";

const iconMap = {
  utensils: Utensils,
  "car-front": CarFront,
  "shopping-bag": ShoppingBag,
  receipt: Receipt,
  "heart-pulse": HeartPulse,
  ticket: Ticket,
  ellipsis: Ellipsis,
};

function formatDate(dateString) {
  const date = new Date(`${dateString}T12:00:00`);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function ExpenseList({
  expenses,
  search,
  onSearch,
  categoryFilter,
  onCategoryFilter,
  onEdit,
  onDelete,
  compact = false,
}) {
  return (
    <section className="panel transactions-panel">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">YOUR MONEY TRAIL</span>
          <h2>{compact ? "Recent transactions" : "All transactions"}</h2>
        </div>
        <span className="transaction-count">{expenses.length} entries</span>
      </div>

      <div className="transaction-filters">
        <label className="transaction-search">
          <Search size={16} />
          <input
            value={search}
            onChange={(event) => onSearch(event.target.value)}
            placeholder="Search expenses..."
            aria-label="Search transactions"
          />
        </label>

        <select
          value={categoryFilter}
          onChange={(event) => onCategoryFilter(event.target.value)}
          aria-label="Filter by category"
          className="category-filter"
        >
          <option value="All">All categories</option>
          {categories.map((category) => (
            <option key={category.name} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {expenses.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><Receipt size={25} /></div>
          <h3>Nothing here just yet</h3>
          <p>Try another filter or add a new expense.</p>
        </div>
      ) : (
        <div className="transaction-table-wrap">
          <table className="transaction-table">
            <thead>
              <tr>
                <th>EXPENSE</th>
                <th>CATEGORY</th>
                <th>DATE</th>
                <th className="amount-column">AMOUNT</th>
                <th><span className="visually-hidden">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => {
                const category = categories.find(
                  (item) => item.name === expense.category
                ) || categories[categories.length - 1];

                const Icon = iconMap[category.icon] || Ellipsis;

                return (
                  <tr key={expense.id}>
                    <td>
                      <div className="expense-title-cell">
                        <div
                          className="category-icon"
                          style={{
                            backgroundColor: `${category.color}22`,
                            color: category.color,
                          }}
                        >
                          <Icon size={17} />
                        </div>
                        <div className="expense-title-text">
                          <strong>{expense.title}</strong>
                          {expense.note && <span>{expense.note}</span>}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="category-label">
                        <span style={{ backgroundColor: category.color }} />
                        {expense.category}
                      </span>
                    </td>
                    <td className="date-cell">{formatDate(expense.date)}</td>
                    <td className="amount-cell">{formatCurrency(expense.amount)}</td>
                    <td>
                      <div className="row-actions">
                        <button
                          onClick={() => onEdit(expense)}
                          aria-label={`Edit ${expense.title}`}
                          title="Edit expense"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => onDelete(expense.id)}
                          aria-label={`Delete ${expense.title}`}
                          title="Delete expense"
                          className="delete-action"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
