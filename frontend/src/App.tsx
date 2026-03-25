import { useState } from "react";
import Dashboard from "./components/Dashboard";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [error, setError] = useState("");

  const login = async () => {
    setError("");
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "test@test.com", password: "password" }),
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
      } else {
        setError(data.error || "Connexion échouée");
      }
    } catch {
      setError("Impossible de contacter le serveur");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
  };

  if (!token) {
    return (
      <div style={{ padding: "20px", fontFamily: "Arial" }}>
        <h2>Connexion</h2>
        <button onClick={login}>Se connecter (test@test.com)</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          padding: "8px 20px",
          background: "#f5f5f5",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <button onClick={logout}>Se déconnecter</button>
      </div>
      <Dashboard token={token} />
    </div>
  );
}

export default App;
