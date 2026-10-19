const API_URL = import.meta.env.VITE_API_URL;

export class ApiError extends Error{
    status:number;
    constructor(status:number,message:string){
        super(message);
        this.status=status;
    }
}

export async function apiFetch<T>(path:string, options: RequestInit ={}): Promise<T>{

const token= localStorage.getItem("token");

const response = await fetch(`${API_URL}${path}`,{
                ...options,
                headers:
                    {
                        "Content-type":"application/json",
                             ...(token? {Authorization: `Bearer ${token}`}:{}),
                             ...options.headers,
                },  


});

if(response.status==401 && token){
    localStorage.removeItem("token");
    window.location.href ="/login";
    throw new ApiError(401,"Session Expired");
}
if(!response.ok){
    throw new ApiError(response.status,`Request failed with status ${response.status}`);
}

if(response.status==204){
    return undefined as T;
}

return response.json() as Promise<T>;
}