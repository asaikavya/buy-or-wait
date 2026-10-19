using System;
using System.Collections.Generic;
using System.Text;

namespace BuyOrWait.Infrastructure.Persistence.Entities
{
    public  class Transaction
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Description { get; set; } = " ";
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }

        public bool IsRecurring { get; set; } 
    }
}
