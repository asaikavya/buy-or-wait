import { useCallback, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addTransaction,
  deleteTransaction,
  getTransactions,
  updateTransaction,
  type Transaction,
  type TransactionInput,
} from "../financeApi";
import TransactionForm from "./TransactionForm";
import TransactionRow from "./TransactionRow";

const TRANSACTIONS_KEY = ["transactions"] as const;

export default function Transactions() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [addFormKey, setAddFormKey] = useState(0);

  const { data: transactions, isPending, isError } = useQuery({
    queryKey: TRANSACTIONS_KEY,
    queryFn: getTransactions,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: TRANSACTIONS_KEY });

  const addMutation = useMutation({
    mutationFn: addTransaction,
    onSuccess: async () => {
      await invalidate();               // stay "pending" until the fresh list arrives
      setAddFormKey((k) => k + 1);      // new key = brand-new empty form
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: number; input: TransactionInput }) =>
      updateTransaction(id, input),
    onSuccess: async () => {
      await invalidate();
      setEditingId(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => invalidate(),
  });

  // The mutation OBJECTS are new every render, but mutate/reset are stable.
  // Pull out only the stable functions so useCallback deps stay stable.
  const { mutate: deleteTx } = deleteMutation;
  const { reset: resetUpdate } = updateMutation;

  // Passed to the memoized row → must be stable → useCallback.
  const handleEdit = useCallback(
    (id: number) => {
      resetUpdate();          // clear an old "save failed" message from another row
      setEditingId(id);
    },
    [resetUpdate]
  );

  const handleDelete = useCallback(
    (t: Transaction) => {
      if (window.confirm(`Delete "${t.description}"? This can't be undone.`)) {
        deleteTx(t.id);
      }
    },
    [deleteTx]
  );

  // A primitive per row: only the row being deleted sees `true`.
  const deletingId = deleteMutation.isPending ? deleteMutation.variables : undefined;

  let list: React.ReactNode;
  if (isPending) {
    list = <p className="py-6 text-sm text-slate-500">Loading entries...</p>;
  } else if (isError) {
    list = (
      <p role="alert" className="py-6 text-sm text-red-600">
        Could not load your entries. Refresh to try again.
      </p>
    );
  } else if (transactions.length === 0) {
    list = (
      <p className="py-6 text-sm text-slate-500">
        No entries yet. Add your salary and regular bills above.
      </p>
    );
  } else {
    list = (
      <ul className="divide-y divide-slate-100">
        {transactions.map((t) =>
          editingId === t.id ? (
            <li key={t.id} className="py-4">
              <TransactionForm
                initial={t}
                submitLabel="Save"
                isSubmitting={updateMutation.isPending}
                onSubmit={(input) => updateMutation.mutate({ id: t.id, input })}
                onCancel={() => setEditingId(null)}
              />
              {updateMutation.isError && (
                <p role="alert" className="mt-2 text-sm text-red-600">
                  Could not save changes. Please try again.
                </p>
              )}
            </li>
          ) : (
            <TransactionRow
              key={t.id}
              transaction={t}
              isDeleting={deletingId === t.id}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )
        )}
      </ul>
    );
  }

  return (
    <section className="mt-10">
      <h2 className="text-lg font-semibold text-slate-900">Monthly income & expenses</h2>
      <p className="mt-1 text-sm text-slate-500">
        Your regular monthly cash flow, used for the 90-day forecast. These don't change
        your current balance.
      </p>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-6">
        <h3 className="mb-4 font-medium text-slate-900">Add an entry</h3>
        <TransactionForm
          key={addFormKey}
          submitLabel="Add"
          isSubmitting={addMutation.isPending}
          onSubmit={(input) => addMutation.mutate(input)}
        />
        {addMutation.isError && (
          <p role="alert" className="mt-3 text-sm text-red-600">
            Could not add the entry. Please try again.
          </p>
        )}
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white px-6">
        {list}
        {deleteMutation.isError && (
          <p role="alert" className="pb-4 text-sm text-red-600">
            Could not delete the entry. Please try again.
          </p>
        )}
      </div>
    </section>
  );
}