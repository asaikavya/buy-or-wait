using System;
using System.Collections.Generic;
using System.Text;

namespace BuyOrWait.Application.Forecasting
{
    public interface IRecommendationNarrator
    {
        Task<string> NarrateAsync(ForecastRequest request, ForecastResult result);
    }
}
