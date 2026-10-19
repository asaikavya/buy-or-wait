import {BrowserRouter,Routes,Route,Navigate} from "react-router-dom";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./auth/AuthContext";
import AppLayout from "./components/AppLayout";

import { lazy } from "react";
const Finances = lazy(() => import("./pages/Finances"));
const BuyOrWait = lazy(() => import("./pages/BuyOrWait"));


function App(){
   return (
      <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path ="/" element= {<Navigate to = "/Login" replace/>}/>
          <Route path ="/login" element ={<Login/>}/>

 {/* Layout route: no path. Protects AND frames every page inside it. */}

    <Route element ={
      <ProtectedRoute>
        <AppLayout/>
      </ProtectedRoute>
    }
    >
      <Route path= "/finances" element ={<Finances/>} />
      <Route path ="/buy-or-wait" element ={<BuyOrWait/>}/>
    </Route>
         
          <Route path ="*" element= {<Navigate to = "/Login" replace/>}/>
        </Routes>
    </AuthProvider>
      </BrowserRouter>
   );

}

export default App;