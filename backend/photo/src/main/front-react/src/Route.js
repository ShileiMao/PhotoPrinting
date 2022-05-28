import { Routes, Route } from "react-router-dom";
import { QueryOrder } from "./routes/order/QueryOrder";
import { Orderlist } from "./routes/order/Orderlist"
import { NotFound } from './routes/NotFound'
import { Login } from "./routes/admin/Login";
import { MainLayout } from "./layouts/MainLayout";
import { AdminLayout } from "./layouts/AdminLayout";
import { useState } from "react";
import AdminOrderList from "./routes/admin/AdminOrderList";
import AdminOrderDtails from './routes/admin/AdminOrderDetails'
import AdminAddOrder from "./routes/admin/AdminAddOrder";
import ProtectedRoute from "./routes/ProtectedRote";
import { getLoggedInUser, ifLoggedIn } from "./utils/apiHelper";
import { EmptyLayout } from "./layouts/EmptyLayout";
import InputOrder from "./routes/order/InputOrder";
import { PrintLayout } from "./routes/photosLayouts/PrintLayout";
import AccountSettings from "./routes/admin/AccountSettings";
import { CreateAccount } from "./routes/admin/CreateAccount";
import UserList from "./routes/admin/UserList";


export const AppRouter = ({showModal}) => {
  const onChange = () => {
    console.log("route changed")
  }

  const loggedInUser = getLoggedInUser();
  const [user, setUser] = useState(loggedInUser);

  return (
    <Routes>
      <Route path="" element={<EmptyLayout />}>
        <Route path="" element={<QueryOrder />} />
        <Route path="/admin" element={ <Login setUser={setUser} />} />
      </Route>

      <Route element={<MainLayout />} onChange={onChange}>
        
        <Route path="/order" element={<QueryOrder />} />
        <Route path="/order/:orderNum" element={<Orderlist />} />
        <Route path="/order/edit/:orderNum" element={<InputOrder isEditing={true} />} />
        <Route path="/order/add" element={<InputOrder isEditing={false} />} />
      </Route>
    
      
      <Route path="/admin" element={<AdminLayout user={user}/>}>
        {/* <Route path="" element={<Login setUser={setUser} />}>
        </Route> */}
        <Route path="orders">
          <Route path="" element={<ProtectedRoute checkLogin={ifLoggedIn} redirectPath="/admin"> <AdminOrderList showModal={showModal} /></ProtectedRoute>} />
          <Route path=":orderNum" element={ <ProtectedRoute checkLogin={ifLoggedIn} ><AdminOrderDtails /></ProtectedRoute>  } />
          <Route path="add" element={ <ProtectedRoute checkLogin={ifLoggedIn}><AdminAddOrder /></ProtectedRoute> } />
          <Route path="edit/:orderNum" element={ <ProtectedRoute checkLogin={ifLoggedIn}><AdminAddOrder isEditing={true} /></ProtectedRoute> } />
        </Route>

        <Route path="/admin/accountSettings" 
          element={
            <ProtectedRoute checkLogin={ifLoggedIn}>
              <AccountSettings />
            </ProtectedRoute>
          }
        />

        <Route path="user/add" element={ <ProtectedRoute checkLogin={ifLoggedIn}> <CreateAccount /> </ProtectedRoute> } />
        <Route path="users" element={ <ProtectedRoute checkLogin={ifLoggedIn}> <UserList /> </ProtectedRoute> } />
      </Route>
      
      <Route path="print/test/:orderNumber" element={<PrintLayout />}></Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
