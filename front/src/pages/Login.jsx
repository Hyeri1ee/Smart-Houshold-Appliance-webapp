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
    <div style={styles.container}>
      <h1>Welcome!</h1>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputFieldsContainer}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            style={styles.input}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            style={styles.input}
          />
        </div>
        <div className="auth-options" style={styles.authOptions}>
          <Button type="submit">Login</Button>
          <p>Not a user? <a href="/register">Register</a></p>
        </div>
      </form>
    </div>
  );
}

const styles = {
  container: {
    paddingTop: "70px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    maxWidth: "500px",
    fontFamily: "Arial, sans-serif",
    height: "100vh",
    width: "100vw",
    boxSizing: "border-box",
  },
  form: {
    borderRadius: "4px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    height: "90%",
    width: "90%"
  },
  inputFieldsContainer: {
    borderRadius: "4px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    height: "50%",
  },
  input: {
    width: "100%",
    height: "24%",
    padding: "5px",
    margin: "8px auto",
    backgroundColor: "white",
    border: "2px solid var(--primary-color)",
    borderRadius: "4px",
    color: "black"
  },
  authOptions: {
    borderRadius: "4px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "22%",
    textAlign: "center"
  }
}

export default LoginPage;