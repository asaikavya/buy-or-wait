using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;
using BuyOrWait.Application.Auth;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace BuyOrWait.Infrastructure.Auth
{
    public class JwtTokenService : ITokenService
    {
        private readonly IConfiguration _config;
        public JwtTokenService (IConfiguration config) => _config = config;

        public string CreateToken(int userId,string email)
        {
            var jwt= _config.GetSection("Jwt");
            var key= new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt["Key"]));
            var creds=new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub,userId.ToString()),
                new Claim(JwtRegisteredClaimNames.Email,email)

            };
            var token = new JwtSecurityToken(
                issuer: jwt["Issuer"],
                audience: jwt["Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(int.Parse(jwt["ExpiryMinutes"]!)),
                signingCredentials: creds);
            return new JwtSecurityTokenHandler().WriteToken(token);
        }

    }
}
