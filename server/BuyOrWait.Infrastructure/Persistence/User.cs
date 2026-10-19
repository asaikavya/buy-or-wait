using System;
using System.Collections.Generic;
using System.Text;

namespace BuyOrWait.Infrastructure.Persistence.Entities
{
    public class User
    {
        public int Id { get; set; }
        public string Email { get; set; } = " ";

        public string passwordHash { get; set; } = " ";

        public UserSettings? Settings { get; set; }

        public List<Transaction> Transactions { get; set; } = new List<Transaction>(); // one user can have many transactions


    }
}
