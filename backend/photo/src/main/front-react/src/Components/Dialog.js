import React, { useState } from 'react'
import { Button, Modal} from 'react-bootstrap'

export const Dialog = ({show, dismiss, title, generateContent, cancelClicked, confirmClicked}) => {

  const handleClose = () => { 
    dismiss(false);

    if(cancelClicked) {
      cancelClicked();
    }
  }
  const handleConfirm = () => {
    dismiss(false);
    if(confirmClicked) {
      confirmClicked();
    }
  }

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {
            generateContent()
          }
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            取 消
          </Button>
          {
            confirmClicked && 
            <Button variant="primary" onClick={handleConfirm}>
              确 认
            </Button>
          }
        </Modal.Footer>
      </Modal>
    </>
  );
}
