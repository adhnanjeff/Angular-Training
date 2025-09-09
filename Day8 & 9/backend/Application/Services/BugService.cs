using BugTracker.Core.DTOs;
using BugTracker.Core.Entities;
using BugTracker.Core.Exceptions;
using BugTracker.Core.Interfaces;

namespace BugTracker.Core.Services
{
    public class BugService : IBugService
    {
        private readonly IBugRepository _bugRepository;

        public BugService(IBugRepository bugRepository)
        {
            _bugRepository = bugRepository;
        }

        // ----------------- ASYNC -----------------
        public async Task<int> CreateBugAsync(BugRequestDTO request)
        {
            var bug = new Bug
            {
                Title = request.Title,
                Description = request.Description,
                Status = request.Status,
                CreatedOn = DateTime.Now,
                Priority = request.Priority,
                ProjectId = request.ProjectId
            };

            await _bugRepository.AddAsync(bug);
            return bug.Id;
        }

        public async Task UpdateBugAsync(int id, BugRequestDTO request)
        {
            var bug = await _bugRepository.GetByIdAsync(id);
            if (bug == null)
                throw new Exception("Bug not found.");

            bug.Title = request.Title;
            bug.Description = request.Description;
            bug.Status = request.Status;
            bug.ProjectId = request.ProjectId;

            await _bugRepository.UpdateAsync(bug);
        }

        public async Task DeleteBugAsync(int id)
        {
            await _bugRepository.DeleteAsync(id);
        }

        public async Task<BugResponseDTO?> GetBugByIdAsync(int id)
        {
            var bug = await _bugRepository.GetByIdAsync(id);
            return bug == null ? null : MapToResponseDTO(bug);
        }

        public async Task<IEnumerable<BugResponseDTO>> GetAllBugsAsync()
        {
            var bugs = await _bugRepository.GetAllAsync();
            return bugs.Select(MapToResponseDTO);
        }

        private BugResponseDTO MapToResponseDTO(Bug bug)
        {
            return new BugResponseDTO
            {
                Id = bug.Id,
                Title = bug.Title,
                Description = bug.Description,
                Status = bug.Status,
                Priority = bug.Priority,
                CreatedOn = bug.CreatedOn,
                ProjectId = bug.ProjectId
            };
        }
    }
}
