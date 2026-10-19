import { apiFetch } from "./api";

export type Recommendation= "PayNow" | "PayPartial" | "Installments" |"Wait";

export type AnalyseRequest ={
    price: number,
    productName:string,
};

export type BalancePoint={
    day:number,
    balance:number
};

export type AnalyseResult={
      recommendation: Recommendation;
  explanation: string;
  lowestProjectedBalance: number;
  trace: string[];
  timeLine: BalancePoint[]; 
};

export function analysePurchase(request:AnalyseRequest){
    return apiFetch<AnalyseResult>("/api/buyorwait/analyze",{
        method:"POST",
        body:JSON.stringify(request),
    });
}