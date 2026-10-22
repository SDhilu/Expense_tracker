
import { useMemo, useState } from "react";
import {
  Plus,
  CalendarDays,
  ChevronDown,
  Menu,
  Download,
  Wallet,
  X,
} from "lucide-react";

import Sidebar from "./components/Sidebar";
import SummaryCards from "./components/SummaryCards";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import { MonthlyChart, CategoryBreakdown } from "./components/SpendingChart";

import useLocalStorage from "./useLocalStorage";
import { initialExpenses, getMonthKey, formatCurrency } from "./data";
import "./index.css";

function currentMonthKey() {
  return new Date().toLocaleDateString("en-CA").slice(0, 7);
}

function App() {
  const [expenses, setExpenses] = useLocalStorage(
    "morrow-expenses-v1",
    initialExpenses
  );

  const [budget, setBudget] = useLocalStorage("morrow-budget-v1", 100000);
  const [selectedMonth, setSelectedMonth] = useState(currentMonthKey());
  const [activePage, setActivePage] = useState("overview");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [budgetInput, setBudgetInput] = useState(String(budget));
  const [toast, setToast] = useState("");

  const monthExpenses = useMemo(
    () => expenses.filter((item) => getMonthKey(item.date) === selectedMonth),
    [expenses, selectedMonth]
  );

  const total = monthExpenses.reduce((sum, item) => sum + item.amount, 0);

  const previousMonth = useMemo(() => {
    const [year, month] = selectedMonth.split("-").map(Number);
    const date = new Date(year, month - 2, 1);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
  }, [selectedMonth]);

  const previousTotal = expenses
    .filter((item) => getMonthKey(item.date) === previousMonth)
    .reduce((sum, item) => sum + item.amount, 0);

  const visibleExpenses = useMemo(() => {
    return [...monthExpenses]
      .filter((item) => {
        const matchesSearch =
          item.title.toLowerCase().includes(search.toLowerCase()) ||
          (item.note || "").toLowerCase().includes(search.toLowerCase());

        const matchesCategory =
          categoryFilter === "All" || item.category === categoryFilter;

        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [monthExpenses, search, categoryFilter]);

  function showToast(message) {
    setToast(message);
  }

  function openAddForm() {
    setEditingExpense(null);
    setModalOpen(true);
  }

  function openEditForm(expense) {
    setEditingExpense(expense);
    setModalOpen(true);
  }

  function saveExpense(formData) {
    if (editingExpense) {
      setExpenses((current) =>
        current.map((item) =>
          item.id === editingExpense.id
            ? { ...item, ...formData, id: editingExpense.id }
            : item
        )
      );
      showToast("Expense updated successfully.");
    } else {
      const newExpense = {
        ...formData,
        id: crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random()}`,
      };

      setExpenses((current) => [...current, newExpense]);
      showToast("Expense added successfully.");
    }

    setModalOpen(false);
    setEditingExpense(null);
  }

  function deleteExpense(id) {
    const expense = expenses.find((item) => item.id === id);
    if (!expense) return;

    if (!window.confirm(`Delete "${expense.title}"? This cannot be undone.`)) {
      return;
    }

    setExpenses((current) => current.filter((item) => item.id !== id));
    showToast("Expense deleted.");
  }

  function navigate(page) {
    setActivePage(page);
    setSidebarOpen(false);
    setSearch("");
    setCategoryFilter("All");
  }

  function saveBudget(event) {
    event.preventDefault();
    const value = Number(budgetInput);

    if (!Number.isFinite(value) || value <= 0) {
      showToast("Enter a budget greater than zero.");
      return;
    }

    setBudget(value);
    showToast("Monthly budget saved.");
  }

  function exportCSV() {
    const headers = ["Date", "Expense", "Category", "Amount (LKR)", "Note"];
    const rows = visibleExpenses.map((item) => [
      item.date,
      item.title,
      item.category,
      item.amount,
      item.note || "",
    ]);

    const escapeCSV = (value) =>
      `"${String(value).replace(/"/g, '""')}"`;

    const csv = [headers, ...rows]
      .map((row) => row.map(escapeCSV).join(","))
      .join("\r\n");

    const blob = new Blob(["\uFEFF", csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `morrow-expenses-${selectedMonth}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    showToast("CSV export downloaded.");
  }

  const monthLabel = new Date(
    Number(selectedMonth.slice(0, 4)),
    Number(selectedMonth.slice(5, 7)) - 1,
    1
  ).toLocaleDateString("en", { month: "long", year: "numeric" });

  const pageTitles = {
    overview: "Your overview",
    transactions: "Your transactions",
    insights: "Spending insights",
    budget: "Your monthly budget",
  };

  return (
    <div className="app-layout">
      <Sidebar
        activePage={activePage}
        onNavigate={navigate}
        budget={budget}
        spent={total}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="mobile-menu-toggle"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation"
            >
              <Menu size={21} />
            </button>

            <div>
              <span className="topbar-breadcrumb">PERSONAL FINANCE / 2026</span>
              <h1>{pageTitles[activePage]}</h1>
            </div>
          </div>

          <div className="topbar-actions">
            <label className="month-picker">
              <CalendarDays size={17} />
              <input
                type="month"
                value={selectedMonth}
                onChange={(event) => {
                  if (event.target.value) {
                    setSelectedMonth(event.target.value);
                  }
                }}
                aria-label="Select month"
              />
              <ChevronDown size={14} />
            </label>

            <button className="primary-button add-expense-button" onClick={openAddForm}>
              <Plus size={17} />
              <span>Add expense</span>
            </button>
          </div>
        </header>

        <div className="dashboard-content">
          {activePage === "budget" ? (
            <section className="panel budget-settings-panel">
              <span className="eyebrow">PLAN WITH INTENTION</span>
              <h2>Set your monthly budget</h2>
              <p className="settings-description">
                Give your spending a gentle boundary. You can update this amount
                whenever your plans change.
              </p>

              <form onSubmit={saveBudget} className="budget-settings-form">
                <label className="form-label">
                  Monthly budget (LKR)
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={budgetInput}
                    onChange={(event) => setBudgetInput(event.target.value)}
                    required
                  />
                </label>
                <button type="submit" className="primary-button">
                  Save budget
                </button>
              </form>

              <div className="budget-overview">
                <div className="budget-overview-top">
                  <span>Spent this month</span>
                  <strong>{formatCurrency(total)}</strong>
                </div>
                <div className="large-progress-track">
                  <div
                    className={`large-progress-fill ${
                      total > budget ? "over-budget" : ""
                    }`}
                    style={{
                      width: `${budget > 0 ? Math.min((total / budget) * 100, 100) : 0}%`,
                    }}
                  />
                </div>
                <p>
                  {total > budget
                    ? `You're ${formatCurrency(total - budget)} over your budget.`
                    : `${formatCurrency(budget - total)} left for ${monthLabel}.`}
                </p>
              </div>
            </section>
          ) : (
            <>
              <section className="welcome-strip">
                <div>
                  <span className="eyebrow">A FRESH LOOK AT YOUR MONEY</span>
                  <h2>
                    Small choices,
                    <br />
                    <span>more peace of mind.</span>
                  </h2>
                  <p>
                    Here is how your finances are looking for {monthLabel}.
                  </p>
                </div>
                <div className="welcome-illustration" aria-hidden="true">
                  <div className="welcome-circle">
                    <Wallet size={31} strokeWidth={1.4} />
                  </div>
                  <span className="welcome-spark">✳</span>
                  <span className="welcome-leaf">⌁</span>
                </div>
              </section>

              <SummaryCards
                total={total}
                budget={budget}
                count={monthExpenses.length}
                previousTotal={previousTotal}
              />

              {(activePage === "overview" || activePage === "insights") && (
                <div className="analytics-grid">
                  <MonthlyChart
                    expenses={monthExpenses}
                    selectedMonth={selectedMonth}
                  />
                  <CategoryBreakdown expenses={monthExpenses} />
                </div>
              )}

              <ExpenseList
                expenses={
                  activePage === "overview"
                    ? visibleExpenses.slice(0, 5)
                    : visibleExpenses
                }
                search={search}
                onSearch={setSearch}
                categoryFilter={categoryFilter}
                onCategoryFilter={setCategoryFilter}
                onEdit={openEditForm}
                onDelete={deleteExpense}
                compact={activePage === "overview"}
              />

              <div className="table-footer">
                <span>
                  Showing {Math.min(visibleExpenses.length, activePage === "overview" ? 5 : Infinity)} of{" "}
                  {visibleExpenses.length} matching transactions
                </span>
                <button className="text-button" onClick={exportCSV}>
                  <Download size={15} /> Export CSV
                </button>
              </div>
            </>
          )}
        </div>

        <footer className="app-footer">
          <span>morrow. © {new Date().getFullYear()}</span>
          <span>Less noise. More intention.</span>
          <button
            className="footer-reset"
            onClick={() => {
              if (
                window.confirm(
                  "Reset all expenses and budget to the original demo data?"
                )
              ) {
                setExpenses(initialExpenses);
                setBudget(100000);
                setBudgetInput("100000");
                showToast("Demo data restored.");
              }
            }}
          >
            Reset demo data
          </button>
        </footer>
      </main>

      {modalOpen && (
        <ExpenseForm
          expense={editingExpense}
          onSave={saveExpense}
          onClose={() => {
            setModalOpen(false);
            setEditingExpense(null);
          }}
        />
      )}

      {toast && (
        <div className="toast-message" role="status">
          <span>{toast}</span>
          <button onClick={() => setToast("")} aria-label="Dismiss notification">
            <X size={15} />
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
