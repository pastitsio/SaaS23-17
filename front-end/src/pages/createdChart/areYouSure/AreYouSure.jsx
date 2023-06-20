import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { SubmitWaitButton } from '../../../components';

const AreYouSure = ({ onConfirm, show, setShow }) => {
  const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
  
  const handleCloseModal = () => {
    setShow(false);
  }

  return (
    <div>
      <Modal show={show} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Are you sure?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Saving the image will charge you <b>10</b> credits!
          <br />
          Your new balance will be <b>{userInfo.credits - 10}</b>.
        </Modal.Body>
        <Modal.Footer className='d-flex flex-column' >
          <Button id="cancel-button" onClick={handleCloseModal} className='align-self-start'>
            Cancel
          </Button>
          <SubmitWaitButton
            action={onConfirm}
            actionName='Confirm'
            cssId="buy-button"
          />

          {/* <Button id="purchase-button" onClick={handleConfirm}>
            Confirm
          </Button> */}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AreYouSure;
