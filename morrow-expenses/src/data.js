
export const categories = [
  { name: "Food & Drinks", color: "#788766", icon: "utensils" },
  { name: "Transport", color: "#B69B7B", icon: "car-front" },
  { name: "Shopping", color: "#C48F80", icon: "shopping-bag" },
  { name: "Bills", color: "#8A8CBA", icon: "receipt" },
  { name: "Health", color: "#85A9A0", icon: "heart-pulse" },
  { name: "Entertainment", color: "#C6AA63", icon: "ticket" },
  { name: "Other", color: "#A4A196", icon: "ellipsis" },
];

const now = new Date();
const currentMonth = now.getMonth();
const currentYear = now.getFullYear();

function dateInCurrentMonth(day) {
  const date = new Date(currentYear, currentMonth, day);
  return date.toISOString().slice(0, 10);
}

export const initialExpenses = [
  {
    id: "demo-1",
    title: "Coffee & breakfast",
    category: "Food & Drinks",
    amount: 1250,
    date: dateInCurrentMonth(2),
    note: "",
  },
  {
    id: "demo-2",
    title: "Ride to work",
    category: "Transport",
    amount: 850,
    date: dateInCurrentMonth(4),
    note: "",
  },
  {
    id: "demo-3",
    title: "Weekly groceries",
    category: "Food & Drinks",
    amount: 4750,
    date: dateInCurrentMonth(7),
    note: "",
  },
  {
    id: "demo-4",
    title: "New headphones",
    category: "Shopping",
    amount: 6800,
    date: dateInCurrentMonth(10),
    note: "",
  },
  {
    id: "demo-5",
    title: "Internet bill",
    category: "Bills",
    amount: 3900,
    date: dateInCurrentMonth(12),
    note: "",
  },
  {
    id: "demo-6",
    title: "Lunch with friends",
    category: "Food & Drinks",
    amount: 2200,
    date: dateInCurrentMonth(15),
    note: "",
  },
  {
    id: "demo-7",
    title: "Bus fare",
    category: "Transport",
    amount: 450,
    date: dateInCurrentMonth(18),
    note: "",
  },
  {
    id: "demo-8",
    title: "Movie night",
    category: "Entertainment",
    amount: 1800,
    date: dateInCurrentMonth(20),
    note: "",
  },
];

export const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(amount);

export function getMonthKey(dateString) {
  return dateString.slice(0, 7);
}
