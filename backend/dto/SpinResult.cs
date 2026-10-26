using backend.engine.domain;

public record SpinResult(Symbol[][] InitialBoard, List<List<Position>> PrisonerMovements)
{
    public Symbol[][] InitialBoard { get; set; } = InitialBoard;
    public List<List<Position>> PrisonerMovements { get; set; } = PrisonerMovements;
}
