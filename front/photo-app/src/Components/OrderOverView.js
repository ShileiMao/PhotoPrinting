import React from 'react'

export default function OrderOverView({order, photoCount}) {
  const uploadedPhotos = photoCount || 0
  return (
    <>
    {
      order &&
      <div className="card border-secondary mb-3 Order-Overview-Container">
        <div className="card-header">订单信息</div>
        <div className="card-body">
          <div className='order-row'>
            <div className='order-row-item'>
              <div>
                <span>{order.title}</span>
              </div>
              <div>
                <span>{order.description}</span>
              </div>
            </div>
            <div className='order-row-accessory'>
              <span>{order.numPhotos}</span>
              <span>/</span>
              <span style={{color: `rosybrown`}}>{uploadedPhotos}</span>
            </div>
          </div>
        </div>
      </div>
    }
    </>
  )
}
