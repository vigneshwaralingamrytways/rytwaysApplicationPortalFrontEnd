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

export const FGStockManagement = [
  
 /*  {
    title: 'Home',
    path: '/modules',
    icon:  <LetterIcon letter="H" />
  }, */
  // {
  //   title: 'Dashboard',
  //   path: '/fgstock/dashboard',
  //   icon:  <LetterIcon letter="D" />
  // },
 
  {
    title: 'Sheet Dashboard',
    path: '/fgstock/sheetdashboard',
    icon:  <LetterIcon letter="S" />
  },
  {
    title: 'Aging Sheet-Dashboard',
    path: '/fgstock/agingdashboard',
    icon:  <LetterIcon letter="A" />
  },
  {
    title: 'Reel Dashboard',
    path: '/fgstock/reeldashboard',
    icon:  <LetterIcon letter="R" />
  },
 
   {
    title: 'Aging Reel-Dashboard',
    path: '/fgstock/agingdreeldashboard',
    icon:  <LetterIcon letter="A" />
  },
  // {
  //   title: 'FG Stock',
  //   path: '/fgstock/FGStock',
  //   icon:  <LetterIcon letter="F" />
  // },
  
  {
    title: 'Load Pallet',
    path: '/fgstock/loadpallet',
    icon:  <LetterIcon letter="L" />
  },
  {
    title: 'Search Pallet',
    path: '/fgstock/searchpallet',
    icon:  <LetterIcon letter="S" />
  },
  {
    title: 'Load Reel',
    path: '/fgstock/loadreel',
    icon:  <LetterIcon letter="LR" />
  },
  
  {
    title: 'Search Reel',
    path: '/fgstock/searchreel',
    icon:  <LetterIcon letter="SR" />
  },
  /* {
    title: 'Check Out Pallet',
    path: '/fgstock/SearchChecOut',
    icon:  <LetterIcon letter="C" />
  }, */
  // {
  //   title: 'Rack Search',
  //   path: '/fgstock/recksearch',
  //   icon:  <LetterIcon letter="R" />
  // },
  


];
