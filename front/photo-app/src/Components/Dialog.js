import React, { useState } from 'react'
import { Button, Modal} from 'react-bootstrap'

export const Dialog = ({show, setShow, title, generateContent, cancelClicked, confirmClicked}) => {

  const handleClose = () => { 
    setShow(false);
    cancelClicked();
  }
  const handleConfirm = () => {
    setShow(false);
    confirmClicked();
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
          <Button variant="primary" onClick={handleConfirm}>
            确 认
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
