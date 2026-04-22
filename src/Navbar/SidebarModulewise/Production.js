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
export const Production = [
  /* {
    title: 'Home',
    path: '/modules',
    icon: <LetterIcon letter="H" />
  },
 */
  // {
  //   title: 'MA Entry',
  //   path: '/production/dispathentrynew',
  //   icon: <LetterIcon letter="M" />
  // },
  // {
  //   title: 'Manufacturing Advice',
  //   path: '/production/manufacturingAdvice',
  //   icon: <LetterIcon letter="M" />
  // },
  {
    title: 'MA Search',
    path: '/production/maSearch',
    icon: <LetterIcon letter="M" />
  },
  // {
  //   title: 'Production Entry',
  //   path: '/production/productionEntry',
  //   icon: <LetterIcon letter="P" />
  // },
  
  
  // // {
  // //   title: 'FG Search',
  // //   path: '/production/fgSearch',
  // //   icon: <LetterIcon letter="F" />
  // // },
  // // {
  // //   title: 'Dispatch Entry',
  // //   path: '/production/dispatchEntry',
  // //   icon: <LetterIcon letter="D" />
  // },
  // {
  //   title: 'Dispatch Entry Search',
  //   path: '/production/DispatchEntrySearch',
  //   icon: <LetterIcon letter="D" />
  // },
  {
    title: 'Production Entry',//New added
    path: '/production/productionentry',
    icon: <LetterIcon letter="P" />
  },
  // {
  //   title: 'Production Entry New',
  //   path: '/production/productionentrynew',
  //   icon: <LetterIcon letter="P" />
  // },
  {
    title: 'Production Entry Search',
    path: '/production/productionentrySearch',
    icon: <LetterIcon letter="P" />
  }, {
    title: 'Store request',//New added
    path: '/production/storesRequest',
    icon: <LetterIcon letter="s" />
  },



  {
    title: 'Order Transfer',
    path: '/production/orderTransfer',
    icon: <LetterIcon letter="O" />
  },


  {
    title: 'Quality Search',
    path: '/production/Qualitysearch',
    icon: <LetterIcon letter="Q" />
  },
  {
    title: 'FG Stock Entry',//New Added
    path: '/production/dispatchentry',
    icon: <LetterIcon letter="F" />
  },
  {
    title: 'Dispatch Search',
    path: '/production/dispatchsearch',
    icon: <LetterIcon letter="D" />
  },
  // {
  //   title: 'Dispath Entry New',
  //   path: '/production/dispathentrynew',
  //   icon: <LetterIcon letter="D" />
  // },
 
 
];

