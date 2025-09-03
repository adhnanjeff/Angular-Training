using BugTracker.Core.Entities;
using BugTracker.Core.Interfaces;


namespace BugTracker.Core.Interfaces
{
    public interface IBugRepository :IRepository<Bug>
    {
        Task<IEnumerable<Bug>> GetAllAsync();
        Task<Bug?> GetByIdAsync(int id);
        Task AddAsync(Bug entity);
        Task UpdateAsync(Bug bug);
        Task DeleteAsync(int id);
    }
}
