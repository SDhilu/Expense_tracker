
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { categories, formatCurrency } from "../data";

function shortCurrency(value) {
  if (value >= 1000000) return `LKR ${(value / 1000000).toFixed(1)}m`;
  if (value >= 1000) return `LKR ${(value / 1000).toFixed(0)}k`;
  return `LKR ${value}`;
}

export function MonthlyChart({ expenses, selectedMonth }) {
  const [year, month] = selectedMonth.split("-").map(Number);
  const daysInMonth = new Date(year, month, 0).getDate();
  const today = new Date();
  const isCurrentMonth =
    today.getFullYear() === year && today.getMonth() + 1 === month;

  const lastDay = isCurrentMonth ? today.getDate() : daysInMonth;

  const data = Array.from({ length: daysInMonth }, (_, index) => ({
    day: index + 1,
    amount: 0,
  }));

  expenses.forEach((expense) => {
    if (expense.date.startsWith(selectedMonth)) {
      const day = Number(expense.date.slice(8, 10));
      if (data[day - 1]) data[day - 1].amount += expense.amount;
    }
  });

  const tickInterval = daysInMonth > 20 ? 4 : daysInMonth > 12 ? 2 : 0;

  return (
    <section className="panel chart-panel">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">YOUR DAILY RHYTHM</span>
          <h2>Spending activity</h2>
        </div>
        <span className="chart-period">{selectedMonth}</span>
      </div>

      <div className="chart-legend">
        <span className="legend-dot" />
        Daily spending
      </div>

      <div className="main-chart">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="#EAE8DF" strokeDasharray="3 3" />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              interval={tickInterval}
              tick={{ fill: "#929286", fontSize: 10 }}
              tickFormatter={(value) => `${value}`}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={75}
              tick={{ fill: "#929286", fontSize: 10 }}
              tickFormatter={shortCurrency}
            />
            <Tooltip
              cursor={{ fill: "#EEF0E8" }}
              formatter={(value) => [formatCurrency(value), "Spent"]}
              labelFormatter={(day) => `Day ${day}`}
              contentStyle={{
                border: "1px solid #E2E0D7",
                borderRadius: 10,
                fontSize: 12,
                background: "#FFF",
              }}
            />
            <Bar
              dataKey="amount"
              fill="#788766"
              radius={[4, 4, 0, 0]}
              maxBarSize={24}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export function CategoryBreakdown({ expenses }) {
  const totals = categories
    .map((category) => ({
      ...category,
      amount: expenses
        .filter((expense) => expense.category === category.name)
        .reduce((sum, expense) => sum + expense.amount, 0),
    }))
    .filter((category) => category.amount > 0)
    .sort((a, b) => b.amount - a.amount);

  const total = totals.reduce((sum, item) => sum + item.amount, 0);

  return (
    <section className="panel category-panel">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">WHERE IT GOES</span>
          <h2>By category</h2>
        </div>
      </div>

      {total === 0 ? (
        <div className="empty-chart">Your category breakdown will appear here.</div>
      ) : (
        <>
          <div className="donut-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={totals}
                  dataKey="amount"
                  nameKey="name"
                  innerRadius="67%"
                  outerRadius="90%"
                  paddingAngle={3}
                  stroke="none"
                >
                  {totals.map((item) => (
                    <Cell key={item.name} fill={item.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>

            <div className="donut-center">
              <span>TOTAL</span>
              <strong>{shortCurrency(total)}</strong>
            </div>
          </div>

          <div className="category-breakdown-list">
            {totals.map((item) => (
              <div className="breakdown-item" key={item.name}>
                <div className="breakdown-label">
                  <span
                    className="breakdown-dot"
                    style={{ backgroundColor: item.color }}
                  />
                  <span>{item.name}</span>
                </div>
                <div className="breakdown-amount">
                  <strong>{formatCurrency(item.amount)}</strong>
                  <span>{Math.round((item.amount / total) * 100)}%</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
