using BugTracker.Core.Entities;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace BugTracker.Infrastructure.Data
{
    public class BugTrackerContext : DbContext
    {
        public BugTrackerContext(DbContextOptions<BugTrackerContext> options)
            : base(options)
        {

        }

        public DbSet<Bug> Bugs => Set<Bug>();
        public DbSet<Project> Projects => Set<Project>();
    }
}
