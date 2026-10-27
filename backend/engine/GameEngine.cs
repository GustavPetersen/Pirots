namespace backend.engine;

using backend.engine.domain;
using backend.engine.config;

public class GameEngine
{
    public static SpinResult Spin(int bet)
    {
        Random random = new Random();
        Symbol[][] board = new Symbol[GameConfig.xDim][];
        Color[] colors = Enum.GetValues<Color>();

        // Initalize jagged array
        for (int x = 0; x < GameConfig.xDim; x++)
        {
            board[x] = new Symbol[GameConfig.yDim];
            Array.Fill(board[x], Empty.Instance);
        }

        // Fill the board with diamonds
        for (int x = 0; x < GameConfig.xDim; x++)
        {
            for (int y = 0; y < GameConfig.yDim; y++)
            {
                board[x][y] = new Diamond(colors[random.Next(colors.Length)], 1);
            }
        }

        // Place prisoners
        Dictionary<Color, Position> pLocations = [];
        foreach (Color color in colors)
        {
            Position pos;
            do pos = new(random.Next(GameConfig.xDim), random.Next(GameConfig.yDim));
            while (pLocations.ContainsValue(pos));

            pLocations.Add(color, pos);
            board[pos.X][pos.Y] = new Prisoner(color);
        }

        Symbol[][] initialBoard = [.. board.Select(inner => inner.ToArray())];

        // Walk prisoners
        List<List<Position>> movements = [];
        foreach (Color color in colors)
        {
            movements.Add(WalkPrisoner(board, color, pLocations[color]));
        }

        return new SpinResult(initialBoard, movements);
    }

    private static List<Position> WalkPrisoner(Symbol[][] board, Color color, Position start)
    {
        List<Position> path = []; // Could maintain a parallel HashSet for O(1) lookups
        Queue<Position> queue = [];
        path.Add(start);
        queue.Enqueue(start);

        while (queue.Count != 0)
        {
            Position current = queue.Dequeue();
            Position[] adjacent = current.Adjacent(GameConfig.xDim - 1, GameConfig.yDim - 1);

            foreach (Position adj in adjacent)
            {
                if (board[adj.X][adj.Y] is Diamond d
                    && d.Color == color
                    && !path.Contains(adj)) // O(n) lookup, but n is small
                {
                    path.Add(adj);
                    queue.Enqueue(adj);
                    board[current.X][current.Y] = Empty.Instance;
                }
            }
        }

        return path;
    }
}

