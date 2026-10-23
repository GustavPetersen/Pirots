using Microsoft.VisualBasic;

public static class GameConfig
{
    public static int numOfReels = 6;
    public static int symbolsPerReel = 6;
    public static Dictionary<Color, double> colorValue = new Dictionary<Color, double>
    {
        [Color.Green] = 0.1,
        [Color.Green] = 0.2,
        [Color.Blue] = 0.25,
        [Color.Blue] = 0.3
    };
}