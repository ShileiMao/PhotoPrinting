import React from 'react'
import { useNavigate } from 'react-router-dom'

export const OrderRow = ({order, selectOrder}) => {
  const navigate = useNavigate()

  const openOrder = () => {
    console.log("clicked: " + JSON.stringify(order))
    selectOrder(order)
    navigate('/admin/orders/detail')
  }
  return (
    <tr>
        <td>{order.id}</td>
        <td>{order.title}</td>
        <td>{order.description}</td>
        <td>{order.numPhotos}</td>
        <td>{"拼多多用户"}</td>
        <td>-</td>
        <td>{order.postAddressStr}</td>
        <td>{order.dateCreate}</td>
        <td>{order.status}</td>
        <td><button onClick={openOrder}>查 看</button></td>
    </tr>
  )
}
