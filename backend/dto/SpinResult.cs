using backend.engine.domain;

public record SpinResult(List<Symbol> SymbolReel, List<List<Position>> PrisonerWalks)
{
    public List<Symbol> SymbolReel { get; set; } = SymbolReel;
    public List<List<Position>> PrisonerWalks { get; set; } = PrisonerWalks;
}
