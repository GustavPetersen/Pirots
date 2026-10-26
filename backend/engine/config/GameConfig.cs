namespace backend.engine.config;

using backend.engine.domain;

public static class GameConfig
{
    public static readonly int xDim = 6;
    public static readonly int yDim = 6;
    public static readonly Dictionary<Color, double> colorbaseMultiplier = new()
    {
        [Color.Green] = 0.1,
        [Color.Blue] = 0.2,
        [Color.Orange] = 0.25,
        [Color.Red] = 0.3
    };

    public static readonly Dictionary<Color, string> colorString = new()
    {
        [Color.Green] = "green",
        [Color.Blue] = "blue",
        [Color.Orange] = "orange",
        [Color.Red] = "red"
    };
}