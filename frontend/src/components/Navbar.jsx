import React from "react";

export default function Navbar({ user, onLogout }) {
  return (
    <nav className="bg-white shadow p-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-2xl font-bold text-indigo-600">ExTrack</div>
          <div className="text-sm text-gray-500">Expense Tracker</div>
        </div>
        <div className="flex items-center gap-3">
          {user ? <div className="text-sm text-gray-700">Hi, {user.name || user.email}</div> : null}
          <button onClick={onLogout} className="bg-red-500 text-white px-3 py-1 rounded">Logout</button>
        </div>
      </div>
    </nav>
  );
}
