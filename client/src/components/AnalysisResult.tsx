import type {  AnalyseResult,Recommendation  } from "../buyOrWaitApi";
import { formatCurrency } from "../format";
import BalanceChart from "./BalanceChart";

const VERDICTS : Record<Recommendation,{title :string,className:string}>={

PayNow: { title: "Buy it now", className: "bg-green-50 text-green-800 ring-green-200" },
PayPartial: { title: "Pay part now", className: "bg-amber-50 text-amber-800 ring-amber-200" },
Installments: { title: "Split into installments", className: "bg-blue-50 text-blue-800 ring-blue-200" },
Wait: { title: "Wait for now", className: "bg-red-50 text-red-800 ring-red-200" },
};

type AnalysisResultProps ={

    result:AnalyseResult;
    productName:string;
    price:number;
    minimumBalance?:number;
};

function AnalysisResult({result,productName,price,minimumBalance}:AnalysisResultProps){

    const verdict=VERDICTS[result.recommendation];
      const cushion = minimumBalance !== undefined ? result.lowestProjectedBalance - minimumBalance : undefined;

  return (
    <div className="mt-6 space-y-4">
      {/* Verdict */}
      <div className={`rounded-2xl p-6 ring-1 ${verdict.className}`}>
        <p className="text-sm font-medium opacity-80">
          {productName} · {formatCurrency(price)}
        </p>
        <p className="mt-1 text-2xl font-semibold">{verdict.title}</p>
        <p className="mt-3 whitespace-pre-line text-sm leading-relaxed">{result.explanation}</p>
      </div>

      {/* Key numbers */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm text-slate-500">Lowest projected balance</p>
          <p className="mt-1 text-xl font-semibold text-slate-900">
            {formatCurrency(result.lowestProjectedBalance)}
          </p>
        </div>
        {minimumBalance !== undefined && (
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">Your safety floor</p>
            <p className="mt-1 text-xl font-semibold text-slate-900">{formatCurrency(minimumBalance)}</p>
          </div>
        )}
        {cushion !== undefined && (
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">Cushion above floor</p>
            <p className={cushion >= 0 ? "mt-1 text-xl font-semibold text-green-700" : "mt-1 text-xl font-semibold text-red-600"}>
              {formatCurrency(cushion)}
            </p>
          </div>
        )}
      </div>

      {/* Trace: how the decision was made */}
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <BalanceChart timeLine={result.timeLine} minimumBalance={minimumBalance} />
        <h3 className="text-sm font-semibold text-slate-900">How we got this answer</h3>
        <ol className="mt-4 space-y-3">
          {result.trace.map((step, index) => (
            <li key={index} className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-xs font-semibold text-indigo-700">
                {index + 1}
              </span>
              <span className="text-sm text-slate-700">{step}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export default AnalysisResult;