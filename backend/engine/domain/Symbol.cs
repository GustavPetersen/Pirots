public abstract record Symbol { }

public record Empty : Symbol { }

public record Diamond(Color c) : Symbol
{
    public Color color { get; set; } = c;
}