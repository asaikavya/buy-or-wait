using System;
using System.Collections.Generic;
using System.Text;

namespace BuyOrWait.Application.Forecasting
{
    public record BalancePoint(int Day, decimal Balance);

    public record ForecastResult(Recommendation Recommendation,
        decimal LowestProjectedBalance, IReadOnlyList<BalancePoint> Timeline);

}
