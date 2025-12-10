// frontend/src/components/Dashboard.jsx
import React, { useEffect, useState } from "react";
import AddTransaction from "./AddTransaction";
import History from "./History";
import { IncomeExpensePie, TrendLine } from "./Charts";
import { fetchTransactions, deleteTransaction } from "../services/api";

export default function Dashboard({ token, onLogout }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("theme") || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    } catch { return 'light'; }
  });

  // Apply theme on mount and when changes
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    try { localStorage.setItem('theme', theme); } catch {}
  }, [theme]);

  async function load() {
    setLoading(true);
    try {
      const tx = await fetchTransactions(token);
      setTransactions(tx || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (token) load();
    // eslint-disable-next-line
  }, [token]);

  async function handleDelete(id) {
    await deleteTransaction(token, id);
    load();
  }

  // sums
  const total = transactions.reduce((a,t)=>a + Number(t.amount || 0), 0).toFixed(2);
  const income = transactions.filter(t=>t.amount>0).reduce((a,t)=>a + Number(t.amount),0).toFixed(2);
  const expense = Math.abs(transactions.filter(t=>t.amount<0).reduce((a,t)=>a + Number(t.amount),0)).toFixed(2);

  // toggle helper
  function toggleTheme() {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  }

  return (
    <div className="container py-4">
      {/* HEADER */}
      <div className="app-header mb-4">
        <div>
          <h2 className="mb-0">ExTrack</h2>
          <div className="text-muted small">Smart Expense Tracker</div>
        </div>

        <div className="d-flex align-items-center gap-3">
          {/* Balance */}
          <div className="text-end me-3">
            <div className="kpi-label">Balance</div>
            <div className="kpi-value">₹{total}</div>
          </div>

          {/* Theme toggle (near balance) */}
          <div className="theme-toggle me-2">
            {/* Label optional on larger screens */}
            <div className="d-none d-md-inline small text-muted me-2">
              {theme === 'dark' ? 'Dark' : 'Light'}
            </div>

            <button
              className="btn btn-outline-secondary"
              title="Toggle theme"
              onClick={toggleTheme}
              aria-pressed={theme === 'dark'}
            >
              {/* simple icons: sun / moon */}
              {theme === 'dark' ? (
                <svg className="icon-moon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
              ) : (
                <svg className="icon-sun" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6.76 4.84l-1.8-1.79L3.17 4.84 4.97 6.63 6.76 4.84zm10.48 0l1.8-1.79 1.79 1.79-1.8 1.79-1.79-1.79zM12 4V1h0v3zm0 19v-3h0v3zM4 12H1v0h3zm19 0h3v0h-3zM6.76 19.16l-1.79 1.79 1.79-1.79 1.79-1.79-1.79 1.79zM17.24 19.16l1.79 1.79 1.79-1.79-1.79-1.79-1.79 1.79zM12 8a4 4 0 100 8 4 4 0 000-8z"/></svg>
              )}
            </button>
          </div>

          <button className="btn btn-outline-secondary" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="row g-4">
        {/* LEFT */}
        <div className="col-lg-8">
          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <div className="app-card">
                <div className="d-flex justify-content-between">
                  <div>
                    <div className="kpi-label">Income</div>
                    <div className="kpi-value text-success">+₹{income}</div>
                  </div>

                  <div>
                    <div className="kpi-label">Expenses</div>
                    <div className="kpi-value text-danger">-₹{expense}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="app-card">
                <h6 className="mb-0">Monthly Overview</h6>
                <div className="text-muted small">Summary & insights</div>
              </div>
            </div>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-md-6"><IncomeExpensePie transactions={transactions} /></div>
            <div className="col-md-6"><TrendLine transactions={transactions} /></div>
          </div>

          <History transactions={transactions} onDelete={handleDelete} />
        </div>

        {/* RIGHT */}
        <div className="col-lg-4">
          <AddTransaction token={token} onAdded={load} />

          <div className="app-card mt-3">
            <h6 className="mb-3">Quick Actions</h6>
            <div className="d-grid">
              <button className="btn btn-accent mb-2" onClick={load}>Refresh</button>
              <button className="btn btn-outline-secondary" onClick={()=>window.print()}>Print Report</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
