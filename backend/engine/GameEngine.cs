namespace backend.engine;

using backend.engine.domain;
using backend.engine.config;
using System.Diagnostics;

public class GameEngine
{
    public static SpinResult Spin(int bet)
    {
        Symbol[][] board = new Symbol[GameConfig.xDim][];

        // Initalize jagged array
        for (int x = 0; x < GameConfig.xDim; x++)
        {
            board[x] = new Symbol[GameConfig.yDim];
            Array.Fill(board[x], Empty.Instance);
        }

        Random random = new();
        Color[] colors = Enum.GetValues<Color>();
        Dictionary<Color, Position> pPlacements = [];
        List<List<Position>> pWalks = [];
        List<Symbol> symbolReel = [];

        // Simulate board until no prisoner can walk anymore
        int walkCountBefore;
        do
        {
            Dictionary<Position, Symbol> boardChanges = [];

            // Fill missing diamonds
            for (int x = 0; x < GameConfig.xDim; x++)
            {
                for (int y = 0; y < GameConfig.yDim; y++)
                {
                    if (board[x][y] != Empty.Instance) continue;

                    Diamond symbol = new(colors[random.Next(colors.Length)], 1);
                    board[x][y] = symbol;
                    boardChanges.Add(new(x, y), symbol);
                }
            }

            // Fill missing prisoners
            foreach (Color color in colors)
            {
                if (pPlacements.ContainsKey(color)) continue;

                Position pos;
                do pos = boardChanges.ElementAt(random.Next(boardChanges.Count)).Key;
                while (pPlacements.ContainsValue(pos));

                Prisoner symbol = new(color);
                board[pos.X][pos.Y] = symbol;
                boardChanges[pos] = symbol;

                pPlacements.Add(color, pos);
            }

            symbolReel.AddRange(boardChanges.Values);

            // Walk prisoners
            walkCountBefore = pWalks.Count;
            foreach (Color color in colors)
            {
                List<Position> walk = WalkPrisoner(board, color, pPlacements);
                if (walk.Count > 1) pWalks.Add(walk); // walk always contains starting position
            }

            // TODO: Make all symbols fall
            Console.WriteLine("brh");


        } while (pWalks.Count > walkCountBefore);

        return new SpinResult(symbolReel, pWalks);
    }

    private static List<Position> WalkPrisoner(Symbol[][] board, Color color, Dictionary<Color, Position> pPlacements)
    {
        List<Position> walk = []; // Could maintain a parallel HashSet for O(1) lookups
        Queue<Position> queue = [];

        Position start = pPlacements[color];
        walk.Add(start);
        queue.Enqueue(start);

        while (queue.Count != 0)
        {
            Position current = queue.Dequeue();
            Position[] adjacent = current.Adjacent(GameConfig.xDim - 1, GameConfig.yDim - 1);

            foreach (Position adj in adjacent)
            {
                if (board[adj.X][adj.Y] is Diamond d
                    && d.Color == color
                    && !walk.Contains(adj)) // O(n) lookup, but n is small
                {
                    walk.Add(adj);
                    queue.Enqueue(adj);
                    board[current.X][current.Y] = Empty.Instance;
                }
            }
        }

        Position finalPos = walk.Last();
        pPlacements[color] = finalPos;
        board[finalPos.X][finalPos.Y] = new Prisoner(color);

        return walk;
    }
}

