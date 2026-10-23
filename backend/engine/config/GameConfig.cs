using Microsoft.VisualBasic;

public static class GameConfig
{
    public static int numOfReels = 6;
    public static int symbolsPerReel = 6;
    public static Dictionary<Color, double> colorValue = new Dictionary<Color, double>
    {
        [Color.Green] = 0.1,
        [Color.Blue] = 0.2,
        [Color.Orange] = 0.25,
        [Color.Red] = 0.3
    };

    public static Dictionary<Color, string> colorString = new Dictionary<Color, String>
    {
        [Color.Green] = "green",
        [Color.Blue] = "blue",
        [Color.Orange] = "orange",
        [Color.Red] = "red"
    };
}