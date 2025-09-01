using BugTracker.Core.Entities;
using BugTracker.Core.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BugTracker.Infrastructure.Repositories
{
    public class ProjectRepository : IProjectRepository
    {
        private readonly List<Project> _projects = new();
        private int _nextId = 1;

        // Async
        public Task<IEnumerable<Project>> GetAllAsync() =>
            Task.FromResult<IEnumerable<Project>>(_projects.ToList());

        public Task<Project?> GetByIdAsync(int id) =>
            Task.FromResult<Project?>(_projects.FirstOrDefault(p => p.Id == id));

        public Task AddAsync(Project project)
        {
            project.Id = _nextId++;
            _projects.Add(project);
            return Task.CompletedTask;
        }

        public Task UpdateAsync(Project project)
        {
            return Task.CompletedTask;
        }

        public Task DeleteAsync(int id)
        {
            return Task.CompletedTask;
        }
    }
}
