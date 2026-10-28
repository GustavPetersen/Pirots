namespace backend.engine.domain;

using backend.engine.config;

public abstract record Symbol
{
    public abstract string Name { get; set; }

}

public sealed record Empty : Symbol
{
    private Empty() { }
    public static readonly Empty Instance = new();
    public override string Name
    {
        get => "empty";
        set { }
    }
}

public record Diamond(Color Color, double Level) : Symbol
{
    public Color Color { get; set; } = Color;
    public double Level { get; set; } = Level;
    public override string Name
    {
        get => $"d_{GameConfig.colorString[Color]}";
        set { }
    }
}

public record Prisoner(Color Color) : Symbol
{
    public Color Color { get; set; } = Color;
    public override string Name
    {
        get => $"p_{GameConfig.colorString[Color]}";
        set { }
    }
}

