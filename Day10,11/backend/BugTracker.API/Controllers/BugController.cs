using BugTracker.Core.DTOs;
using BugTracker.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BugTracker.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BugController : ControllerBase
    {
        private readonly IBugService _service;

        public BugController(IBugService service)
        {
            _service = service;
        }

        // ----------------- ASYNC -----------------
 
        [HttpGet("async")]
        public async Task<ActionResult<IEnumerable<BugResponseDTO>>> GetAllAsync()
        {
            var bugs = await _service.GetAllBugsAsync();
            return Ok(bugs);
        }

        [Authorize]
        [HttpGet("async/{id}", Name = "GetBugByIdAsync")]
        public async Task<ActionResult<BugResponseDTO>> GetByIdAsync(int id)
        {
            var bug = await _service.GetBugByIdAsync(id);
            if (bug == null)
                return NotFound();

            return Ok(bug);
        }

        [HttpPost("async")]
        public async Task<ActionResult> CreateAsync([FromBody] BugRequestDTO dto)
        {
            var id = await _service.CreateBugAsync(dto);
            var createdBug = await _service.GetBugByIdAsync(id);
            return CreatedAtRoute("GetBugByIdAsync", new { id }, createdBug);
        }

        [Authorize]
        [HttpPut("async/{id}")]
        public async Task<ActionResult> UpdateAsync(int id, [FromBody] BugRequestDTO dto)
        {
            var existing = await _service.GetBugByIdAsync(id);
            if (existing == null)
                return NotFound();

            await _service.UpdateBugAsync(id, dto);
            return NoContent(); // ✅ 204 No Content is the standard
        }

        [Authorize]
        [HttpDelete("async/{id}")]
        public async Task<ActionResult> DeleteAsync(int id)
        {
            var existing = await _service.GetBugByIdAsync(id);
            if (existing == null)
                return NotFound();

            await _service.DeleteBugAsync(id);
            return NoContent(); // ✅ 204 No Content
        }

        [Authorize]
        [HttpDelete("async/batch")]
        public async Task<ActionResult> DeleteMultipleAsync([FromBody] int[] ids)
        {
            if (ids == null || ids.Length == 0)
                return BadRequest("No bug IDs provided");

            await _service.DeleteMultipleBugsAsync(ids);
            return NoContent();
        }

    }
}
