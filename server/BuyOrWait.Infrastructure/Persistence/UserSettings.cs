using System;
using System.Collections.Generic;
using System.Text;

namespace BuyOrWait.Infrastructure.Persistence.Entities
{
    public class UserSettings
    {
        public int Id { get; set; }
        public int UserId { get; set; }

        public decimal CurrentBalance { get; set; }

        public decimal MinimumBalance { get; set; }
    }
}
