import React from 'react'
import 'bootstrap/dist/css/bootstrap.css';
import {
    Button,
    Row,
    Col,
    Card
    // FormControl
  } from 'react-bootstrap';
import classes from './SearchCard.module.css'
import * as FaIcons from 'react-icons/fa';

function HeaderCard(props) {
  return (
    <Card body className={classes.title}>
    <Row>
    <Col md={{ span: 6, offset: 3 }}> <h4 style={{color: 'white'}}>Customer Form</h4> </Col> 
    </Row>
    </Card>
  )
}

export default HeaderCard