import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { login } from "../api/auth";

function Login() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError(null);
        try {
            await login(userName, password, rememberMe);
            await queryClient.invalidateQueries({ queryKey: ["me"] });
            navigate("/");
        } catch {
            setError("Login failed");
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <h1>Login</h1>
            <input placeholder="Username" value={userName} onChange={(e) => setUserName(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <label>
                <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                Remember me
            </label>
            <button type="submit">Login</button>
            {error && <p>{error}</p>}
        </form>
    );
}

export default Login;
