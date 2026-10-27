using backend.engine.domain;

public record SpinResult(List<Symbol> SymbolReel, List<List<Position>> PrisonerMovements)
{
    public List<Symbol> SymbolReel { get; set; } = SymbolReel;
    public List<List<Position>> PrisonerMovements { get; set; } = PrisonerMovements;
}
