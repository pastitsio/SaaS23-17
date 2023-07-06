import React from 'react'
import { Button, Modal } from 'react-bootstrap';

const ActionErrorModal = (props) => {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Oops!
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>There was an error in your last action!</h4>
        <p style={{ fontSize: 25 }}>
          {props.message}
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button id='purchase-button' onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ActionErrorModal