namespace backend.dtos;

public record LoginRequest(string UserName, string Password, bool RememberMe);

public record SignUpRequest(string UserName, string Password);

public record MeResult(string UserName, decimal Balance);