import { useState } from "react";
import Button from "../components/generic/Button"

import "../styles/global.css";
import "../styles/auth/auth-page-style.css";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const resp = await fetch('http://localhost:1337/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        password: password,
      })
    });

    if (!resp.ok) {
      console.error("Login failed!");
      return;
    }

    const data = await resp.json();
    document.cookie = `authorization=${data.token}`;
    location.href="/dashboard";
  }

  return (
    <div id="login-page-container">
      <h1>Welcome!</h1>
      <h2>Login</h2>
      <form id="login-form" onSubmit={handleSubmit}>
        <div id="login-inputFieldsContainer">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="login-input"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="login-input"
          />
        </div>
        <div id="login-authOptions">
          <Button type="submit">Login</Button>
          <p>Not a user? <a href="/register">Register</a></p>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;