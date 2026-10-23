public record SpinMovements (Position startingPosition, List<Position> movements)
{
    public Position startingPosition {get; set;} = startingPosition;
    public List<Position> movements {get; set;} = movements;
}
public record SpinResult (List<List<Symbol>> initialGrid, Dictionary<Color, SpinMovements> prisonerMovements)
{
    public List<List<Symbol>> initialGrid { get; set; } = initialGrid;
    public Dictionary<Color, SpinMovements> prisonerMovements { get; set; } = prisonerMovements;
}