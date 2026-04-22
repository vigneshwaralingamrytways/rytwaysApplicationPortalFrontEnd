import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';


import classes from './Newmodal.module.css'

const Backdrop = (props) => {
  return <div className={classes.backdrop} onClick={props.onClose}/>;
};

const ModalOverlay = (props) => {
  
  
  return (
    <div className={classes.modalcp} md={props.size}
    style={{width:'30vw'}}
>

      <div className={classes.content}>{props.children}</div>
    </div>
  );
};

const portalElement = document.getElementById('overlays');

const Cpasswordmodal = (props) => {
  return (
    <Fragment>
      {ReactDOM.createPortal(<Backdrop onClose={props.onClose} />, portalElement)}
      {ReactDOM.createPortal(
        <ModalOverlay>{props.children}</ModalOverlay>,
        portalElement
      )}
    </Fragment>
  );
};

export default Cpasswordmodal;