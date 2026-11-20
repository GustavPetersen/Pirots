using System.ComponentModel.DataAnnotations;
using backend.data;
using Microsoft.EntityFrameworkCore;

public class Wallet
{
    [Key]
    public int Id { get; set; }
    public string UserId { get; set; }
    public AppUser User { get; set; } = null!;
    public float Amount { get; set; } = 500;
}