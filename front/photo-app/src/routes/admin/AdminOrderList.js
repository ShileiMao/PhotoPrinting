import React, { Component } from 'react'
import { Outlet } from 'react-router-dom'
import { OrderRow } from '../../Components/OrderRow'
import { loadOrders } from '../../utils/apiHelper'

export default class AdminOrderList extends Component {
  constructor(props) {
      super(props)
      this.state = {
          totalPage: 0,
          curPage: 0,
          pageSize: 20,
          data: [],
          pageInfo: {}
      }
      this.loadTable = this.loadTable.bind(this);
  }

  async loadTable(pageIndex) {
    const result = await loadOrders(null, -1);
    console.log("result: " + JSON.stringify(result))
    if(result.status.toLowerCase() === 'error') {
        console.log("error loading order: " + result.error);
        return;
    }
    this.setState({
        data: result.data
    })
    console.log("table data: " + this.state.data.length)
  }

  componentDidMount() {
    console.log("component did mount")
    this.loadTable(0)
  }

  render() {
    return (
      <div>
        <div id="page-wrapper">
          <div id="page-inner">
        {/*  */}

        <div class="panel panel-default">
                <div class="panel-heading">
                    商品详情信息
                </div>
                <div class="panel-body">
                    <div class="table-responsive">
                        <table class="table table-striped table-bordered table-hover">
                            <thead>
                            <tr>
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
                                this.state.data.map( (item, index) => {
                                    return <OrderRow order={item} key={item.id} selectOrder={this.props.selectOrder} />
                                })
                            }
                            
                            </tbody>
                        </table>
                        {/* <nav aria-label="Page navigation example">
                            <ul class="pagination">
                                <li class="page-item" className={ this.state.curPage <= 0 && "disabled"}>
                                    <a class="page-link" href="javascript:void(0)" onClick={this.loadTable(this.state.curPage - 1)}>上一页</a>
                                </li>
                                
                                <li class="page-item" className={ this.state.curPage >= (this.state.totalPage - 1) && "disabled"}>
                                    <a class="page-link" href="javascript:void(0)" onClick={this.loadTable(this.state.pageInfo.hasNextPage? (this.state.pageInfo.pageNum + 1) : this.state.pageInfo.pageNum)}>下一页</a>
                                </li>
                            </ul>
                        </nav> */}
                    </div>
                </div>
            </div>
        {/*  */}
          </div>
        </div>
      </div>
    )
  }
}
