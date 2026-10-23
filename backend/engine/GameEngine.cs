using Microsoft.EntityFrameworkCore.Diagnostics;

public class GameEngine
{
    private List<Prisoner> PlacePrisoners()
    {
        List<Prisoner> prisoners =
        [
            new Prisoner(new Position(0, 0), Color.Blue),
            new Prisoner(new Position(5, 2), Color.Red),
            new Prisoner(new Position(2, 4), Color.Green),
            new Prisoner(new Position(5, 6), Color.Orange),
        ];

        return prisoners;
    }

    private List<List<Symbol>> PlaceGrid(List<Prisoner> prisoners)
    {
        Random random = new Random();
        Color[] colors = Enum.GetValues<Color>();

        List<List<Symbol>> grid = new(GameConfig.numOfReels);

        for (int x = 0; x < GameConfig.numOfReels; x++)
        {
            List<Symbol> column = new(GameConfig.symbolsPerReel);
            for (int y = 0; y < GameConfig.symbolsPerReel; y++)
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

    private List<Position> GetAdjacentPositions(List<List<Symbol>> grid, Position p, Color color)
    {
        var adjacentSymbolPositions = new List<Position>();

        void TryAdd(int x, int y)
        {
            if (x < 0 || x >= grid.Count || y < 0 || y >= grid[x].Count)
                return;

            bool matches = grid[x][y] switch
            {
                Diamond d => d.color == color,
                Empty => true,
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

    private List<Position> CollectConnected(List<List<Symbol>> grid, Prisoner prisoner)
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

    private int CalculatePayout(List<Position> movedPositions, List<List<Symbol>> grid)
    {
        return 5;
    }

    public void Spin()
    {
        List<Prisoner> prisoners = PlacePrisoners();
        List<List<Symbol>> grid = PlaceGrid(prisoners);
        int totalWin = 0;

        foreach (Prisoner prisoner in prisoners)
        {
            List<Position> movedPositions = CollectConnected(grid, prisoner);
            totalWin += CalculatePayout(movedPositions, grid);
            foreach (Position position in movedPositions)
            {
                grid[position.X][position.Y] = new Empty();
            }
        }
    

    }
}