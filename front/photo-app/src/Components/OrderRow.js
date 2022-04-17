import React from 'react'
import { useNavigate } from 'react-router-dom'

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

  return (
    <tr>
        <td><input type="checkbox" className='form-check-input' onClick={handleClick} checked={order.checked || false} onChange={handleClick}/></td>
        <td>{order.id}</td>
        <td>{order.title}</td>
        <td>{order.description}</td>
        <td>{order.numPhotos}</td>
        <td>{"拼多多用户"}</td>
        <td>-</td>
        <td>{order.postAddressStr}</td>
        <td>{order.dateCreate}</td>
        <td>{order.status}</td>
        <td className='row d-flex col-sm-10'>
          <button className='btn btn-outline-secondary btn-sm' onClick={openOrder}>查看</button>
          <button className='btn btn-outline-secondary btn-sm' onClick={editOrder}>修改</button>
        </td>
    </tr>
  )
}
