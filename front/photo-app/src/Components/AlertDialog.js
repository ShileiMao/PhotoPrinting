import React from 'react';

export const AlertDialog = ({title, message, confirm, cancel}) => {
  return (
    <div className="modal fade show" id="basicModal" style={{display: `block`}} tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            {message}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={cancel}>取消</button>
            <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={confirm}>确认</button>
          </div>
        </div>
      </div>
    </div>

  )
}
