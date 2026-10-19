import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { analysePurchase } from "../buyOrWaitApi";
import { getSettings } from "../financeApi";
import AnalysisResult from "../components/AnalysisResult";

function BuyOrWait() {
  
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [formError, setFormError] = useState("");

  // Reuses the cached settings from the Finances page (same key → same cache)
  const { data: settings } = useQuery({ queryKey: ["settings"], queryFn: getSettings });

  // Runs only when the user clicks "Check"
  const analysis = useMutation({ mutationFn: analysePurchase });

  function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError("");

    const value = Number(price);
    if (productName.trim() === "") {
      setFormError("Enter what you want to buy.");
      return;
    }
    if (price === "" || isNaN(value) || value <= 0) {
      setFormError("Enter a price greater than 0.");
      return;
    }

    analysis.mutate({ productName: productName.trim(), price: value });
  }

  const inputClass =
    "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20";

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">Buy or wait?</h1>
      <p className="mt-1 text-sm text-slate-500">
        We'll project your balance for the next 90 days and check it against your safety floor.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <label htmlFor="productName" className="block text-sm font-medium text-slate-700">
              What do you want to buy?
            </label>
            <input
              id="productName"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="e.g. MacBook Pro"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-slate-700">
              Price ($)
            </label>
            <input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="2400"
              className={inputClass}
            />
          </div>
        </div>

        {formError && <p role="alert" className="mt-3 text-sm text-red-600">{formError}</p>}

        <button
          type="submit"
          disabled={analysis.isPending}
          className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {analysis.isPending ? "Analyzing..." : "Check"}
        </button>
      </form>

      {analysis.isPending && (
        <p className="mt-6 text-sm text-slate-500">
          Running your forecast. The AI explanation runs locally, so this can take a few seconds.
        </p>
      )}

      {analysis.isError && (
        <p role="alert" className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">
          Could not analyze this purchase. Check that the API is running and try again.
        </p>
      )}

      {analysis.data && analysis.variables && !analysis.isPending && (
        <AnalysisResult
          result={analysis.data}
          productName={analysis.variables.productName}
          price={analysis.variables.price}
          minimumBalance={settings?.minimumBalance}
        />
      )}
    </div>
  );
}

export default BuyOrWait;