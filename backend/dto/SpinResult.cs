using backend.engine.domain;

public record SpinResult(List<List<Symbol>> initialBoard, List<List<Position>> prisonerMovements)
{
    public List<List<Symbol>> initialGrid { get; set; } = initialBoard;
    public List<List<Position>> prisonerMovements { get; set; } = prisonerMovements;
}
