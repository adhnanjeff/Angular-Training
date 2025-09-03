using BugTracker.Core.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BugTracker.Core.Interfaces
{
    public interface IProjectService
    {
        // Async
        Task CreateProjectAsync(ProjectRequestDTO request);
        Task<ProjectResponseDTO?> GetProjectByIdAsync(int id);
        Task<IEnumerable<ProjectResponseDTO>> GetAllProjectsAsync();
        Task UpdateProjectAsync(int id, ProjectRequestDTO request);
        Task DeleteProjectAsync(int id);
    }
}
