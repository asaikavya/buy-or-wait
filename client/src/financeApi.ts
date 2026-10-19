import { apiFetch } from "./api";

export type Settings={
        currentBalance:number;
        minimumBalance:number;
}

export type Transaction={
    id:number;
    description:string;
    amount:number;
    date:string;
    isRecurring:boolean;

}

export type TransactionInput = Omit<Transaction,"id">;

export function getTransactions() {
  return apiFetch<Transaction[]>("/api/finance/transactions"); //an array of transactions
}

export function deleteTransaction(id: number) {
  return apiFetch<void>(`/api/finance/transactions/${id}`, { method: "DELETE" }); // returns 204 so there is nothing to parse
}
export function getSettings(){
    return apiFetch<Settings>("/api/finance/settings");
}
export function updateSettings(settings:Settings){

    return apiFetch<Settings>("/api/finance/settings",{
        method:"PUT",
        body:JSON.stringify(settings)

    });

}

export function addTransaction(input:TransactionInput){
    return apiFetch<Transaction>("/api/finance/transactions",{
        method:"POST",
        body : JSON.stringify(input),
});
}

export function updateTransaction(id:number,input:TransactionInput){
    return apiFetch<Transaction>(`/api/finance/transactions/${id}`,{
            method:"PUT",
            body :JSON.stringify(input),
    });
}



