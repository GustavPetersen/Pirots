using backend.engine.domain;

public record SpinResult(List<Symbol> SymbolReel, List<List<int>> PrisonerWalks)
{
    public List<Symbol> SymbolReel { get; set; } = SymbolReel;
    public List<List<int>> PrisonerWalks { get; set; } = PrisonerWalks;
}
