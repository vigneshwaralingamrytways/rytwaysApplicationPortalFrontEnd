import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import * as RiIcons from 'react-icons/ri';
import * as FiIcons from "react-icons/fc";
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
export const GateEntry = [
  /* {
    title: 'Home',
    path: '/modules',
    icon: <LetterIcon letter="H" />
  }, */
  // {
  //   title: 'Entry',
  //   path: '/Gateentry/Entry',
  //   icon: <LetterIcon letter='E'  />
  // },
  {
    title: 'Purchase Inward',
    path: '/Gateentry/Purchaseinward',
    icon: <LetterIcon letter='P'  />
  },
//new added
  {
    title: 'Dispatch Pass',
    path: '/Gateentry/Dispatch',
    icon: <LetterIcon letter='D'  />
  } ,
//new added
  {
    title: 'Scrape Pass',
    path: '/Gateentry/Scrapepass',
    icon: <LetterIcon letter='S'  />
  } ,
  {
    title: 'Office Vehicle',
    path: '/Gateentry/Officevehicle',
    icon: <LetterIcon letter='O'  />
  },
  {
    title: 'RGP/NRGP',
    path: '/Gateentry/RGP',
    icon: <LetterIcon letter='R'  />
  },
  // {
  //   title: 'NRGP',
  //   path: '/Gateentry/nrgp',
  //   icon: <LetterIcon letter='N'  />
  // },
  {
    title: 'Add Work Permit',
    path: '/Gateentry/workpermit',
    icon: <LetterIcon letter='W'  />
  },
  {
    title: 'Work Permit Entry',
    path: '/Gateentry/workPermitEntry',
    icon: <LetterIcon letter='WI'  />
  },{
    title: 'Work Permit Entry',
    path: '/Gateentry/workPermitOutward',
    icon: <LetterIcon letter='WO'  />
  },
  {
    title: 'Courier',
    path: '/Gateentry/Courier',
    icon: <LetterIcon letter='C'  />
  },
  // {
  //   title: 'Module',
  //   path: '/Gateentry/Module',
  //   icon: <LetterIcon letter='M'  />
  // } ,
   
  {
    title: 'fuel',
    path: '/Gateentry/Fuel',
    icon: <LetterIcon letter='F'  />
  } ,
  {
    title: 'Personals',
    path: '/Gateentry/Personals',
    icon: <LetterIcon letter='P' />
  } ,

  
];