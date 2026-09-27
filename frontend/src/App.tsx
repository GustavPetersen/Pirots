import Game from "./pages/Game";
import "./App.css";
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

const query_client = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={query_client}>
            <Game />
        </QueryClientProvider>
    );
}

export default App;
