import React from "react";
import { Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  ArcElement,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, ArcElement, Legend);

export function IncomeExpensePie({ transactions = [] }) {
  const income = transactions.filter(t => t.amount > 0).reduce((a,t)=>a + Number(t.amount), 0);
  const expense = Math.abs(transactions.filter(t => t.amount < 0).reduce((a,t)=>a + Number(t.amount), 0));
  const data = {
    labels: ['Income','Expense'],
    datasets: [{ data: [income || 0, expense || 0], backgroundColor: ['#16a34a','#ef4444'] }]
  };
  return (
    <div className="app-card">
      <h6 className="mb-3">Income vs Expense</h6>
      <Pie data={data} />
    </div>
  );
}

export function TrendLine({ transactions = [] }) {
  const last = transactions.slice(0, 14).reverse();
  const labels = last.map(t=>new Date(t.date).toLocaleDateString());
  const amounts = last.map(t=>Number(t.amount));
  const data = { labels, datasets:[{ label:'Amount', data:amounts, borderColor:'#4f46e5', fill:false }] };
  const options = { plugins:{ legend:{ display:false } }, scales:{ y:{ beginAtZero:true } } };
  return (
    <div className="app-card">
      <h6 className="mb-3">Recent Trend</h6>
      <Line data={data} options={options} />
    </div>
  );
}
