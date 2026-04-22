import React from "react";
import { Modal } from "react-bootstrap";
import classes from "./CustomModal.modal.css";

const CustomModal = ({ show, onHide, children }) => {
  return (
    <Modal show={show} onHide={onHide} centered className={classes.custommodal}>
      <Modal.Body>{children}</Modal.Body>
    </Modal>
  );
};

export default CustomModal;
