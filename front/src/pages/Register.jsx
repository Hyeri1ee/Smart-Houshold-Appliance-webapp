import { useState } from "react";
import Button from "../components/generic/Button";

import "../styles/global.css";
import "../styles/auth/auth-page-style.css";

function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [firstName, setFirstName] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        const resp = await fetch('http://localhost:1337/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                first_name: firstName,
                email: email,
                password: password,
                password_confirmation: confirmPassword
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
        <div style = {styles.container} >
            <h2>Register</h2>
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
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="First Name"
                        style={styles.input}
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        style={styles.input}
                    />
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm Password"
                        style={styles.input}
                    />
                </div>
                <div className="auth-options" style={styles.authOptions}>
                    <Button type="submit">Register</Button>
                    <p>Already a user? <a href="/login">Log in</a></p>
                </div>
            </form>
        </div>
    );
}

const styles = {
    container: {
        paddingTop: "90px",
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
        justifyContent: "space-evenly",
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
        height: "20%",
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
        height: "23%",
        textAlign: "center"
    }
}

export default RegisterPage;
