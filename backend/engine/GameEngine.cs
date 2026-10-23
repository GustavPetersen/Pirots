using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.EntityFrameworkCore.Query.SqlExpressions;

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

    private static List<List<Symbol>> PlaceGrid(List<Prisoner> prisoners)
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

        Dictionary<Color, Tuple<Position, List<Position>>> prisonerMovements = new();

        foreach (Prisoner prisoner in prisoners)
        {
            // TODO: Add movements to final return for prisoner with color
            List<Position> movedPositions = CollectConnected(grid, prisoner);
            prisonerMovements.Add(prisoner.Color, new Tuple<Position, List<Position>>(prisoner.Position, movedPositions));
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