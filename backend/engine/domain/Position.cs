namespace backend.engine.domain;

public struct Position(int x, int y)
{
    public int X { get; set; } = x;
    public int Y { get; set; } = y;

    public override readonly string ToString()
    {
        return $"({X}, {Y})";
    }

    /// <summary>
    /// WARNING: May return duplicates
    /// </summary>
    public readonly Position[] Adjacent(int maxX, int maxY)
    {
        return [
            new(X, Math.Min(Y + 1, maxY)),
            new(X, Math.Max(Y - 1, 0)),
            new(Math.Min(X + 1, maxX), Y),
            new(Math.Max(X - 1, 0), Y),
        ];
    }
}