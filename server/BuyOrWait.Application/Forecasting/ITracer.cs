using System;
using System.Collections.Generic;
using System.Text;

namespace BuyOrWait.Application.Forecasting
{
    public interface ITracer
    {
        void Add(string step);
        IReadOnlyList<string> steps { get; }
        
    }
}