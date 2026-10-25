namespace backend.engine;

using backend.engine.domain;
using backend.engine.config;

public class GameEngine
{
    private static List<Prisoner> PlacePrisoners()
    {
        List<Prisoner> prisoners =
        [
            new Prisoner(new Position(0, 0), Color.Blue),
            new Prisoner(new Position(5, 2), Color.Red),
            new Prisoner(new Position(2, 4), Color.Green),
            new Prisoner(new Position(5, 3), Color.Orange),
        ];

        return prisoners;
    }

    private static Position[] GetPrisonerStartLocations()
    {
        Random random = new();
        int numColors = Enum.GetValues<Color>().Length;

        Position[] locations = new Position[numColors];
        for (int i = 0; i < numColors; i++)
        {
            locations[i] = new(random.Next(GameConfig.xDim), random.Next(GameConfig.yDim));
        }

        return locations;
    }

    private static Symbol[,] CreateBoard()
    {
        Random random = new Random();
        Symbol[,] board = new Symbol[GameConfig.xDim, GameConfig.yDim];
        Color[] colors = Enum.GetValues<Color>();

        // Fill the board with diamonds
        for (int x = 0; x < GameConfig.xDim; x++)
        {
            for (int y = 0; y < GameConfig.yDim; y++)
            {
                board[x, y] = new Diamond(colors[random.Next(colors.Length)], 1);
            }
        }

        // Place prisoners
        HashSet<Position> taken = new();
        foreach (Color color in colors)
        {
            Position pos;
            do pos = new(random.Next(GameConfig.xDim), random.Next(GameConfig.yDim));
            while (taken.Contains(pos));

            taken.Add(pos);
            board[pos.X, pos.Y] = new Prisoner(color);
        }

        return board;
    }

    private static List<List<Symbol>> PlaceGrid(List<Prisoner> prisoners)
    {
        Random random = new Random();
        Color[] colors = Enum.GetValues<Color>();

        List<List<Symbol>> grid = new(GameConfig.xDim);

        for (int x = 0; x < GameConfig.xDim; x++)
        {
            List<Symbol> column = new(GameConfig.yDim);
            for (int y = 0; y < GameConfig.yDim; y++)
            {
                if (prisoners.Any(p => p.Position.X == x && p.Position.Y == y))
                {
                    column.Add(new Empty());
                }
                else
                {
                    column.Add(new Diamond(colors[random.Next(colors.Length)]));
                }
            }
            grid.Add(column);
        }

        return grid;
    }

    private static List<Position> GetAdjacentPositions(List<List<Symbol>> grid, Position p, Color color)
    {
        var adjacentSymbolPositions = new List<Position>();

        void TryAdd(int x, int y)
        {
            if (x < 0 || x >= grid.Count || y < 0 || y >= grid[x].Count)
                return;

            bool matches = grid[x][y] switch
            {
                Diamond d => d.color == color,
                Empty => false,
                _ => false
            };

            if (matches)
                adjacentSymbolPositions.Add(new Position(x, y));
        }

        TryAdd(p.X, p.Y - 1); // Top
        TryAdd(p.X, p.Y + 1); // Bottom
        TryAdd(p.X - 1, p.Y); // Left
        TryAdd(p.X + 1, p.Y); // Right

        return adjacentSymbolPositions;
    }

    private static List<Position> CollectConnected(List<List<Symbol>> grid, Prisoner prisoner)
    {
        Position rootPosition = prisoner.Position;

        Queue<Position> Q = new();
        List<Position> seenPositions = [rootPosition];
        Q.Enqueue(rootPosition);

        while (Q.Count != 0)
        {
            Position v = Q.Dequeue();
            List<Position> adjacentPositions = GetAdjacentPositions(grid, v, prisoner.Color);
            foreach (Position adjacentPosition in adjacentPositions)
            {
                if (!seenPositions.Any(p => p.Equals(adjacentPosition)))
                {
                    seenPositions.Add(adjacentPosition);
                    Q.Enqueue(adjacentPosition);
                }
            }
        }

        return seenPositions;
    }

    private static int CalculatePayout(List<Position> movedPositions, List<List<Symbol>> grid)
    {
        return 5;
    }

    public static SpinResult Spin(int bet)
    {
        List<Prisoner> prisoners = PlacePrisoners();
        List<List<Symbol>> grid = PlaceGrid(prisoners);
        List<List<Symbol>> initialGrid = new(grid.Count);
        foreach (List<Symbol> l in grid)
        {
            List<Symbol> temp = new(l.Count);
            foreach (Symbol s in l)
            {
                switch (s)
                {
                    case Empty e:
                        temp.Add(new Empty());
                        break;
                    case Diamond d:
                        temp.Add(new Diamond(d.color));
                        break;
                    default:
                        temp.Add(new Empty());
                        break;
                }
            }
            initialGrid.Add(temp);
        }

        int totalWin = 0;

        Dictionary<Color, SpinMovements> prisonerMovements = new();

        foreach (Prisoner prisoner in prisoners)
        {
            // TODO: Add movements to final return for prisoner with color
            List<Position> movedPositions = CollectConnected(grid, prisoner);
            prisonerMovements.Add(prisoner.Color, new SpinMovements(prisoner.Position, movedPositions));
            totalWin += CalculatePayout(movedPositions, grid);
            foreach (Position position in movedPositions)
            {
                Console.WriteLine(position.ToString());
                grid[position.X][position.Y] = new Empty();
            }
        }

        return new SpinResult(initialGrid, prisonerMovements);
    }
}