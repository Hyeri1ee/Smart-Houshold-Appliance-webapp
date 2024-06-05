import React, { useState } from "react";

import "../styles/global.css";
import "../styles/auth/auth-page-style.css";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const resp = await fetch('http://localhost:1337/api/login', {
      method: 'POST',
      credentials: 'include',
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
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="auth-options">
          <button type="submit">Login</button>
          <p>Not a user? <a href="/register">Register</a></p>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
