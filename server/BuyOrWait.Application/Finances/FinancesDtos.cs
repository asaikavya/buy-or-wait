using System;
using System.Collections.Generic;
using System.Text;

namespace BuyOrWait.Application.Finances
{
    public record SettingsDto(decimal CurrentBalance, Decimal MinimumBalance);
    public record TransactionInput(string Description, decimal Amount, DateTime Date, bool IsRecurring);

    public record TransactionDto(int Id, string Description, decimal Amount, DateTime Date,bool IsRecurring);

    public record BuyOrWaitRequest(string ProductName, decimal Price);

    public record BuyOrWaitResponse(string Recommendation,string Explanation, decimal LowestProjectedBalance,IReadOnlyList<string> Trace, IReadOnlyList<BalancePointDto> TimeLine);

    public record BalancePointDto(int Day, decimal Balance);

 
}
