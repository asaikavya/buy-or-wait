    using BuyOrWait.Application.Finances;
using BuyOrWait.Application.Forecasting;
using BuyOrWait.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BuyOrWait.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class BuyOrWaitController : APIControllerBase
    {
        private readonly AppDbContext _db;
        private readonly IRecommendationNarrator _narrator;
        private readonly ITracer _tracer;
        public BuyOrWaitController(AppDbContext db, IRecommendationNarrator narrator,ITracer tracer)
        {
            _db = db;
            _narrator = narrator;
            _tracer = tracer;

        }
        [HttpPost("analyze")]
        public async Task<IActionResult> Analyze(BuyOrWaitRequest request)
        {
            var settings = await _db.UserSettings.FirstOrDefaultAsync(s => s.UserId == CurrentUserId);

            var transactions= await _db.Transactions.Where(t=>t.UserId==CurrentUserId).ToListAsync();

            decimal balance = settings?.CurrentBalance ?? 0m;
            decimal minibalance = settings?.MinimumBalance ?? 0m;
            _tracer.Add($"Loaded your current balance: {balance:C} (minimum {minibalance:C}).");
            decimal monthlyIncome=transactions.Where(t=>t.Amount>0).Sum(t => t.Amount);
            decimal monthlyExpenses=transactions.Where(t=>t.Amount<0).Sum(t => t.Amount);
            _tracer.Add($"Summed transactions — income {monthlyIncome:C}, expenses {monthlyExpenses:C}.");

            var forecastRequest = new ForecastRequest(
                CurrentBalance: balance,
                MinimumBalance: minibalance,
                MonthlyIncome: monthlyIncome,
                MonthlyExpenses: monthlyExpenses,
                Purchase: new Purchase(request.ProductName, request.Price)      
                );

            var engine = new ForecastEngine();
            var result = engine.Analyze(forecastRequest);


            _tracer.Add($"Projected your balance over 90 days for {request.ProductName} ({request.Price:C}).");
            _tracer.Add($"Lowest projected balance: {result.LowestProjectedBalance:C}.");
            _tracer.Add($"Compared to your minimum of {minibalance:C} → recommendation: {result.Recommendation}.");

            var timeline= result.Timeline.Select(p => new BalancePointDto(p.Day, p.Balance)).ToList();

            string explanation;
            try
            {
                explanation = await _narrator.NarrateAsync(forecastRequest, result);
            }
            catch
            {
                explanation = $"Recommendation: {result.Recommendation}. (AI explanation unavailable.)";
            }

            var response = new BuyOrWaitResponse(Recommendation: result.Recommendation.ToString(), 
                                                 Explanation: explanation,
                                         LowestProjectedBalance: result.LowestProjectedBalance,
                                         Trace: _tracer.steps,
                                         TimeLine: timeline);

            return Ok(response);

        }
    

    }
}
