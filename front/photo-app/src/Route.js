import { BrowserRouter, Routes, Route, Router, useNavigate } from "react-router-dom";
import App from "./App";
import { QueryOrder } from "./routes/order/QueryOrder";
import { Orderlist } from "./routes/order/Orderlist"
import { NotFound } from './routes/NotFound'
import { Login } from "./routes/admin/Login";
import { MainLayout } from "./layouts/MainLayout";
import { AdminLayout } from "./layouts/AdminLayout";
import { createBrowserHistory } from "history";
import { useState } from "react";
import AdminOrderList from "./routes/admin/AdminOrderList";
import AdminOrderDtails from './routes/admin/AdminOrderDetails'


export const AppRouter = () => {
  const onChange = () => {
    console.log("route changed")
  }

  const [currentOrder, setCurrentOrder] = useState({});

  return (
    <Routes>
       <Route element={<MainLayout />} onChange={onChange}>
        <Route path="/" element={<QueryOrder />} />
        <Route path="/queryOrder" element={<QueryOrder />} />
        <Route path="/queryOrder/:orderNum" element={<Orderlist />} />
       </Route>
      
       <Route path="/admin" element={<AdminLayout />}>
        <Route path="" element={<Login />}>
        </Route>
        <Route path="orders" element={<AdminOrderList selectOrder={setCurrentOrder} />} />
        <Route path="orders/detail" element={<AdminOrderDtails order={currentOrder}/> } />
       </Route>
        
        <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
