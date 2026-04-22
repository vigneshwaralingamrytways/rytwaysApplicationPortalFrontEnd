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

function TopCard(props) {
  return(
    <Card className={classes.card}>
    <Card.Body className={classes.cardBody}>
        {props.children}
    </Card.Body>
  </Card>
  )
}

export default TopCard
