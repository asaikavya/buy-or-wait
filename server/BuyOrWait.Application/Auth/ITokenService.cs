using System;
using System.Collections.Generic;
using System.Text;

namespace BuyOrWait.Application.Auth
{
    public interface ITokenService
    {
        string CreateToken(int userId, string email);
    }
}
