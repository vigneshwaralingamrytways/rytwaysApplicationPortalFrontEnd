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
  background-color: white;  

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




export const Stores = [
    {
        title: 'Material Master',
        path: '/masters/materials',
        icon: <LetterIcon letter='MM'  />
      },{
        title: 'Material Category',
        path: '/masters/materialsCat',
        icon: <LetterIcon letter='MC'  />
      },{
        title: 'UOM',
        path: '/master/UOM',
        icon: <LetterIcon letter='U'  />
      },{
        title: 'Check List',
        path: '/master/checkList',
        icon: <LetterIcon letter='C'  />
      },{
        title: 'Check List Group',
        path: '/master/checkListGroup',
        icon: <LetterIcon letter='CG'  />
      }

];

