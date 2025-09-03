using Microsoft.AspNetCore.Mvc;
using BugTracker.Core.DTOs;
using BugTracker.Core.Interfaces;
using System.Threading.Tasks;

namespace BugTracker.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectController : ControllerBase
    {
        private readonly IProjectService _projectService;

        public ProjectController(IProjectService projectService)
        {
            _projectService = projectService;
        }

        [HttpPost("async")]
        public async Task<IActionResult> CreateProjectAsync([FromBody] ProjectRequestDTO request)
        {
            if (request == null) return BadRequest("Project data is required.");
            await _projectService.CreateProjectAsync(request);
            return Ok("Project created successfully.");
        }

        [HttpGet("async")]
        public async Task<IActionResult> GetAllProjectsAsync()
        {
            var projects = await _projectService.GetAllProjectsAsync();
            return Ok(projects);
        }

        [HttpGet("async/{id}")]
        public async Task<IActionResult> GetProjectByIdAsync(int id)
        {
            var project = await _projectService.GetProjectByIdAsync(id);
            if (project == null) return NotFound($"Project with ID {id} not found.");
            return Ok(project);
        }

        [HttpPut("async/{id}")]
        public async Task<IActionResult> UpdateProjectAsync(int id, [FromBody] ProjectRequestDTO request)
        {
            if (request == null) return BadRequest("Project data is required.");
            var existing = await _projectService.GetProjectByIdAsync(id);
            if (existing == null) return NotFound($"Project with ID {id} not found.");

            await _projectService.UpdateProjectAsync(id, request);
            return Ok("Project updated successfully.");
        }

        [HttpDelete("async/{id}")]
        public async Task<IActionResult> DeleteProjectAsync(int id)
        {
            var existing = await _projectService.GetProjectByIdAsync(id);
            if (existing == null) return NotFound($"Project with ID {id} not found.");

            await _projectService.DeleteProjectAsync(id);
            return Ok("Project deleted successfully.");
        }
    }
}
