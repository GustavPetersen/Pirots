using Microsoft.AspNetCore.DataProtection.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace backend.data;

/// <summary>
/// Our EF Core dbcontext. Currently contains Identity tables and Data Protection keys.
/// Will later hold the rest of the app's data such as wallets, stats, etc. 
/// </summary>
public class AppDbContext(DbContextOptions<AppDbContext> options)
    : IdentityDbContext<AppUser>(options), IDataProtectionKeyContext
{
    public DbSet<DataProtectionKey> DataProtectionKeys => Set<DataProtectionKey>();

    // Future: public DbSet<Wallet> Wallets => Set<Wallet>();
}
