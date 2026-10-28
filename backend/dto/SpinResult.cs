using backend.engine.domain;

public record SpinResult(List<Symbol> SymbolReel, List<List<Step>> PrisonerWalks)
{
    public List<Symbol> SymbolReel { get; set; } = SymbolReel;
    public List<List<Step>> PrisonerWalks { get; set; } = PrisonerWalks;
}
