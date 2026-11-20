using Microsoft.AspNetCore.DataProtection.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace backend.data;

/// <summary>
/// EF Core dbcontext. Currently contains Identity tables and Data Protection keys.
/// Will eventually aslo hold wallets, stats, etc. 
/// </summary>
public class AppDbContext(DbContextOptions<AppDbContext> options)
    : IdentityDbContext<AppUser>(options), IDataProtectionKeyContext
{
    public DbSet<DataProtectionKey> DataProtectionKeys => Set<DataProtectionKey>();

    public DbSet<Wallet> Wallets => Set<Wallet>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder); 

        modelBuilder.Entity<AppUser>()
            .HasOne(e => e.Wallet)
            .WithOne(e => e.User)
            .HasForeignKey<Wallet>(e => e.UserId)
            .IsRequired();
    }
}

