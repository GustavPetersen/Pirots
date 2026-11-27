using backend.engine.domain;

namespace backend.dtos;

public record SpinRequest(int Bet, int IdempotencyKey);
public record SpinResult(List<Symbol> SymbolReel, List<List<Step>> PrisonerWalks);
