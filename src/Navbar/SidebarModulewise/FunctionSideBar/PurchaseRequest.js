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




export const PurchaseRequest = [
 /*  {
    title: 'Home',
    path: '/modules',
    icon:  <LetterIcon letter="H" />
  }, */
  // {
  //   title: 'Stores Request',
  //   path: '/common/storesRequest',
  //    icon:  <LetterIcon letter="S" />
  // }, 
  // {
  //   title: 'Purchase Requests',
  //   path: '/common',
  //   icon: <AiIcons.AiFillHome />,
  //   iconClosed: <RiIcons.RiArrowDownSFill />,
  //   iconOpened: <RiIcons.RiArrowUpSFill />,

  //   subNav: [
      
  //     {
  //       title: 'Material PR',
  //   path: '/common/materialpr',
  //        icon:  <LetterIcon letter="M" />
  //     },
  //     {
  //       title: 'Service PR',
  //   path: '/common/servicepr',
  //        icon:  <LetterIcon letter="S" />
  //     }
  //     // {
  //     //   title: 'Job Order PR',
  //     //   path: '/common/joPr',
  //     //    icon:  <LetterIcon letter="J" />
  //     // },
  //   ]
  // },

  {
    title: 'Material PR',
path: '/common/materialpr',
     icon:  <LetterIcon letter="M" />
  },{
    title: 'Service PR',
path: '/common/servicepr',
     icon:  <LetterIcon letter="S" />
  }
  // {
  //   title: 'Grn Approval',
  //   path: '/common/grnApproval',
  //   icon:  <LetterIcon letter="G" />
  // },

];

// {
//   title: 'Production Entry',
//   path: '/production/entry',
//    icon:  <LetterIcon letter="H" />
// }
