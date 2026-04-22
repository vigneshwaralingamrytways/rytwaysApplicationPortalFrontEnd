import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import * as RiIcons from 'react-icons/ri';
import * as FiIcons from "react-icons/fc";
import * as HiIcons from "react-icons/hi";
import styled from 'styled-components';

const CircleOutlineWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1em;
  height: 1em;
  background-color: white;  // Fix the typo here

  color: black;
  padding: 0.6em; 
  font-size: 0.7em;
  border-radius: 50%;
  font-weight: 900;
`;


const LetterIcon = ({ letter }) => (
  <CircleOutlineWrapper>
    {letter}
  </CircleOutlineWrapper>
);

export const Dashboard = (userType, menu) => [
  
  ...(userType === 'Internal'
  ? [/*  {
    title: 'Home',
    path: '/modules',
    icon:  <LetterIcon letter="H" />
  }, */
  {
    title: 'Dashboard',
    path: '/sales',
    icon:  <LetterIcon letter="D" />
  }
 /*  {
    title: 'Order Not Processed',
    path: '/sales/unprocessed',
    icon:  <LetterIcon letter="O" />
  },
  {
    title: 'New Order',
    path: '/sales/neworder',
    icon:  <LetterIcon letter="N" />
  },
  {
    title: 'Existing Order',
    path: '/sales/order',
    icon:  <LetterIcon letter="E" />
  }, */]
  : userType === 'ClientUser' ? [
    {
      title: 'Dashboard',
      path: '/sales',
      icon:  <LetterIcon letter="D" />
    },
    /* {
      title: 'New Order',
      path: '/sales/neworder',
      icon:  <LetterIcon letter="N" />
    },
    {
      title: 'Order Search',
      path: '/sales/order',
      icon:  <LetterIcon letter="E" />
    } */
    ] : [])/* ,...(menu?.length > 0
      ? menu.map(item => ({
          title: item.menuName,
          path: item.path,
          icon: <LetterIcon letter={item.menuName.charAt(0).toUpperCase()} />
        }))
      : []) */
    
 

];
