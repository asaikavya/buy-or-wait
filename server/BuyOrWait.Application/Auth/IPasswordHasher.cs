using System;
using System.Collections.Generic;
using System.Text;


namespace BuyOrWait.Application.Auth
{
    public interface IPasswordHasher
    {
        string Hash(string password);
        bool Verify(string password, string hash);
    }
}
