using backend.data;

public class Wallet
{
    public int Id { get; set; }
    public string UserId { get; set; } = null!;
    public AppUser User { get; set; } = null!;
    public decimal Amount { get; set; } = 500;
}