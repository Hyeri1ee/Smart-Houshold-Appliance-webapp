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
        <div id="register-page-container">
            <h1>Welcome!</h1>
            <h2>Register</h2>
            <form onSubmit={handleSubmit} id="register-form">
                <div id="register-inputFieldsContainer">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        className="register-input"
                    />
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="First Name"
                        className="register-input"
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="register-input"
                    />
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm Password"
                        className="register-input"
                    />
                </div>
                <div id="register-auth-options">
                    <Button type="submit">Register</Button>
                    <p>Already a user? <a href="/login">Log in</a></p>
                </div>
            </form>
        </div>
    );
}

export default RegisterPage;