import React, { Component } from 'react'
import AdminPageHeader from '../../Components/AdminPageHeader'
import { OrderRow } from '../../Components/OrderRow'
import { deleteOrders, loadOrders, loadOrdersPage } from '../../utils/apiHelper'
import { withRouter } from '../../utils/react-router'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import { Col, Container, Row, ToastHeader } from 'react-bootstrap'
import DateUtils from '../../utils/DateUtils'
import SortableTableHeader from '../../Components/SortableTableHeader'
import { OrderStatus } from '../../config/Consts'
import ToastHelper from '../../utils/toastHelper'

class AdminOrderList extends Component {
  constructor(props) {
      super(props)

      let dateUtils = new DateUtils();
      let endOfDay = dateUtils.getEndOfDay();

      dateUtils.setMonth(-1, true);
      let startOfMonth = dateUtils.getStartOfDay();

      this.state = {
          data: [],
          pageInfo: null,
          selectAll: false,
          orderBy: null,
          desc: false,
          searchBy: null,
          searchStatus: 0,
          pageIndex: 1,
          pageSize: 10,
          startDate: startOfMonth,
          endDate: endOfDay,
      }
      this.loadTable = this.loadTable.bind(this);
      this.deleteSelected = this.deleteSelected.bind(this);
      this.selectAll = this.selectAll.bind(this);
      this.toggleOrderCheck = this.toggleOrderCheck.bind(this);
      this.inputSearchText = this.inputSearchText.bind(this);
      this.onOrderStatusChange = this.onOrderStatusChange.bind(this);
      this.onKeyDownSearchBar = this.onKeyDownSearchBar.bind(this);
      this.onBeginDateChange = this.onBeginDateChange.bind(this);
      this.onEndDateChange = this.onEndDateChange.bind(this);
      this.onSearchButtonClicked = this.onSearchButtonClicked.bind(this);
      this.onSortChanged = this.onSortChanged.bind(this);
      this.prePage = this.prePage.bind(this);
      this.nextPage = this.nextPage.bind(this);
  }

  async loadTable(pageIndex) {
    const searchStatus = this.state.searchStatus;

    const startDate = this.state.startDate;
    const endDate = this.state.endDate;

    const result = await loadOrdersPage(
        searchStatus,
        pageIndex, 
        this.state.pageSize, 
        this.state.orderBy, 
        this.state.desc, 
        this.state.searchBy, 
        startDate, 
        endDate);

    console.log("load table with search status: " + searchStatus);
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
    const result = await deleteOrders(selectedOrders);
    console.log("delete result:")
    if(result.status.toLowerCase() === 'success') {
      ToastHelper.showDefault("成功!");
      this.loadTable(1);
      return;
    }

    ToastHelper.showDefault("操作失败!");
    this.loadTable(1);
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
    this.setState({
      searchBy: event.target.value
    });
  }

  onOrderStatusChange(event) {
    this.setState({
      searchStatus: event.target.value
    }, () => {
      this.loadTable(1);
    });
  }

  onKeyDownSearchBar(event) {
    console.log(event.key)
    if(event.key === 'Enter') {
      this.loadTable(1);
    }
  }

  onSearchButtonClicked() {
    this.loadTable(1);
  }

  onSortChanged(name, asending) {
    console.log("sorted: " + name + ", asendign: " + asending);
    this.setState({
      orderBy: name,
      desc: !asending
    }, () => {
      this.loadTable(1);
    });
  }

  onBeginDateChange(event) {
    console.log("start date: " + event)
    this.setState({
      startDate: event
    })
  }

  onEndDateChange(event) {
    console.log("end date: " + event)
    this.setState({
      endDate: event
    })
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
              <div className="container dataTable-top">              
              <Container fluid>
                <Row gy={5}>
                  <Col md={4}>
                        <label>开始日期</label>
                        <DatePicker selected={this.state.startDate} onChange={this.onBeginDateChange}/>
                  </Col>
                  <Col md={4}>
                        <label>结束日期</label>
                        <DatePicker selected={this.state.endDate} onChange={this.onEndDateChange} />
                  </Col>
                  <Col md={4}>
                    <label>订单状态</label>
                    <select onChange={this.onOrderStatusChange} className="form-select" defaultValue={"0"}>
                    {
                      OrderStatus.map(item => {
                        return (
                          <option key={item.value} value={item.dbValue}>{item.text}</option>
                        )
                      })
                    }
                    </select>
                  </Col>
                </Row>
                <br />
                <Row gy={5}>
                  <Col>
                    <button className='btn btn-secondary btn-sm' onClick={this.selectAll}>全选</button>
                    <button className='btn btn-primary btn-sm' onClick={this.deleteSelected}>删除</button>
                  </Col>

                  <Col md={4}>
                    <div className='dataTable-search'>
                      <input className="dataTable-input" placeholder="输入关键词..." type="text" onChange={this.inputSearchText} onKeyDown={this.onKeyDownSearchBar} />
                    </div>
                  </Col>

                  <Col>
                    <button className='btn btn-primary btn-sm' onClick={this.onSearchButtonClicked} title="查询">查 询</button>
                  </Col>
                </Row>
                
              </Container>
                
              </div>

              <br />
              <table className="table table-sm">
                  <thead>
                  <tr>
                      <th>选择</th>
                      <th>ID</th>
                      <SortableTableHeader title={"名称"} sortKeyword="title" onSortChanged={this.onSortChanged} currentSorting={this.state.orderBy} />
                      <SortableTableHeader title={"描述"} sortKeyword="description" onSortChanged={this.onSortChanged} currentSorting={this.state.orderBy} />
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
    )
  }
}


export default withRouter(AdminOrderList);