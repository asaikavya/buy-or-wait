import { useState } from "react";
import { useMutation,useQueryClient } from "@tanstack/react-query";
import { updateSettings,type Settings } from "../financeApi";

function SettingsForm({initial}:{initial:Settings}){

    const [currentBalance,setCurrentBalance] = useState(String(initial.currentBalance));
    const [minimumBalance,setMinimumBalance] = useState(String(initial.minimumBalance));
    const [formError,setFormError]= useState("");
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: updateSettings,
        onSuccess:() => queryClient.invalidateQueries({queryKey:["settings"]}),
    });
 

 function handleSubmit(e:React.SyntheticEvent<HTMLFormElement>){
    e.preventDefault();
    setFormError("");

    const balance = Number(currentBalance);
    const minimum = Number(minimumBalance);

    if(currentBalance==="" || minimumBalance==="" || isNaN(balance) || isNaN(minimum)){
        setFormError("Enter valid numbers for both the fields");
        return;
    }
    if(minimum<0){
        setFormError("Minimum balance should not be negative");
        return;
    }
    mutation.mutate({currentBalance:balance,minimumBalance:minimum});
 }

 const inputClass ="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20";

 return (
    <form onSubmit={handleSubmit} className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">

 <h2 className="text-lg font-semibold text-slate-900">Update your settings</h2>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="currentBalance" className="block text-sm font-medium text-slate-700">
            Current balance ($)
          </label>
          <input
            id="currentBalance"
            type="number"
            step="0.01"
            value={currentBalance}
            onChange={(e) => setCurrentBalance(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="minimumBalance" className="block text-sm font-medium text-slate-700">
            Minimum balance ($)
          </label>
          <input
            id="minimumBalance"
            type="number"
            step="0.01"
            min="0"
            value={minimumBalance}
            onChange={(e) => setMinimumBalance(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      {formError && <p role="alert" className="mt-3 text-sm text-red-600">{formError}</p>}
      {mutation.isError && <p role="alert" className="mt-3 text-sm text-red-600">Saving failed. Try again.</p>}
      {mutation.isSuccess && <p className="mt-3 text-sm text-green-700">Saved.</p>}

      <button
        type="submit"
        disabled={mutation.isPending}
        className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
      >
        {mutation.isPending ? "Saving..." : "Save"}
      </button>
    </form>
  );
}

export default SettingsForm;





