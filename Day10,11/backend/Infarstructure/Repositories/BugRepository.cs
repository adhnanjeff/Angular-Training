using BugTracker.Core.Entities;
using BugTracker.Core.Interfaces;

namespace BugTracker.Infrastructure.Repositories
{
    public class BugRepository : IBugRepository
    {
        private static int _nextId = 1;
        private readonly List<Bug> _bugs = new();

        public BugRepository()
        {
            _bugs.AddRange(new List<Bug>
            {
                new Bug { Id = _nextId++, Title = "Login button not working", Description = "Users cannot login with valid credentials", Status = "Open", Priority = "High", ProjectId = 1, CreatedOn = DateTime.UtcNow },
                new Bug { Id = _nextId++, Title = "UI misalignment on dashboard", Description = "Widgets overlap on smaller screens", Status = "Open", Priority = "Medium", ProjectId = 1, CreatedOn = DateTime.UtcNow },
                new Bug { Id = _nextId++, Title = "Crash on profile update", Description = "App crashes when saving profile picture", Status = "In Progress", Priority = "High", ProjectId = 2, CreatedOn = DateTime.UtcNow },
                new Bug { Id = _nextId++, Title = "Email notifications not sent", Description = "Password reset emails are not being delivered", Status = "Open", Priority = "High", ProjectId = 2, CreatedOn = DateTime.UtcNow },
                new Bug { Id = _nextId++, Title = "Slow page loading", Description = "Dashboard takes more than 10 seconds to load", Status = "Open", Priority = "Low", ProjectId = 3, CreatedOn = DateTime.UtcNow },
                new Bug { Id = _nextId++, Title = "Typo in About page", Description = "The word 'Successfull' should be 'Successful'", Status = "Resolved", Priority = "Low", ProjectId = 3, CreatedOn = DateTime.UtcNow },
                new Bug { Id = _nextId++, Title = "Search not returning results", Description = "Search feature always returns empty", Status = "Open", Priority = "High", ProjectId = 1, CreatedOn = DateTime.UtcNow }
            });
        }

        public async Task<IEnumerable<Bug>> GetAllAsync()
        {
            return await Task.FromResult<IEnumerable<Bug>>(_bugs);
        }

        public async Task<Bug?> GetByIdAsync(int id)
        {
            return await Task.FromResult(_bugs.FirstOrDefault(b => b.Id == id));
        }

        public async Task AddAsync(Bug entity)
        {
            entity.Id = _nextId++;
            entity.CreatedOn = DateTime.UtcNow;
            _bugs.Add(entity);
            await Task.CompletedTask;
        }

        public async Task UpdateAsync(Bug bug)
        {
            var existing = _bugs.FirstOrDefault(b => b.Id == bug.Id);
            if (existing != null)
            {
                existing.Title = bug.Title;
                existing.Description = bug.Description;
                existing.Status = bug.Status;
                existing.Priority = bug.Priority;
                existing.ProjectId = bug.ProjectId;
            }
            await Task.CompletedTask;
        }

        public async Task DeleteAsync(int id)
        {
            var bug = _bugs.FirstOrDefault(b => b.Id == id);
            if (bug != null)
            {
                _bugs.Remove(bug);
            }
            await Task.CompletedTask;
        }
    }
}
