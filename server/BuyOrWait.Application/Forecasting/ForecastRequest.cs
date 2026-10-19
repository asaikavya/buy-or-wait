using System;
using System.Collections.Generic;
using System.Text;

namespace BuyOrWait.Application.Forecasting
{
    
 
        public record Purchase(string Name, decimal Amount);
        public record ForecastRequest(decimal CurrentBalance, 
            decimal MinimumBalance, decimal MonthlyIncome, decimal MonthlyExpenses, Purchase Purchase);


    
}
