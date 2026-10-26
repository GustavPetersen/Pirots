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
        for (int i = 0; i < colors.Length; i++)
        {
            Color color = colors[i];
            Queue<Position> queue = [];
            HashSet<Position> visited = [];

            queue.Enqueue(pLocations[color]);
            movements.Add([pLocations[color]]);
            visited.Add(pLocations[color]);

            while (queue.Count != 0)
            {
                Position current = queue.Dequeue();
                Position[] adjacent = current.Adjacent(GameConfig.xDim - 1, GameConfig.yDim - 1);

                foreach (Position adj in adjacent)
                {
                    if (board[adj.X][adj.Y] is Diamond d
                        && d.Color == color
                        && !visited.Contains(adj))
                    {
                        queue.Enqueue(adj);
                        movements[i].Add(adj);
                        visited.Add(adj);
                        board[current.X][current.Y] = new Empty();
                    }
                }
            }
        }

        return new SpinResult(initialBoard, movements);
    }
}