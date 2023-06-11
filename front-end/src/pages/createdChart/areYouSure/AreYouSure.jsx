import React from 'react';
import { Button, Modal } from 'react-bootstrap';

const AreYouSure = ({onConfirm, showConfirm, setShowConfirm}) => {
  const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));

  const handleCloseModal = () => {
    setShowConfirm(false);
  };

  const handleConfirm = () => {
    onConfirm();
    handleCloseModal();
  };

  return (
    <div>
      <Modal show={showConfirm} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Are you sure?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Saving the image will charge you <b>10</b> credits!
          <br/>
          Your new balance will be <b>{userInfo.credits - 10}</b>.
        </Modal.Body>
        <Modal.Footer>
          <Button id="cancel-button" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button id="purchase-button" onClick={handleConfirm}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AreYouSure;
