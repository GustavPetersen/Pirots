namespace backend.engine.config;

using backend.engine.domain;

public static class GameConfig
{
    public static readonly int xDim = 6;
    public static readonly int yDim = 6;
    public static readonly Dictionary<Color, decimal> colorBaseMultiplier = new()
    {
        [Color.Green] = 0.1m,
        [Color.Blue] = 0.2m,
        [Color.Orange] = 0.25m,
        [Color.Red] = 0.3m
    };

    public static readonly Dictionary<Color, string> colorString = new()
    {
        [Color.Green] = "green",
        [Color.Blue] = "blue",
        [Color.Orange] = "orange",
        [Color.Red] = "red"
    };
}