using BuyOrWait.Application.Forecasting;
using System;
using System.Collections.Generic;
using System.Text;

namespace BuyOrWait.Tests.Forecasting
{
    public class ForecastEngineTests
    {
        // A helper so each test only states what's different from a normal baseline.
        private static ForecastRequest Request(
            decimal balance = 5000m, decimal minBalance = 1000m,
            decimal income = 6000m, decimal expenses = 4000m,
            decimal purchase = 500m)
            => new(balance, minBalance, income, expenses, new Purchase("Test item", purchase));

        [Fact]
        public void Small_purchase_that_stays_above_floor_says_pay_now()
        {
            var engine = new ForecastEngine();

            var result = engine.Analyze(Request(purchase: 500m));

            Assert.Equal(Recommendation.PayNow, result.Recommendation);
        }

        [Fact]
        public void Purchase_that_would_dip_below_floor_is_not_pay_now()
        {
            var engine = new ForecastEngine();

            // Balance 2000, floor 1000, buying 1500 in full would drop to ~500 immediately.
            var result = engine.Analyze(Request(balance: 2000m, purchase: 1500m));

            Assert.NotEqual(Recommendation.PayNow, result.Recommendation);
        }

        [Fact]
        public void Timeline_covers_ninety_one_days()
        {
            var engine = new ForecastEngine();

            var result = engine.Analyze(Request());

            Assert.Equal(91, result.Timeline.Count); // day 0 through day 90 inclusive
        }

        [Fact]
        public void Lowest_projected_balance_is_never_above_starting_balance()
        {
            var engine = new ForecastEngine();

            var result = engine.Analyze(Request(balance: 3000m, purchase: 800m));

            Assert.True(result.LowestProjectedBalance <= 3000m);
        }
    }
}
