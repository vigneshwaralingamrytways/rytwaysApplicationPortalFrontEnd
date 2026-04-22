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


export const visitorsMenu = [
  /* {
    title: 'Home',
    path: '/modules',
    icon:  <LetterIcon letter="H" />
  }, */

  {
    title: 'Appointment',
    path: '/visitors/appointment',
    icon:  <LetterIcon letter="A" />
  },
  {
    title: 'Food Search',
    path: '/visitors/foodsearch',
    icon:  <LetterIcon letter="F" />
  },
  {
    title: 'Masters',
    path: '/visitors/masters',
    icon:  <LetterIcon letter="M" />
  },
  
  

  
];

