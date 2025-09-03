using BugTracker.Core.DTOs;

namespace BugTracker.Core.Interfaces
{
    public interface IBugService
    {
        Task<int> CreateBugAsync(BugRequestDTO request);
        Task UpdateBugAsync(int id, BugRequestDTO request);
        Task DeleteBugAsync(int id);
        Task<BugResponseDTO?> GetBugByIdAsync(int id);
        Task<IEnumerable<BugResponseDTO>> GetAllBugsAsync();
    }
}
