namespace backend.engine.domain;

using backend.engine.config;

public abstract record Symbol
{
    public abstract string Name { get; set; }

}

public record Empty : Symbol
{
    public override string Name
    {
        get => "empty";
        set { }
    }
}

public record Diamond(Color Color, double Multiplier) : Symbol
{
    public Color Color { get; set; } = Color;
    public double Multiplier { get; set; } = Multiplier;
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

