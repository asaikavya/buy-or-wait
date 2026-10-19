using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore;
using BuyOrWait.Infrastructure.Persistence.Entities;
using Microsoft.Identity.Client;

namespace BuyOrWait.Infrastructure.Persistence
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<UserSettings> UserSettings { get; set; }

        public DbSet<Transaction> Transactions
        {
            get; set;
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().HasIndex(u => u.Email).IsUnique();
            modelBuilder.Entity<UserSettings>().Property(s => s.CurrentBalance).HasPrecision(18, 2);
            modelBuilder.Entity<UserSettings>().Property(s => s.MinimumBalance).HasPrecision(18, 2);
            modelBuilder.Entity<Transaction>().Property(t => t.Amount).HasPrecision(18, 2);
        }
    }
}