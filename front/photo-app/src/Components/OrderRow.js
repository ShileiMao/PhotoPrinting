import React from 'react'
import { useNavigate } from 'react-router-dom'

export const OrderRow = ({props, order}) => {
  const navigate = useNavigate()

  const openOrder = () => {
    console.log("clicked: " + JSON.stringify(order))
    navigate('/admin/orders/detail/' + order.pddOrderNumber)
  }
  return (
    <tr className='table-secondary'>
        <td>{order.id}</td>
        <td>{order.title}</td>
        <td>{order.description}</td>
        <td>{order.numPhotos}</td>
        <td>{"拼多多用户"}</td>
        <td>-</td>
        <td>{order.postAddressStr}</td>
        <td>{order.dateCreate}</td>
        <td>{order.status}</td>
        <td><button className='btn btn-success' onClick={openOrder}>查 看</button></td>
    </tr>
  )
}
