import React from 'react'
import { Packaging, PhotoSize, toRedableOptionText } from '../config/Consts'
import { StringUtils } from '../utils/StringUtils'

export default function OrderOverView({order, photoCount}) {

  console.log("order: " + JSON.stringify(order))

  const uploadedPhotos = photoCount || 0
  return (
    <>
    {
      order &&
      <div className="card border-secondary mb-3 Order-Overview-Container">
        <div className="card-header">订单信息</div>
        <div className="card-body">
          <div className='order-row justify-content-md-center'>
            <div className='col'>
              <div>
                名称：<span>{order.title}</span>
              </div>
              <div>
                描述：<span>{order.description}</span>
              </div>
            </div>
            <div className='col'>
              <div>
                地址:{StringUtils.isEmpty(order.postAddrDetailStr) ? order.postAddressStr : order.postAddrDetailStr}
              </div>

              <div>
                电话：{order.phoneNumber}
              </div>
            </div>

            <div className='col col-sm-2'>
              <div>
                <span>{order.numPhotos}</span>
                <span>/</span>
                <span style={{color: `rosybrown`}}>{uploadedPhotos}</span>
              </div>

              <div>
                <span>{toRedableOptionText(PhotoSize, order.photoSize)}</span>
                <span>/</span>
                <span style={{color: `rosybrown`}}>{toRedableOptionText(Packaging, order.packaging)}</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    }
    </>
  )
}
