import React, { Component } from 'react'
import AdminPageHeader from '../../Components/AdminPageHeader'
import { OrderRow } from '../../Components/OrderRow'
import { loadOrders, loadOrdersPage } from '../../utils/apiHelper'
import { withRouter } from '../../utils/react-router'

class AdminOrderList extends Component {
  constructor(props) {
      super(props)
      this.state = {
          data: [],
          pageInfo: null,
          selectAll: false,
          orderBy: null,
          desc: false,
          searchBy: null,
          searchStatus: null,
          pageIndex: 1,
          pageSize: 10,
          startDate: null,
          endDate: null,
      }
      this.loadTable = this.loadTable.bind(this);
      this.deleteSelected = this.deleteSelected.bind(this);
      this.selectAll = this.selectAll.bind(this);
      this.toggleOrderCheck = this.toggleOrderCheck.bind(this);
      this.inputSearchText = this.inputSearchText.bind(this);
      this.prePage = this.prePage.bind(this);
      this.nextPage = this.nextPage.bind(this);
  }

  async loadTable(pageIndex) {
    let searchStatus = 0;
    if(this.state.searchStatus !== null) {
      searchStatus = this.state.searchStatus.dbValue;
    }

    const result = await loadOrdersPage(
        searchStatus,
        pageIndex, 
        this.state.pageSize, 
        this.state.orderBy, 
        this.state.desc, 
        this.state.searchBy, 
        this.state.startDate, 
        this.state.endDate);

    console.log("error loading order: ");
    if(result.status.toLowerCase() === 'error') {
        console.log("error loading order: " + result.error);
        return;
    }

    // 如果页面变化，重置全选标记
    const resetFlag = (this.pageIndex === pageIndex) ? this.state.selectAll : false;
    this.setState({
        data: result.data.list,
        pageInfo: result.data,
        pageIndex: pageIndex,
        selectAll: resetFlag
    })
    console.log("table data: " + this.state.data.length)
  }

  async deleteSelected() {
    const selectedOrders = this.state.data.filter(item => {
      return item.checked === true;
    })

    console.log("delete selected clicked, checkedItems: " + JSON.stringify(selectedOrders));
  }

  selectAll() {
    const allSelected = this.state.data.map(item => {
      item.checked = !this.state.selectAll;
      return item;
    });

    this.setState({
      data: allSelected,
      selectAll: !this.state.selectAll
    });
  }

  toggleOrderCheck(order) {
    let allOrders = this.state.data;
    let order1 = this.state.data.find(item => {
      return item.id === order.id;
    })
    if(order1 !== null) {
      order1.checked === undefined ? order1.checked = true : order1.checked = !order1.checked;
    }
    this.setState({
      data: allOrders
    });
  }

  inputSearchText(event) {
    console.log("input search text: " + event.target.value);
    this.setState({
      searchBy: event.target.value
    });
  }

  componentDidMount() {
    this.loadTable(1)
  }

  nextPage() {
    let nextPage = this.state.pageIndex;
    if(this.state.pageInfo != null && this.state.pageInfo.hasNextPage) {
      nextPage = nextPage + 1;
    }
    this.loadTable(nextPage);
  }

  prePage() {
    const previousPage = this.state.pageIndex - 1;
    if(previousPage <= 0) {
      this.loadTable(1);
    } else {
      this.loadTable(previousPage);
    }
    
  }

  render() {
    const routes = [
      {
        path: "/admin",
        title: "首页"
      },
      {
        path: "/admin/orders",
        title: "订单"
      }];

    return (
      <div>
        <AdminPageHeader title={"订单"} subRoutes={routes} />
        <div className='row'>
          <div className="section card">
            <h5 className="card-title">订单列表</h5>
            
            <div className='dataTable-wrapper dataTable-loading no-footer sortable searchable fixed-columns'>
              <div className="dataTable-top">              
                <div>
                  <button className='btn btn-secondary btn-sm' onClick={this.selectAll}>全选</button>
                  <button className='btn btn-primary btn-sm' onClick={this.deleteSelected}>删除</button>
                </div>
                <div className='dataTable-search'>
                  <input className="dataTable-input" placeholder="Search..." type="text" onChange={this.inputSearchText} />
                </div>
              </div>
              <table className="table table-sm">
                  <thead>
                  <tr>
                      <th>选择</th>
                      <th>ID</th>
                      <th>名称</th>
                      <th>描述</th>
                      <th>打印张数</th>
                      <th>用户名</th>
                      <th>电话</th>
                      <th>地址</th>
                      <th>日期</th>
                      <th>状态</th>
                      <th>操作</th>
                  </tr>
                  </thead>
                  <tbody>
                  {
                    this.state.pageInfo &&
                      this.state.pageInfo.list.map( (item, index) => {
                          return <OrderRow order={item} props={this.props} key={item.id} selectOrder={this.props.selectOrder} toggleCheck={this.toggleOrderCheck} />
                      })
                  }
                  
                  </tbody>
              </table>
            </div>
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
        
          </div>
        </div>
      </div>

      // <main id="main" className="main">

      //   <div className="pagetitle">
      //     <h1>General Tables</h1>
      //     <nav>
      //       <ol className="breadcrumb">
      //         <li className="breadcrumb-item"><a href="index.html">Home</a></li>
      //         <li className="breadcrumb-item">Tables</li>
      //         <li className="breadcrumb-item active">General</li>
      //       </ol>
      //     </nav>
      //   </div>

      //   <section className="section">
      //     <div className="row">
            
      //         <div>
      //           <div className="card-body">
      //             <h5 className="card-title">Default Table</h5>


      //             <table className="table">
      //               <thead>
      //                 <tr>
      //                   <th scope="col">#</th>
      //                   <th scope="col">Name</th>
      //                   <th scope="col">Position</th>
      //                   <th scope="col">Age</th>
      //                   <th scope="col">Start Date</th>
      //                 </tr>
      //               </thead>
      //               <tbody>
      //                 <tr>
      //                   <th scope="row">1</th>
      //                   <td>Brandon Jacob</td>
      //                   <td>Designer</td>
      //                   <td>28</td>
      //                   <td>2016-05-25</td>
      //                 </tr>
      //                 <tr>
      //                   <th scope="row">2</th>
      //                   <td>Bridie Kessler</td>
      //                   <td>Developer</td>
      //                   <td>35</td>
      //                   <td>2014-12-05</td>
      //                 </tr>
      //                 <tr>
      //                   <th scope="row">3</th>
      //                   <td>Ashleigh Langosh</td>
      //                   <td>Finance</td>
      //                   <td>45</td>
      //                   <td>2011-08-12</td>
      //                 </tr>
      //                 <tr>
      //                   <th scope="row">4</th>
      //                   <td>Angus Grady</td>
      //                   <td>HR</td>
      //                   <td>34</td>
      //                   <td>2012-06-11</td>
      //                 </tr>
      //                 <tr>
      //                   <th scope="row">5</th>
      //                   <td>Raheem Lehner</td>
      //                   <td>Dynamic Division Officer</td>
      //                   <td>47</td>
      //                   <td>2011-04-19</td>
      //                 </tr>
      //               </tbody>
      //             </table>
                  
      //           </div>
      //         </div>
      //     </div>
      //   </section>
      // </main>
    )
  }
}


export default withRouter(AdminOrderList);