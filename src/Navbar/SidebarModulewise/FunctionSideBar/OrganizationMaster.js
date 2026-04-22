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

export const OrganizationMaster = (userType, menu) => [
  
  ...(userType === 'Internal'
  ? [{
    title: 'Department',
    path: '/master/department',
    icon:  <LetterIcon letter="D" />
  },{
    title: 'Region Master',
    path: '/master/regon',
    icon:  <LetterIcon letter="R" />
  },{
    title: 'Unit Master',
    path: '/master/unitMaster',
    icon:  <LetterIcon letter="U" />
  },{
    title: 'Pallet Master',//new added
    path: '/master/palletMaster',
    icon:  <LetterIcon letter="P" />
  },
  {
    title: 'Reck Master',//new added
    path: '/master/reckMaster',
    icon:  <LetterIcon letter="R" />
  },
  {
    title: 'Location Master',//new added
    path: '/master/locationMaster',
    icon:  <LetterIcon letter="L" />
  },{
    title: 'Country',
    path: '/master/country',
    icon: <LetterIcon letter='C'  />
  }
    ] : [])/* ,...(menu?.length > 0
      ? menu.map(item => ({
          title: item.menuName,
          path: item.path,
          icon: <LetterIcon letter={item.menuName.charAt(0).toUpperCase()} />
        }))
      : []) */
    
 

];
