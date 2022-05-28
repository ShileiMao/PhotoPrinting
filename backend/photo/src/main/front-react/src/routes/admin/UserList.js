import React, { useEffect, useState } from 'react'
import AdminPageHeader from '../../Components/AdminPageHeader';
import { AlertDialog } from '../../Components/AlertDialog';
import { getUsers } from '../../utils/apiHelper';
import ToastHelper from '../../utils/toastHelper';

export default function UserList() {
  const getUserRow = (user) => {
    return (
      <tr key={user.id}>
      <td>{user.id}</td>
      <td>{user.name}</td>
      <td>{user.loginName}</td>
      <td>{user.userType}</td>
  </tr>
    )
  }

  const [userList, setUserList] = useState([]);
  
  const routes = [
    {
      path: "/admin",
      title: "首页"
    },
    {
      path: "/admin/users",
      title: "用户列表"
    }];


  useEffect(() => {
    console.log("--- use effect ---")
    const getUserList = async () => {
      const userList = await getUsers();
      if(userList.status.toLowerCase() !== 'success') {
        ToastHelper.showError("加载信息失败！")
        return;
      }

      setUserList(userList.data);
    }
    getUserList().catch(console.error);
  }, []);


  return (
    <div>
        <AdminPageHeader title={"订单"} subRoutes={routes} />
        <div className='row'>
          <div className="section card">
            <h5 className="card-title">订单列表</h5>
            
            <div className='dataTable-wrapper dataTable-loading no-footer sortable searchable fixed-columns'>
              <div className="container dataTable-top">              
              </div>

              <br />
              <table className="table table-sm">
                  <thead>
                  <tr>
                      {/* <th>选择</th> */}
                      <th>ID</th>
                      <th>用户名</th>
                      <th>登陆名</th>
                      <th>用户类别</th>
                      {/* <th>操作</th> */}
                  </tr>
                  </thead>
                  <tbody>
                  {
                    userList.map( (item, index) => {
                        return getUserRow(item)
                    })
                  }
                  
                  </tbody>
              </table>
            {/* </div>
              <nav aria-label="Page navigation example">
                  <ul className="pagination">
                      <li className={(this.state.pageInfo && !this.state.pageInfo.hasPreviousPage ? "disabled page-item" : "page-item")}>
                          <a className="page-link" href="#!" onClick={this.prePage}>上一页</a>
                      </li>
                      
                      <li className={ this.state.pageInfo && !this.state.pageInfo.hasNextPage ? "disabled page-item" : "page-item"}>
                          <a className="page-link" href="#!" onClick={this.nextPage}>下一页</a>
                      </li>
                  </ul>
              </nav>
          </div> */}
        </div>

        {/*
          this.state.showConfirmDialog &&
          <AlertDialog title={"提示"} message={"确认删除？"} confirm={this.confirmDelete} cancel={this.dismissDialog}></AlertDialog>
          */
        }
      </div>
      </div>
    </div>
  )
}
