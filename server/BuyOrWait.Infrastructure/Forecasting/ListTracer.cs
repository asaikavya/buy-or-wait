

using BuyOrWait.Application.Forecasting;


namespace BuyOrWait.Infrastructure.Forecasting
{
    public class ListTracer : ITracer
    {
        private readonly List<string> _steps = new();

        public void Add(string step)=>_steps.Add(step);

        public IReadOnlyList<string> steps => _steps;
    }
}
