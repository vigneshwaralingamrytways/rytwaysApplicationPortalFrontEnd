import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { CloseButton, Alert } from "react-bootstrap";

import classes from './Modal.module.css';

const Backdrop = (props) => {
  return <div className={classes.backdrop} style={{ zIndex: props.zIndex }} onClick={props.onClose}/>;
};

const ModalOverlay = (props) => {
  
  
  return (
    <div className={classes.modal} /* style={props.width && props.left ? { width: props.width, left: props.left } : {width:"58%",left:"21"}}  */ style={{
      width: props.width || '58%',
      left: props.left || '21%',
      zIndex: props.zIndex,
    }}>
      <div className={classes.content}>{props.children}</div>
    </div>
  );
};

const portalElement = document.getElementById('overlays');

const Modal = (props) => {

  const baseZIndex = 1000; // starting z-index
  const backdropZIndex = baseZIndex + (props.index || 0) * 2;
  const modalZIndex = backdropZIndex + 1;
  return (
    <div>
      {ReactDOM.createPortal(<Backdrop 
      zIndex={backdropZIndex}
      onClose={props.backdropOnClose ? props.onClose : undefined} />, portalElement)}
      {ReactDOM.createPortal(
        <ModalOverlay width={props.width} left={props.left}
        zIndex={modalZIndex}>{props.children}</ModalOverlay>,
        portalElement
      )}
    </div>
  );
};

export default Modal;