import { useState } from "react";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
  };

  if (!token) {
    return <Login onLogin={setToken} />;
  }

  return <Dashboard token={token} onLogout={logout} />;
}

export default App;
