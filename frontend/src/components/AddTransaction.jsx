import React, { useState } from "react";
import { addTransaction } from "../services/api";

export default function AddTransaction({ token, onAdded }) {
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await addTransaction(token, { description: desc, amount: Number(amount) });
      setDesc("");
      setAmount("");
      onAdded();
    } catch (err) {
      console.error(err);
      alert("Failed to add transaction");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-card fade-in">
      <h5 className="mb-3">Add Transaction</h5>
      <form onSubmit={submit}>
        <div className="mb-2">
          <input className="form-control" placeholder="Description" value={desc} onChange={(e)=>setDesc(e.target.value)} required />
        </div>
        <div className="mb-3">
          <input className="form-control" placeholder="Amount (use negative for expense)" type="number" value={amount} onChange={(e)=>setAmount(e.target.value)} required />
        </div>
        <div className="d-grid">
          <button className="btn btn-accent" type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Transaction"}
          </button>
        </div>
      </form>
    </div>
  );
}
