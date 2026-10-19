using System;
using System.Collections.Generic;
using System.Text;

namespace BuyOrWait.Application.Forecasting
{
    public class ForecastEngine
    {
        public ForecastResult Analyze(ForecastRequest request)
        {
            var amount = request.Purchase.Amount;

            // Try payment plans from most aggressive to gentlest; take the first that stays safe.
            var payNow = Project(request, new[] { (0, amount) });
            if (payNow.Lowest >= request.MinimumBalance)
                return Result(Recommendation.PayNow, payNow);

            var half = amount / 2m;
            var partial = Project(request, new[] { (0, half), (45, half) });
            if (partial.Lowest >= request.MinimumBalance)
                return Result(Recommendation.PayPartial, partial);

            var third = amount / 3m;
            var installments = Project(request, new[] { (0, third), (30, third), (60, third) });
            if (installments.Lowest >= request.MinimumBalance)
                return Result(Recommendation.Installments, installments);
            // Nothing stays above the floor — show the no-purchase trend so they see when it recovers.
            var wait = Project(request, Array.Empty<(int, decimal)>());
            return Result(Recommendation.Wait, wait);
        }
        private static (IReadOnlyList<BalancePoint> Timeline, decimal Lowest) Project(ForecastRequest request, IEnumerable<(int Day, decimal Amount)> charges)
        {
            decimal dailyNet = (request.MonthlyIncome - request.MonthlyExpenses) / 30m;

            var chargesByDay = charges
                .GroupBy(c => c.Day)
                .ToDictionary(g => g.Key, g => g.Sum(c => c.Amount));

            var timeline = new List<BalancePoint>();
            decimal balance = request.CurrentBalance;
            decimal lowest = balance;

            for (int day = 0; day <= 90; day++)
            {
                if (day > 0) balance += dailyNet;                       // a day of normal cash flow
                if (chargesByDay.TryGetValue(day, out var charge))
                    balance -= charge;                                  // a purchase payment lands

                timeline.Add(new BalancePoint(day, balance));
                if (balance < lowest) lowest = balance;
            }

            return (timeline, lowest);
        }

        private static ForecastResult Result(
            Recommendation rec, (IReadOnlyList<BalancePoint> Timeline, decimal Lowest) p)
            => new(rec, p.Lowest, p.Timeline);
    }

}


