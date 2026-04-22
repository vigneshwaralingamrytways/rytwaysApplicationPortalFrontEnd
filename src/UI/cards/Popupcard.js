import React from "react";
import { useDispatch } from 'react-redux';
import classes from './Popupcard.module.css';
import { Card, Col } from "react-bootstrap";
import * as FaIcons from 'react-icons/fa';
import { modalActions } from '../../store/modal-Slice';

function Popupcard(props) {

  const dispatch = useDispatch();

  /* ---------- CLOSE HANDLER ---------- */
  const handleClose = () => {
    // ?? If slider/back navigation exists
    if (props.onBack) {
      props.onBack();
      return;
    }

    // ?? Default modal behavior
    dispatch(modalActions.hideModalHandler());
  };

  return (
    <Card className={classes.card} style={{ margin: "0px", padding: "0px" }}>

      {/* ===== HEADER ===== */}
      {(props.title || props.showBack) && (
        <div>
          <Col className={classes.title}>

            {/* BACK BUTTON */}
            {/* {props.showBack && (
              <button
                onClick={props.onBack}
                style={{
                  background: 'transparent',
                  border: 'none',
                  marginRight: '10px',
                  cursor: 'pointer',
                  color: '#fff'
                }}
                title="Back"
              >
                <FaIcons.FaArrowLeft />
              </button>
            )} */}

            {/* TITLE */}
            {props.title && <span>{props.title}</span>}

            {/* CLOSE BUTTON */}
            <button
              className={classes.closeicon}
              onClick={handleClose}
              aria-label="Close"
            >
              <FaIcons.FaArrowLeft />
            </button>

          </Col>
        </div>
      )}

      {/* ===== BODY ===== */}
      <Card.Body className={classes.propsbody}>
        {props.children}
      </Card.Body>

    </Card>
  );
}

export default Popupcard;
