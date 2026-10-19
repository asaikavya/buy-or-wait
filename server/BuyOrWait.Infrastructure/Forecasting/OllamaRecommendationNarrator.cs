using BuyOrWait.Application.Forecasting;
using Microsoft.Extensions.Configuration;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.ChatCompletion;
using System;
using System.Collections.Generic;
using System.Net;
using System.Text;

namespace BuyOrWait.Infrastructure.Forecasting
{
    public class OllamaRecommendationNarrator : IRecommendationNarrator
    {
        private readonly IChatCompletionService _chat;

        public OllamaRecommendationNarrator(IConfiguration config)
        {
            var ollama = config.GetSection("Ollama");
# pragma warning disable SKEXP0010  
            var kernel = Kernel.CreateBuilder()
                             .AddOpenAIChatCompletion(
                                modelId: ollama["Model"]!,
                                endpoint: new Uri(ollama["Endpoint"]!),
                                apiKey: "not-needed")
                                 .Build();
            var model = ollama["Model"];

#pragma warning restore SKEXP0010

            _chat = kernel.GetRequiredService<IChatCompletionService>();
        }
        public async Task<string> NarrateAsync(ForecastRequest request, ForecastResult result)
        {
            var surplus = result.LowestProjectedBalance - request.MinimumBalance;
            var verdictPlain = result.Recommendation switch
            {
                Recommendation.PayNow => $"They can afford {request.Purchase.Name} now. After buying, their lowest balance over 90 days is {result.LowestProjectedBalance:C}, which stays above their minimum of {request.MinimumBalance:C} (a cushion of {surplus:C}).",
                Recommendation.PayPartial => $"They should pay part now rather than all at once. Paying in full would drop them too low, but a partial payment keeps their lowest balance ({result.LowestProjectedBalance:C}) above their minimum of {request.MinimumBalance:C}.",
                Recommendation.Installments => $"They should split {request.Purchase.Name} into installments. Paying in full would dip below their safe minimum, but spreading it out keeps their lowest balance ({result.LowestProjectedBalance:C}) above {request.MinimumBalance:C}.",
                Recommendation.Wait => $"They should wait before buying {request.Purchase.Name}. Even spread out, the purchase would push their lowest balance ({result.LowestProjectedBalance:C}) below their safe minimum of {request.MinimumBalance:C}.",
                _ => ""
            };

            var prompt = $"""
    Rewrite the following financial advice in 2 warm, friendly sentences addressed directly to the user as "you".
    Keep every number and fact exactly the same. Do not add new numbers, reasons, or suggestions.
    Output ONLY the two sentences. Do not include any preamble, introduction, or phrases like "Here is".

    Advice: {verdictPlain}
    """;
            var response = await _chat.GetChatMessageContentAsync(prompt);
            return response.Content ?? "";
        }
    }
}

