import { Link } from "react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getMe, logout } from "../api/auth";

function Navbar() {
    const queryClient = useQueryClient();
    const result = useQuery({ queryKey: ["getMe"], queryFn: getMe });

    const balance: number | null = result.data?.balance ?? null;
    const userName: string | null = result.data?.userName ?? null;

    async function handleLogout() {
        await logout();
        await queryClient.invalidateQueries({ queryKey: ["getMe"] });
    }

    return (
        <nav>
            <Link to="/">Game</Link>{" | "}
            {userName ? (
                <>
                    <span>Logged in as {userName} | Balance: {balance} </span>{" "}
                    <button onClick={handleLogout}>Logout</button>
                </>
            ) : (
                <>
                    <Link to="/login">Login</Link>{" | "}
                    <Link to="/signup">Signup</Link>
                </>
            )}
        </nav>
    );
}

export default Navbar;
