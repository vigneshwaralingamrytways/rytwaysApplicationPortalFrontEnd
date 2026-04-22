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

export const CustomerHandling = (userType, menu) => [
  
  ...(userType === 'Internal'
  ? [{
    title: 'On Boarding',
    path: '/master/onBoard',
    icon:  <LetterIcon letter="O" />
  },{
    title: 'Customer Master',
    path: '/master/customer',
    icon:  <LetterIcon letter="C" />
  },{
    title: 'Query Handling',
    path: '/master/query',
    icon:  <LetterIcon letter="Q" />
  },{
    title: 'Order Acknowledgement',
    path: '/master/acknowledge',
    icon:  <LetterIcon letter="O" />
  }
    ] : [])/* ,...(menu?.length > 0
      ? menu.map(item => ({
          title: item.menuName,
          path: item.path,
          icon: <LetterIcon letter={item.menuName.charAt(0).toUpperCase()} />
        }))
      : []) */
    
 

];
