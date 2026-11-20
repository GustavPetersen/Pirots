using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace backend.data;

/// <summary>
/// Application user. Extend with custom profile fields as needed.
/// </summary>
public class AppUser : IdentityUser
{
    public Wallet Wallet { get; set; } = new ();
}
