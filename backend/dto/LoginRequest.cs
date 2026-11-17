namespace backend.dto;

public record LoginRequest(string Email, string Password, bool RememberMe)
{
    public string Email { get; set; } = Email;
    public string Password { get; set; } = Password;
    public bool RememberMe { get; set; } = RememberMe;
}
