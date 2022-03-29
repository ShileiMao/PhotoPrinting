import { BrowserRouter, Routes, Route, Router, useNavigate, Link } from "react-router-dom";
import App from "./App";
import { QueryOrder } from "./routes/order/QueryOrder";
import { Orderlist } from "./routes/order/Orderlist"
import { NotFound } from './routes/NotFound'
import { Login } from "./routes/admin/Login";
import { MainLayout } from "./layouts/MainLayout";
import { AdminLayout } from "./layouts/AdminLayout";
import { createBrowserHistory } from "history";
import { useEffect, useState } from "react";
import AdminOrderList from "./routes/admin/AdminOrderList";
import AdminOrderDtails from './routes/admin/AdminOrderDetails'
import AdminAddOrder from "./routes/admin/AdminAddOrder";
import ProtectedRoute from "./routes/ProtectedRote";
import { getToken } from "./utils/token";
import TOKEN_KEYS from "./utils/consts";
import { ifLoggedIn } from "./utils/apiHelper";


export const AppRouter = () => {
  const onChange = () => {
    console.log("route changed")
  }

  const [user, setUser] = useState(null);

  return (
    <Routes>
       <Route element={<MainLayout />} onChange={onChange}>
        <Route path="/" element={<QueryOrder />} />
        <Route path="/queryOrder" element={<QueryOrder />} />
        <Route path="/queryOrder/:orderNum" element={<Orderlist />} />
       </Route>
      
       <Route path="/admin" element={<AdminLayout />}>
        <Route path="" element={<Login setUser={setUser} />}>
        </Route>
        <Route path="orders" element={ <ProtectedRoute checkLogin={ifLoggedIn} redirectPath="/admin">
          <AdminOrderList />
        </ProtectedRoute>} />
        <Route path="orders/detail/:orderNum" element={ <ProtectedRoute checkLogin={ifLoggedIn} ><AdminOrderDtails /></ProtectedRoute>  } />
        <Route path="orders/add" element={ <ProtectedRoute checkLogin={ifLoggedIn}><AdminAddOrder /></ProtectedRoute> } />
       </Route>
        
        <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
