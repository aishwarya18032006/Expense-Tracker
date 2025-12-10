import React from "react";

export default function History({ transactions = [], onDelete }) {
  return (
    <div className="app-card fade-in">
      <h5 className="mb-3">Recent Activity</h5>
      <div>
        {transactions.length === 0 && <div className="text-muted">No transactions yet</div>}
        {transactions.map(t => (
          <div key={t.id} className="activity-item bg-white border mb-2">
            <div>
              <div className="fw-semibold">{t.description}</div>
              <div className="text-muted small">{new Date(t.date).toLocaleString()}</div>
            </div>
            <div className="text-end d-flex align-items-center gap-2">
              <div className={t.amount < 0 ? "text-danger" : "text-success"}>
                {t.amount < 0 ? "-" : "+"}₹{Math.abs(t.amount)}
              </div>
              <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(t.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
