import Game from "./pages/Game";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Navbar from "./pages/Navbar";
import "./App.css";
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from "react-router";

const query_client = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={query_client}>
            <BrowserRouter>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Game />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    );
}

export default App;
