namespace backend.engine;

using backend.engine.domain;
using backend.engine.config;
using Microsoft.AspNetCore.DataProtection.Repositories;

public class GameEngine
{
    public static SpinResult Spin(int bet)
    {
        Random random = new();
        Symbol[] board = new Symbol[GameConfig.xDim * GameConfig.yDim]; // row-major order
        Array.Fill(board, Empty.Instance);

        Color[] colors = Enum.GetValues<Color>();
        Dictionary<Color, int> pPlacements = [];
        List<List<int>> pWalks = [];
        List<Symbol> symbolReel = [];

        // Simulate board until no prisoner can walk anymore
        bool pMoved;
        do
        {
            Dictionary<int, Symbol> boardChanges = [];

            // Fill missing diamonds
            for (int tile = 0; tile < board.Length; tile++)
            {
                if (board[tile] != Empty.Instance) continue;

                Diamond symbol = new(colors[random.Next(colors.Length)], 1);
                board[tile] = symbol;
                boardChanges.Add(tile, symbol);
            }

            // Fill missing prisoners
            foreach (Color color in colors)
            {
                if (pPlacements.ContainsKey(color)) continue;

                int tile;
                do tile = boardChanges.ElementAt(random.Next(boardChanges.Count)).Key;
                while (pPlacements.ContainsValue(tile));

                Prisoner symbol = new(color);
                board[tile] = symbol;
                boardChanges[tile] = symbol;

                pPlacements.Add(color, tile);
            }

            symbolReel.AddRange(boardChanges.Values);
            Console.WriteLine($"first: {board[0]} last: {board[board.Length - 1]}");

            // Walk prisoners
            pMoved = false;
            foreach (Color color in colors)
            {
                List<int> walk = WalkPrisoner(board, color, pPlacements);
                pWalks.Add(walk);
                pMoved |= walk.Count > 1; // walk always contains starting position
            }

            // Push all symbols down
            for (int tile = board.Length - GameConfig.xDim - 1; tile >= 0; tile--) // Skip last row
            {
                int downTile = tile + GameConfig.xDim;
                if (board[downTile] != Empty.Instance) continue;
                if (board[tile] is Prisoner p) pPlacements[p.Color] = downTile;

                board[downTile] = board[tile];
                board[tile] = Empty.Instance;
            }

        } while (pMoved);

        return new SpinResult(symbolReel, pWalks);
    }

    private static List<int> WalkPrisoner(Symbol[] board, Color color, Dictionary<Color, int> pPlacements)
    {
        List<int> walk = []; // Could maintain a parallel HashSet for O(1) lookups
        Queue<int> queue = [];

        int start = pPlacements[color];
        walk.Add(start);
        queue.Enqueue(start);

        while (queue.Count != 0)
        {
            int curTile = queue.Dequeue();
            int[] adjacentTiles = [.. Adjacent(curTile)];

            foreach (int adj in adjacentTiles)
            {
                if (board[adj] is Diamond d
                    && d.Color == color
                    && !walk.Contains(adj)) // O(n) lookup, but n is small
                {
                    walk.Add(adj);
                    queue.Enqueue(adj);
                    board[curTile] = Empty.Instance;
                }
            }
        }

        int endTile = walk.Last();
        pPlacements[color] = endTile;
        board[endTile] = new Prisoner(color);

        return walk;
    }

    private static IEnumerable<int> Adjacent(int tile)
    {
        int size = GameConfig.xDim * GameConfig.yDim;
        int width = GameConfig.xDim;
        int xCoord = tile % width;

        if (tile >= width) yield return tile - width;       // up
        if (tile < size - width) yield return tile + width; // down
        if (xCoord > 0) yield return tile - 1;              // left
        if (xCoord < width - 1) yield return tile + 1;      // right
    }
}

