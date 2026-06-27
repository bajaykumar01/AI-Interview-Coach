import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {

    console.log("Login component rendered");

    const navigate = useNavigate();   // ✅ HERE

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleLogin() {

        console.log("Inside handleLogin");

        try {

            const formData = new URLSearchParams();

            formData.append("username", email);
            formData.append("password", password);

            console.log("Sending request...");

            const response = await api.post(
                "/login",
                formData,
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }
            );

            console.log(response.data);

            localStorage.setItem(
                "token",
                response.data.access_token
            );

            alert("Login Successful");

            navigate("/dashboard");

        } catch (error) {

            console.log("FULL ERROR:", error);

            if (error.response) {
                console.log(error.response.status);
                console.log(error.response.data);
            } else {
                console.log(error.message);
            }

            alert("Login Failed");
        }
    }

         return (
        <div>

            <h1>AI Interview Coach</h1>

            <h2>Login</h2>

            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <br /><br />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <br /><br />

            <button
                    onClick={() => {
                        console.log("Button Clicked");
                        handleLogin();
                    }}
                >
                    Login
            </button>

        </div>
        );
};


export default Login;