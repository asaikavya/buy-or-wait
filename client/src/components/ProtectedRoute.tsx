import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

function ProtectedRoute({children}:{children:React.ReactNode}){
    //const token=localStorage.getItem("token");
    const {isLoggedIn}= useAuth();
    
    if(!isLoggedIn){
        return <Navigate to="/Login" replace />;
    }
    return <>{children}</>
}
export default ProtectedRoute;