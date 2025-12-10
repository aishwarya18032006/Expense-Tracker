// frontend/src/services/api.js
const API_BASE = "http://localhost:4000/api";

export async function register(payload) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  return res.json();
}

export async function login(email, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  return res.json();
}

export async function fetchTransactions(token) {
  const res = await fetch(`${API_BASE}/transactions`, {
    headers: { Authorization: token }
  });
  return res.json();
}

export async function addTransaction(token, payload) {
  const res = await fetch(`${API_BASE}/transactions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: token },
    body: JSON.stringify(payload)
  });
  return res.json();
}

export async function deleteTransaction(token, id) {
  const res = await fetch(`${API_BASE}/transactions/${id}`, {
    method: "DELETE",
    headers: { Authorization: token }
  });
  return res.json();
}

// NEW: salary endpoints
export async function getSalary(token) {
  const res = await fetch(`${API_BASE}/users/salary`, {
    headers: { Authorization: token }
  });
  return res.json();
}

export async function setSalary(token, salary) {
  const res = await fetch(`${API_BASE}/users/salary`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: token },
    body: JSON.stringify({ salary })
  });
  return res.json();
}

// NEW: get profile
export async function getProfile(token) {
  const res = await fetch(`${API_BASE}/users/me`, {
    headers: { Authorization: token }
  });
  return res.json();
}
