import { useState } from "react";
import type { TransactionInput } from "../financeApi";
import { todayIso } from "../format";

type TransactionFormProps = {
  initial?: TransactionInput;                     // missing = empty "add" form
  submitLabel: string;                            // "Add" or "Save"
  isSubmitting: boolean;                          // parent tells us if a save is in progress
  onSubmit: (input: TransactionInput) => void;    // event up: "here's the data"
  onCancel?: () => void;                          // event up: "user cancelled" (edit only)
};

function TransactionForm({ initial, submitLabel, isSubmitting, onSubmit, onCancel }: TransactionFormProps) {
  const [description, setDescription] = useState(initial?.description ?? "");
  const [type, setType] = useState<"income" | "expense">(
    initial && initial.amount > 0 ? "income" : "expense"
  );
  const [amount, setAmount] = useState(initial ? String(Math.abs(initial.amount)) : "");
  const [date, setDate] = useState(initial ? initial.date.slice(0, 10) : todayIso());
  const [isRecurring, setIsRecurring] = useState(initial?.isRecurring ?? false);
  const [error, setError] = useState("");

  function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const value = Number(amount);
    if (description.trim() === "") {
      setError("Enter a description.");
      return;
    }
    if (amount === "" || isNaN(value) || value <= 0) {
      setError("Enter an amount greater than 0.");
      return;
    }
    if (date === "") {
      setError("Pick a date.");
      return;
    }

    // Event up: hand the parent clean data in the shape the API expects
    onSubmit({
      description: description.trim(),
      amount: type === "income" ? value : -value,
      date,
      isRecurring,
    });
  }

  const inputClass =
    "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20";

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-5">
        <input
          aria-label="Description"
          placeholder="Description (e.g. Rent)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={`${inputClass} sm:col-span-2`}
        />
        <select
          aria-label="Type"
          value={type}
          onChange={(e) => setType(e.target.value as "income" | "expense")}
          className={inputClass}
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <input
          aria-label="Amount"
          type="number"
          step="0.01"
          min="0"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className={inputClass}
        />
        <input
          aria-label="Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className={inputClass}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={isRecurring}
            onChange={(e) => setIsRecurring(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300"
          />
          Recurring (repeats monthly)
        </label>

        <div className="flex gap-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : submitLabel}
          </button>
        </div>
      </div>

      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
    </form>
  );
}

export default TransactionForm;