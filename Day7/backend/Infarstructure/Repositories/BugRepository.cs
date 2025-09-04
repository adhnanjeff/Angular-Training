using BugTracker.Core.Entities;
using BugTracker.Core.Interfaces;

namespace BugTracker.Infrastructure.Repositories
{
    public class BugRepository : IBugRepository
    {
        private static int _nextId = 1;
        private readonly List<Bug> _bugs = new();
     
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
