namespace backend.engine;

public static class GameEngine
{
    public static SpinResult Spin(int bet) => new SpinSimulation(bet).Run();
}
