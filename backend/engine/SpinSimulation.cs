namespace backend.engine;

using backend.engine.domain;
using backend.engine.config;

/// <summary>
/// Holds the running state of a single spin. Create a new instance per spin.
/// </summary>
public class SpinSimulation
{
    private static readonly Color[] colors = Enum.GetValues<Color>();
    private readonly int bet;
    private readonly Random random;
    private readonly Symbol[] board = new Symbol[GameConfig.xDim * GameConfig.yDim]; // row-major order
    private readonly Dictionary<Color, int> pPlacements = [];
    private readonly List<List<Step>> pWalks = [];
    private readonly List<Symbol> symbolReel = [];

    public SpinSimulation(int bet, Random? random = null)
    {
        this.bet = bet;
        this.random = random ?? new Random();
        Array.Fill(board, Empty.Instance);
    }

    public SpinResult Run()
    {
        // Simulate board until no prisoner can walk anymore
        bool pMoved;
        do
        {
            Dictionary<int, Symbol> boardChanges = []; // tile -> updated symbol

            FillDiamonds(boardChanges);
            FillPrisoners(boardChanges);
            symbolReel.AddRange(boardChanges.Values);

            pMoved = WalkPrisoners();
            ApplyGravity();

        } while (pMoved);

        return new SpinResult(symbolReel, pWalks);
    }

    private void FillDiamonds(Dictionary<int, Symbol> boardChanges)
    {
        for (int tile = 0; tile < board.Length; tile++)
        {
            if (board[tile] is not Empty) continue;

            Diamond symbol = new(colors[random.Next(colors.Length)], 1);
            board[tile] = symbol;
            boardChanges.Add(tile, symbol);
        }
    }

    private void FillPrisoners(Dictionary<int, Symbol> boardChanges)
    {
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
    }

    /// <returns>Whether any prisoner moved</returns>
    private bool WalkPrisoners()
    {
        bool pMoved = false;
        foreach (Color color in colors)
        {
            List<Step> walk = WalkPrisoner(color);
            pWalks.Add(walk);
            pMoved |= walk.Count > 1; // walk always contains starting position
        }
        return pMoved;
    }

    // Push all symbols down
    private void ApplyGravity()
    {
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
    }

    private List<Step> WalkPrisoner(Color color)
    {
        List<Step> walk = []; // Could maintain a parallel HashSet for O(1) lookups
        Stack<int> stack = [];

        int start = pPlacements[color];
        double baseMulti = GameConfig.colorBaseMultiplier[color];

        walk.Add(new(start, 0));
        stack.Push(start);

        while (stack.Count != 0)
        {
            int curTile = stack.Pop();

            foreach (int adjTile in Adjacent(curTile))
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
