using BugTracker.Core.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace BugTracker.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _config;

        // ✅ Hardcoded users (replace with DB later)
        private readonly List<(string Username, string Password, string Role)> _users = new()
        {
            ("admin", "admin123", "Admin"),
            ("dev", "dev123", "Developer")
        };

        public AuthController(IConfiguration config)
        {
            _config = config;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequestDTO loginRequestDTO)
        {
            // ✅ Check against hardcoded users
            var user = _users.FirstOrDefault(u =>
                u.Username == loginRequestDTO.Username &&
                u.Password == loginRequestDTO.Password);

            if (user.Username != null)
            {
                var token = GenerateJwtToken(user.Username, user.Role);
                return Ok(new { Token = token, Role = user.Role });
            }

            return Unauthorized(new { Message = "Invalid credentials" });
        }

        private string GenerateJwtToken(string username, string role)
        {
            var jwtSettings = _config.GetSection("Jwt");

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            // ✅ Add claims
            var claims = new[]
            {
                new Claim(ClaimTypes.Name, username),
                new Claim(ClaimTypes.Role, role)
            };

            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(Convert.ToDouble(jwtSettings["ExpireMinutes"])),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
