import React from 'react'
import { useNavigate } from 'react-router-dom'
import { findOptionForDbValue, OrderStatus, OrderStatusHash, toRedableOptionText } from '../config/Consts'

export const OrderRow = ({props, order, toggleCheck}) => {
  const navigate = useNavigate()

  const openOrder = () => {
    console.log("clicked: " + JSON.stringify(order))
    navigate('/admin/orders/' + order.pddOrderNumber)
  }

  const editOrder = () => {
    navigate("/admin/orders/edit/" + order.pddOrderNumber);
  }
  
  const handleClick = (event) => {

    toggleCheck(order);
  }

  const getDate = () => {
    const finishStatus = OrderStatusHash.FINISH;
    const invalidStatus = OrderStatusHash.INVALID;

    if(order.status === finishStatus.dbValue) {
      return order.dateComplete;
    }
    if(order.status === invalidStatus.dbValue) {
      return order.dateDelete;
    }
    return order.dateCreate;
  }
  return (
    <tr>
        <td><input type="checkbox" className='form-check-input' checked={order.checked || false} onChange={handleClick} /></td>
        {/* <td style={{dispay: `none`}}>{order.id}</td> */}
        <td>{order.pddOrderNumber}</td>
        <td>{order.title}</td>
        <td>{order.description}</td>
        <td>{order.numPhotos}</td>
        <td>{"拼多多用户"}</td>
        <td>{order.phoneNumber}</td>
        <td>{order.postAddressStr}</td>
        <td>{getDate()}</td>
        <td>{toRedableOptionText(OrderStatus, order.status)}</td>
        <td className='row d-flex col-sm-10'>
          <button className='btn btn-outline-secondary btn-sm' onClick={openOrder}>查看</button>
          <button className='btn btn-outline-secondary btn-sm' onClick={editOrder}>修改</button>
        </td>
    </tr>
  )
}
