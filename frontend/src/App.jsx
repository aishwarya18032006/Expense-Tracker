// src/App.jsx
import { useState } from "react";
import Dashboard from "./components/Dashboard";
import { login as apiLogin, register as apiRegister } from "./services/api";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("login"); // "login" or "register"
  const [error, setError] = useState("");

  const handleLogin = (tok) => {
    setToken(tok);
    localStorage.setItem("token", tok);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
  };

  if (!token) {
    return (
      <div
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "100vh", background: "var(--page-bg)" }}
      >
        <div className="card p-4 shadow" style={{ width: 420 }}>
          {/* TABS */}
          <div className="d-flex mb-3">
            <button
              className={`btn ${
                mode === "login" ? "btn-accent" : "btn-outline-secondary"
              } me-2 flex-grow-1`}
              onClick={() => {
                setMode("login");
                setError("");
              }}
            >
              Login
            </button>

            <button
              className={`btn ${
                mode === "register" ? "btn-accent" : "btn-outline-secondary"
              } flex-grow-1`}
              onClick={() => {
                setMode("register");
                setError("");
              }}
            >
              Register
            </button>
          </div>

          {/* LOGIN FORM */}
          {mode === "login" ? (
            <>
              <h5 className="mb-3 text-center">Welcome back</h5>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setLoading(true);
                  setError("");

                  const identifier = e.target.identifier.value;
                  const password = e.target.password.value;

                  try {
                    const res = await apiLogin(identifier, password);

                    if (res.token) {
                      handleLogin(res.token);
                    } else {
                      setError(res.error || "Invalid login credentials");
                    }
                  } catch (err) {
                    console.error(err);
                    setError("Network error");
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                <div className="mb-2">
                  <input
                    name="identifier"
                    className="form-control"
                    placeholder="Email or Username"
                    aria-label="Email or Username"
                    required
                  />
                </div>

                <div className="mb-3">
                  <input
                    name="password"
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    aria-label="Password"
                    required
                  />
                </div>

                {error && (
                  <div className="alert alert-danger py-2 small">{error}</div>
                )}

                <div className="d-grid mb-2">
                  <button className="btn btn-accent" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                  </button>
                </div>
              </form>
            </>
          ) : (
            /* REGISTER FORM */
            <>
              <h5 className="mb-3 text-center">Create an account</h5>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setLoading(true);
                  setError("");

                  const name = e.target.name.value;
                  const email = e.target.email.value;
                  const password = e.target.password.value;

                  try {
                    const res = await apiRegister({ name, email, password });

                    if (res.token) {
                      handleLogin(res.token);
                    } else if (res.error) {
                      setError(res.error);
                    } else {
                      alert("Registered successfully. Please login.");
                      setMode("login");
                    }
                  } catch (err) {
                    console.error(err);
                    setError("Registration error");
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                <div className="mb-2">
                  <input
                    name="name"
                    className="form-control"
                    placeholder="Full Name"
                    aria-label="Full Name"
                    required
                  />
                </div>

                <div className="mb-2">
                  <input
                    name="email"
                    className="form-control"
                    placeholder="Username or Email"
                    aria-label="Username or Email"
                    required
                  />
                </div>

                <div className="mb-3">
                  <input
                    name="password"
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    aria-label="Password"
                    required
                  />
                </div>

                {error && (
                  <div className="alert alert-danger py-2 small">{error}</div>
                )}

                <div className="d-grid mb-2">
                  <button className="btn btn-accent" disabled={loading}>
                    {loading ? "Registering..." : "Register"}
                  </button>
                </div>
              </form>

              <div className="text-center small text-muted">
                Register once, then login normally.
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return <Dashboard token={token} onLogout={logout} />;
}
