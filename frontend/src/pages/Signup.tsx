import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { signup } from "../api/queries";

function Signup() {
    const navigate = useNavigate();
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError(null);
        try {
            await signup(userName, password);
            navigate("/login");
        } catch {
            setError("Signup failed");
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <h1>Signup</h1>
            <input placeholder="Username" value={userName} onChange={(e) => setUserName(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="submit">Signup</button>
            {error && <p>{error}</p>}
        </form>
    );
}

export default Signup;
