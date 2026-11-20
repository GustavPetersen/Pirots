import { Link } from "react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getMe, logout } from "../api/auth";

function Navbar() {
    const queryClient = useQueryClient();
    const { data: userName } = useQuery({ queryKey: ["me"], queryFn: getMe });

    async function handleLogout() {
        await logout();
        await queryClient.invalidateQueries({ queryKey: ["me"] });
    }

    return (
        <nav>
            <Link to="/">Game</Link>{" | "}
            {userName ? (
                <>
                    <span>Logged in as {userName}</span>{" "}
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
