import React, {useState} from "react";
import {
  Card,Button,Row,Col
  } from "react-bootstrap";
import classes from './PopupSimple.module.css'

function PopupSimpleCard(props) {
 
  return (
    <Card
      className={`${classes.card} ${props.className}`}
     
    >
   {props.title && <>
    <Card
  body
  className={classes.title}
  
  
>

    <Row>
    <Col md={{ span: 6, offset: 3 }}> <h4>{props.title}</h4> </Col> 
    </Row>
    </Card>
  </>} 
  <Card.Body style={{ padding: '0' }}>

    {props.children}
    </Card.Body>
  </Card>
  )
}
export default PopupSimpleCard
