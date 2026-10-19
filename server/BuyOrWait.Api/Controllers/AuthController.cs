using BuyOrWait.Application.Auth;
using BuyOrWait.Infrastructure.Persistence;
using BuyOrWait.Infrastructure.Persistence.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.IdentityModel.Tokens.Jwt;

namespace BuyOrWait.Api.Controllers
{
    public record RegisterRequest(string Email, string Password);
    public record LoginRequest(string Email, string Password);
   


    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ITokenService _tokenService;
        private readonly AppDbContext _db;
        private readonly IPasswordHasher _hasher;

        public AuthController(AppDbContext db, IPasswordHasher hasher, ITokenService tokenService)
        {
            _db = db;
            _hasher = hasher;
            _tokenService = tokenService;
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequest request)
        {
                var email = request.Email.Trim().ToLowerInvariant();
            var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == email);
            if(user==null || !_hasher.Verify(request.Password, user.passwordHash))
            {
                return Unauthorized("Invalid email or password.");
            }
            var token=_tokenService.CreateToken(user.Id,user.Email);
            return Ok(new { token });
        }
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterRequest request)
        {
            var email = request.Email.Trim().ToLowerInvariant();
            if (await _db.Users.AnyAsync(u => u.Email == email))
            {
                return Conflict("An account with this email already exists.");
            }

            var user = new User
            {
                Email = email,
                passwordHash = _hasher.Hash(request.Password)
            };
            _db.Users.Add(user);
            await _db.SaveChangesAsync();
            return Ok(new { user.Id, user.Email });
        }
        [Authorize]
        [HttpGet("me")]
        public IActionResult Me()
        {
            var userId = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
            var email = User.FindFirst(JwtRegisteredClaimNames.Email)?.Value;
            return Ok(new { userId, email });
        }


    }
}
