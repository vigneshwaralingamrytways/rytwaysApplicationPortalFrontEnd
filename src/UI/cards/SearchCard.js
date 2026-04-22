import React, { useState } from 'react';
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


function SearchCard(props, styles) {
  const dynamicStyles = typeof props.styles === "undefined" ? {} : props.styles;
  const [showBody, setShowBody] = useState(true);

  const toggleBody = () => {
    setShowBody(!showBody);
  };

  return (
    <Card
      className={classes.card}
      style={{
       background: "transparent" 
      }}
    >
    <Card.Header className={classes.cardHeader}>
    <Row >
    <Col xs={12} md={!props.bottonShow || !props.showSearch ? { span: 5, offset: 3 } : { span: 12 }} className='d-flex justify-content-center'><h5>{props.title}</h5></Col>
        <Col xs={12} md={4} className='d-flex justify-content-end'>
            {!props.bottonShow && <div style={{fontSize:"1.1rem"}}className={classes.addButton} onClick={props.onHeaderClick}>
              {props.buttonName}</div>}
             <Button variant="link" onClick={toggleBody}>
              {showBody ?<FaIcons.FaMinusCircle />:<FaIcons.FaPlusCircle />}
              </Button> 
        </Col>
       
      </Row>
   </Card.Header>
   {showBody && (  <Card.Body className={classes.cardBody}>
        {props.children}
    </Card.Body> )}
  </Card>
  )
}

export default SearchCard
