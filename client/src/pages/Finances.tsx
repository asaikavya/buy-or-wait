import { useQuery } from "@tanstack/react-query";
import { getSettings } from "../financeApi";
import { formatCurrency } from "../format";
import SettingsForm from "../components/SettingsForm";
import  Transactions from "../components/Transactions";

function Finances() {
  const { data: settings, isPending, isError } = useQuery({
    queryKey: ["settings"],
    queryFn: getSettings,
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">Your finances</h1>
      <p className="mt-1 text-sm text-slate-500">Balance, minimum balance, and transactions.</p>

      {isPending && <p className="mt-6 text-sm text-slate-500">Loading your settings...</p>}

      {isError && (
        <p role="alert" className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">
          Could not load your settings.
        </p>
      )}

      {settings && (
        <>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <p className="text-sm text-slate-500">Current balance</p>
              <p className="mt-1 text-3xl font-semibold text-slate-900">
                {formatCurrency(settings.currentBalance)}
              </p>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <p className="text-sm text-slate-500">Minimum balance (safety floor)</p>
              <p className="mt-1 text-3xl font-semibold text-slate-900">
                {formatCurrency(settings.minimumBalance)}
              </p>
            </div>
          </div>

          <SettingsForm initial={settings} />
        </>
      )}
      <Transactions/>
    </div>
  );
}

export default Finances;