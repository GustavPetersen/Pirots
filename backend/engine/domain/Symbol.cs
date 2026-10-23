public abstract record Symbol
{
    public abstract string name {get; set; }
    
}

public record Empty : Symbol
{
    public override string name
    {
        get { return "empty"; }
        set { }
    }
}

public record Diamond(Color c) : Symbol
{
    public Color color { get; set; } = c;
    public double value => GameConfig.colorValue[color];

        public override string name
    {
        get { return GameConfig.colorString[color]; }
        set { }
    }
}

