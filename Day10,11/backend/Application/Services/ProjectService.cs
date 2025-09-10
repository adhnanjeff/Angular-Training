using BugTracker.Core.DTOs;
using BugTracker.Core.Entities;
using BugTracker.Core.Interfaces;

namespace BugTracker.Core.Services
{
    public class ProjectService : IProjectService
    {
        private readonly IProjectRepository _projectRepository;

        public ProjectService(IProjectRepository projectRepository)
        {
            _projectRepository = projectRepository;
        }

        // Async
        public async Task CreateProjectAsync(ProjectRequestDTO request)
        {
            var project = new Project
            {
                Name = request.Name,
                Description = request.Description
            };
            await _projectRepository.AddAsync(project);
        }

        public async Task<ProjectResponseDTO?> GetProjectByIdAsync(int id)
        {
            var project = await _projectRepository.GetByIdAsync(id);
            return project == null ? null : MapToResponse(project);
        }

        public async Task<IEnumerable<ProjectResponseDTO>> GetAllProjectsAsync()
        {
            var projects = await _projectRepository.GetAllAsync();
            return projects.Select(MapToResponse);
        }

        public async Task UpdateProjectAsync(int id, ProjectRequestDTO request)
        {
            var project = await _projectRepository.GetByIdAsync(id);
            if (project == null) throw new KeyNotFoundException("Project not found");

            project.Name = request.Name;
            project.Description = request.Description;
            await _projectRepository.UpdateAsync(project);
        }

        public async Task DeleteProjectAsync(int id)
        {
            var project = await _projectRepository.GetByIdAsync(id);
            if (project == null) throw new KeyNotFoundException("Project not found");

            await _projectRepository.DeleteAsync(id);
        }

        private static ProjectResponseDTO MapToResponse(Project project) =>
            new ProjectResponseDTO
            {
                Id = project.Id,
                Name = project.Name,
                Description = project.Description
            };
    }
}
