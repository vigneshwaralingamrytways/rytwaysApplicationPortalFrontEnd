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

export const Costing = [
  
 /*  {
    title: 'Home',
    path: '/modules',
    icon:  <LetterIcon letter="H" />
  }, */
  {
    title: 'Material Master',
    path: '/costing/materialmaster',
    icon:  <LetterIcon letter="M" />
  },
  {
    title: 'Production Plan',
    path: '/costing/productionplan',
    icon:  <LetterIcon letter="P" />
  },
  {
    title: 'Material Cost',
    path: '/costing/materialcost',
    icon:  <LetterIcon letter="M" />
  },
  {
    title: 'Daily FG Cost',
    path: '/costing/dailyfg',
    icon:  <LetterIcon letter="D" />
  },
  {
    title: 'Monthly FG Cost',
    path: '/costing/monthlyfg',
    icon:  <LetterIcon letter="M" />
  },

  {
    title: 'Cost Sheet',
    path: '/costing/costsheet',
    icon:  <LetterIcon letter="C" />
  },


];