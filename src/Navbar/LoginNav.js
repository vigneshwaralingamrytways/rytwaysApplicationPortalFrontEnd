import React from 'react'
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import * as FaIcons from 'react-icons/fa';
import Logo from'../source/logo.png';
import classes from './NavBar.module.css'
import { useContext } from 'react';
import AuthContext from '../store/auth-context';

const Nav = styled.div`
  background: rgb(107, 107, 107);
  height: 80px;
  display: flex;
  box-shadow: 5px 5px 4px 4px rgb(190, 190, 190);
  justify-content: flex-start;
  align-items: center;
  margin-right:1%;
  border-radius: 5px;
  margin-left:  ${({ sidebar }) => (!sidebar ? '1%' : '20.5%')};
`;


const NavIcon = styled(Link)`
  margin-left: 2rem;
  font-size: 2rem;
  height: 60px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  color: #000;
  left: ${({ sidebar }) => (sidebar ? '0' : '-100%')};
`;
const NavImage = styled.div`
  margin: auto;
  padding-right: 2rem;
  font-size: 2rem;
  height: 60px;
  vertical-align: middle;
  color: #000;
`;

function LoginNav(props) {
  const authCtx = useContext(AuthContext);

    const isLoggedIn = authCtx.isLoggedIn;

  return (
    
    <Nav sidebar={props.sidebar}>
    <NavImage>
    <img src={Logo} className={classes.images}/>
    </NavImage>
  </Nav>
  
  )
}
export default LoginNav
