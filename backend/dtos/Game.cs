using backend.engine.domain;

namespace backend.dtos;

public record SpinResult(List<Symbol> SymbolReel, List<List<Step>> PrisonerWalks);
