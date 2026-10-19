import { memo } from "react";
import type { Transaction } from "../financeApi";
import { formatCurrency, formatDate } from "../format";

type Props = {
  transaction: Transaction;
  isDeleting: boolean;
  onEdit: (id: number) => void;
  onDelete: (transaction: Transaction) => void;
};

function TransactionRow({ transaction: t, isDeleting, onEdit, onDelete }: Props) {
  const isIncome = t.amount >= 0;

  return (
    <li className="flex items-center justify-between gap-4 py-4">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <p className="truncate font-medium text-slate-900">{t.description}</p>
          {t.isRecurring && (
            <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
              Recurring
            </span>
          )}
        </div>
        <p className="mt-0.5 text-sm text-slate-500">{formatDate(t.date)}</p>
      </div>

      <div className="flex shrink-0 items-center gap-4">
        <span
          className={`font-semibold tabular-nums ${isIncome ? "text-green-700" : "text-red-700"}`}
        >
          {isIncome ? "+" : "−"}
          {formatCurrency(Math.abs(t.amount))}
        </span>
        <button
          type="button"
          onClick={() => onEdit(t.id)}
          disabled={isDeleting}
          aria-label={`Edit ${t.description}`}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-800 disabled:opacity-50"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(t)}
          disabled={isDeleting}
          aria-label={`Delete ${t.description}`}
          className="text-sm font-medium text-red-600 hover:text-red-800 disabled:opacity-50"
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </li>
  );
}

export default memo(TransactionRow);