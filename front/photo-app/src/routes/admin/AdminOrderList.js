import React, { Component } from 'react'
import AdminPageHeader from '../../Components/AdminPageHeader'
import { OrderRow } from '../../Components/OrderRow'
import { checkFinishedOrders, deleteOrders, loadOrders, loadOrdersPage, updateOrderStatus, updateOrderStatusMultiple } from '../../utils/apiHelper'
import { withRouter } from '../../utils/react-router'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import { Col, Container, OffcanvasBody, Row, ToastHeader } from 'react-bootstrap'
import DateUtils from '../../utils/DateUtils'
import SortableTableHeader from '../../Components/SortableTableHeader'
import { findOptionForDbValue, OrderStatus, OrderStatusHash } from '../../config/Consts'
import ToastHelper from '../../utils/toastHelper'
import { Dialog } from '../../Components/Dialog'

class AdminOrderList extends Component {
  constructor({props, showModal}) {
      super(props)

      let dateUtils = new DateUtils();
      let endOfDay = dateUtils.getEndOfDay();

      dateUtils.setMonth(-1, true);
      let startOfMonth = dateUtils.getStartOfDay();

      this.state = {
          showModal: showModal,
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
          showConfirmDialog: false,
          alertTitle: "",
          alertCancelCallback: null,
          alertConfirmCallback: null,
          dynamicAlertContent: null,
          manageSelectedStatus: null,
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
      this.dismissDialog = this.dismissDialog.bind(this);
      this.showManageOptions = this.showManageOptions.bind(this);
      this.returnDynamicContent = this.returnDynamicContent.bind(this);
      this.hasSelectedItem = this.hasSelectedItem.bind(this);
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

    if(result.status.toLowerCase() === 'error') {
        ToastHelper.showError("????????????!");
        return;
    }

    // ???????????????????????????????????????
    const resetFlag = (this.pageIndex === pageIndex) ? this.state.selectAll : false;
    this.setState({
        data: result.data.list,
        pageInfo: result.data,
        pageIndex: pageIndex,
        selectAll: resetFlag
    })
  }

  returnDynamicContent() {
    return this.state.dynamicAlertContent;
  }
  /**
   * ??????????????????????????????????????????
   */
  async deleteSelected() {
    // ???????????????????????????
    const selectedOrders = this.state.data.filter(item => {
      return item.checked === true;
    })

    // ???????????????
    if(selectedOrders.length === 0) {
      ToastHelper.showDefault("???????????????");
      return;
    }

    // ????????????
    const confirmDelete = async() => {
      this.dismissDialog()
  
      const selectedOrders = this.state.data.filter(item => {
        return item.checked === true;
      })
      const result = await deleteOrders(selectedOrders);
      if(result.status.toLowerCase() === 'success') {
        console.log("confirmed")
        ToastHelper.showDefault("??????!");
        this.loadTable(1);
        return;
      }
  
      ToastHelper.showDefault("????????????!");
      this.loadTable(1);
    }

    this.setState({showConfirmDialog: true,
      alertTitle: "??????",
      dynamicAlertContent: <>???????????????</>,
      alertConfirmCallback: confirmDelete,
      alertCancelCallback: null
    });
  }


  /**
   * ???????????????????????????????????????
   */
  showManageOptions() {
    // ???????????????????????????
    const selectedOrders = this.state.data.filter(item => {
      return item.checked === true;
    })

    // ???????????????
    if(selectedOrders.length === 0) {
      ToastHelper.showDefault("???????????????");
      return;
    }

    const onSelectStatus = (event) => {
      this.setState({
        manageSelectedStatus: event.target.value
      })
    }

    const confirmCallback = async () => {
      let newOrders = selectedOrders.map (item => {
        item.status = this.state.manageSelectedStatus;
        return item;
      })
      const response = await updateOrderStatusMultiple(newOrders);
      if(response.status.toLowerCase() !== 'success') {
        ToastHelper.showError("????????????: " + response.error);
        this.loadTable(1);
        return;
      }

      if(this.state.manageSelectedStatus === OrderStatusHash.FINISH.dbValue.toString()) {
        checkFinishedOrders();
      }

      this.loadTable(1);
      return;
    }

    const unapproved = findOptionForDbValue(OrderStatus, -1);
    const approved = findOptionForDbValue(OrderStatus, 0);

    let options = OrderStatus.filter(item => {
      return item.dbValue > approved.dbValue
    });

    if(selectedOrders[0].status == unapproved.dbValue) {
      options = [approved];
    }

    console.log("---new options --: " + JSON.stringify(options));

    const dynamicContent = <>
      <div className='col-4'>
        <label>???????????????</label>
        <select className='form-select' defaultValue={selectedOrders[0].status} onChange={onSelectStatus}>
          {
            options.map(item => {
              return <option key={item.value} value={item.dbValue}>{item.text}</option>
            })
          }
        </select>
      </div>
    </>;

    this.setState({
      manageSelectedStatus: options[0].dbValue, //?????????????????????
      showConfirmDialog: true,
      alertTitle: "??????",
      dynamicAlertContent:  dynamicContent,
      alertCancelCallback: null,
      alertConfirmCallback: confirmCallback
    })
  }

  dismissDialog() {
    this.setState({showConfirmDialog: false})
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

  hasSelectedItem() {
    for(let index = 0; index < this.state.data.length; index ++) {
      if(this.state.data[index].checked === true) {
        return true;
      }
    }
    return false;
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
        title: "??????"
      },
      {
        path: "/admin/orders",
        title: "??????"
      }];

    return (
      <div>
        <AdminPageHeader title={"??????"} subRoutes={routes} />
        <div className='row'>
          <div className="section card">
            <h5 className="card-title">????????????</h5>
            
            <div className='dataTable-wrapper dataTable-loading no-footer sortable searchable fixed-columns'>
              <div className="container dataTable-top">              
              <Container fluid>
                <Row gy={5}>
                  <Col md={4}>
                        <label>????????????</label>
                        <DatePicker selected={this.state.startDate} onChange={this.onBeginDateChange}/>
                  </Col>
                  <Col md={4}>
                        <label>????????????</label>
                        <DatePicker selected={this.state.endDate} onChange={this.onEndDateChange} />
                  </Col>
                  <Col md={4}>
                    <label>????????????</label>
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
                    <button className='btn btn-secondary btn-sm' onClick={this.selectAll}>??? ???</button>
                    
                    {
                      this.hasSelectedItem() &&
                      <>
                        &nbsp;
                        <button className='btn btn-primary btn-sm' onClick={this.deleteSelected}>??? ???</button>
                      </>
                    }
                  </Col>

                  <Col md={4}>
                    <div className='dataTable-search'>
                      <input className="dataTable-input" placeholder="???????????????..." type="text" onChange={this.inputSearchText} onKeyDown={this.onKeyDownSearchBar} />
                    </div>
                  </Col>

                  <Col>
                  
                    <button className='btn btn-secondary btn-sm' onClick={this.onSearchButtonClicked} title="??????">??? ???</button>
                    {
                      this.hasSelectedItem() &&
                      <>
                        &nbsp;
                        <button className='btn btn-primary btn-sm' onClick={this.showManageOptions} title="??????">??? ???</button>
                      </>
                    }
                  </Col>
                </Row>
                
              </Container>
                
              </div>

              <br />
              <table className="table table-sm">
                  <thead>
                  <tr>
                      <th>??????</th>
                      {/* <SortableTableHeader title={"ID"} sortKeyword="id" display={false} onSortChanged={this.onSortChanged} currentSorting={this.state.orderBy} /> */}
                      <SortableTableHeader title={"?????????"} sortKeyword="pdd_order_number" onSortChanged={this.onSortChanged} currentSorting={this.state.orderBy} />
                      <SortableTableHeader title={"??????"} sortKeyword="title" onSortChanged={this.onSortChanged} currentSorting={this.state.orderBy} />
                      <SortableTableHeader title={"??????"} sortKeyword="description" onSortChanged={this.onSortChanged} currentSorting={this.state.orderBy} />
                      <SortableTableHeader title={"????????????"} sortKeyword="num_photos" onSortChanged={this.onSortChanged} currentSorting={this.state.orderBy} />
                      <SortableTableHeader title={"?????????"} sortKeyword="user_name" onSortChanged={this.onSortChanged} currentSorting={this.state.orderBy} />
                      <SortableTableHeader title={"??????"} sortKeyword="phone_number" onSortChanged={this.onSortChanged} currentSorting={this.state.orderBy} />
                      <SortableTableHeader title={"??????"} sortKeyword="address" onSortChanged={this.onSortChanged} currentSorting={this.state.orderBy} />
                      <SortableTableHeader title={"??????"} sortKeyword="date_create" onSortChanged={this.onSortChanged} currentSorting={this.state.orderBy} />
                      <SortableTableHeader title={"??????"} sortKeyword="status" onSortChanged={this.onSortChanged} currentSorting={this.state.orderBy} />
                      <th>??????</th>
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
                          <a className="page-link" href="#!" onClick={this.prePage}>?????????</a>
                      </li>
                      
                      <li className={ this.state.pageInfo && !this.state.pageInfo.hasNextPage ? "disabled page-item" : "page-item"}>
                          <a className="page-link" href="#!" onClick={this.nextPage}>?????????</a>
                      </li>
                  </ul>
              </nav>
          </div>
        </div>


        <Dialog show={this.state.showConfirmDialog} 
                  dismiss={this.dismissDialog} 
                  generateContent={this.returnDynamicContent} 
                  title={this.state.alertTitle}
                  cancelClicked={this.state.alertCancelCallback} 
                  confirmClicked={this.state.alertConfirmCallback} />
        {
          // this.state.showConfirmDialog &&
          // <AlertDialog title={"??????"} message={"???????????????"} confirm={this.confirmDelete} cancel={this.dismissDialog}></AlertDialog>
        }
      </div>
    )
  }
}


export default withRouter(AdminOrderList);