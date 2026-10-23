public class SpinResult
{
    public List<List<Symbol>> initialGrid { get; set; }
    public Dictionary<Color, Tuple<Position, List<Position>>> prisonerMovements { get; set; }

    public SpinResult(List<List<Symbol>> initialGrid, Dictionary<Color, Tuple<Position, List<Position>>> prisonerMovements)
    {
        this.initialGrid = initialGrid;
        this.prisonerMovements = prisonerMovements;
    }

}