namespace backend.engine;

using backend.engine.domain;
using backend.engine.config;

public class GameEngine
{
    public static SpinResult Spin(int bet)
    {
        Random random = new();
        Symbol[] board = new Symbol[GameConfig.xDim * GameConfig.yDim]; // row-major order
        Array.Fill(board, Empty.Instance);

        Color[] colors = Enum.GetValues<Color>();
        Dictionary<Color, int> pPlacements = [];
        List<List<Step>> pWalks = [];
        List<Symbol> symbolReel = [];

        // Simulate board until no prisoner can walk anymore
        bool pMoved;
        do
        {
            Dictionary<int, Symbol> boardChanges = []; // tile -> updated symbol

            // Fill missing diamonds
            for (int tile = 0; tile < board.Length; tile++)
            {
                if (board[tile] is not Empty) continue;

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

            // Walk prisoners
            pMoved = false;
            foreach (Color color in colors)
            {
                List<Step> walk = WalkPrisoner(board, color, pPlacements, bet);
                pWalks.Add(walk);
                pMoved |= walk.Count > 1; // walk always contains starting position
            }

            // Push all symbols down
            for (int tile = board.Length - GameConfig.xDim - 1; tile >= 0; tile--) // Skip last row
            {
                int downTile = tile;
                while ((downTile += GameConfig.xDim) < board.Length && board[downTile] is Empty) { }
                downTile -= GameConfig.xDim; // We have overshot by 1 row

                if (downTile == tile) continue;
                if (board[tile] is Prisoner p) pPlacements[p.Color] = downTile;

                board[downTile] = board[tile];
                board[tile] = Empty.Instance;
            }

        } while (pMoved);

        return new SpinResult(symbolReel, pWalks);
    }

    private static List<Step> WalkPrisoner( // this signature is akward
        Symbol[] board, Color color, Dictionary<Color, int> pPlacements, int bet
    )
    {
        List<double> payouts = [];
        List<Step> walk = []; // Could maintain a parallel HashSet for O(1) lookups
        Stack<int> stack = [];

        int start = pPlacements[color];
        double baseMulti = GameConfig.colorBaseMultiplier[color];

        walk.Add(new(start, 0));
        stack.Push(start);

        while (stack.Count != 0)
        {
            int curTile = stack.Pop();
            int[] adjacentTiles = [.. Adjacent(curTile)];

            foreach (int adjTile in adjacentTiles)
            {
                if (board[adjTile] is Diamond d
                    && d.Color == color
                    && !walk.Any(step => step.Tile == adjTile)) // O(n) lookup, but n is small
                {
                    double effectiveMulti = baseMulti * d.Level;
                    double payout = effectiveMulti * bet;
                    Step step = new(adjTile, payout);

                    walk.Add(step);
                    stack.Push(adjTile);
                }
            }
        }

        foreach (Step step in walk) board[step.Tile] = Empty.Instance;

        int endTile = walk.Last().Tile;
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

