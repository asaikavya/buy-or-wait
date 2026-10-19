using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;

namespace BuyOrWait.Api.Controllers
{
        public abstract class APIControllerBase : ControllerBase
        {
            protected int CurrentUserId => int.Parse(User.FindFirst(JwtRegisteredClaimNames.Sub)!.Value);
        }
    
}