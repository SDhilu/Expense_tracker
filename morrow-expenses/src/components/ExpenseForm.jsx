
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { categories } from "../data";

const today = () => new Date().toLocaleDateString("en-CA");

const emptyForm = () => ({
  title: "",
  amount: "",
  category: "Food & Drinks",
  date: today(),
  note: "",
});

export default function ExpenseForm({ expense, onSave, onClose }) {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  useEffect(() => {
    if (expense) {
      setForm({
        ...expense,
        amount: String(expense.amount),
      });
    } else {
      setForm(emptyForm());
    }
    setError("");
  }, [expense]);

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const amount = Number(form.amount);

    if (!form.title.trim()) {
      setError("Please enter an expense name.");
      return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Enter an amount greater than zero.");
      return;
    }

    if (!form.date) {
      setError("Please select a date.");
      return;
    }

    onSave({
      ...form,
      title: form.title.trim(),
      amount,
      id: expense?.id,
    });
  }

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <section
        className="expense-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="expense-form-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal-heading">
          <div>
            <span className="eyebrow">YOUR MONEY, YOUR WAY</span>
            <h2 id="expense-form-title">
              {expense ? "Edit expense" : "Add an expense"}
            </h2>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Close form">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="form-label">
            Expense name
            <input
              autoFocus
              value={form.title}
              onChange={(event) => update("title", event.target.value)}
              placeholder="e.g. Lunch with friends"
              maxLength={100}
              required
            />
          </label>

          <label className="form-label amount-field">
            Amount (LKR)
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={form.amount}
              onChange={(event) => update("amount", event.target.value)}
              placeholder="0.00"
              required
            />
          </label>

          <div className="form-two-columns">
            <label className="form-label">
              Category
              <select
                value={form.category}
                onChange={(event) => update("category", event.target.value)}
              >
                {categories.map((category) => (
                  <option key={category.name} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="form-label">
              Date
              <input
                type="date"
                value={form.date}
                onChange={(event) => update("date", event.target.value)}
                required
              />
            </label>
          </div>

          <label className="form-label">
            Note <span className="optional-label">OPTIONAL</span>
            <textarea
              value={form.note}
              onChange={(event) => update("note", event.target.value)}
              placeholder="Anything worth remembering?"
              rows={3}
              maxLength={300}
            />
          </label>

          {error && <p className="form-error">{error}</p>}

          <div className="modal-actions">
            <button type="button" className="secondary-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="primary-button">
              {expense ? "Save changes" : "Save expense"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
