/* import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import * as RiIcons from 'react-icons/ri';
import * as FiIcons from "react-icons/fc";

export const storeMenu = [
  {
    title: 'Home',
    path: '/modules',
    icon: <FaIcons.FaProductHunt  />
  },
  {
    title: 'Dashboard',
    path: '/stores',
    icon: <FaIcons.FaProductHunt  />
  },{
    title: 'GRN Inward',
    path: '/stores/grnitems',
    icon: <FaIcons.FaProductHunt  />
  } ,  {
    title: 'Stock Inward',
    path: '/stores/inward',
    icon: <FaIcons.FaProductHunt  />
  }, {
    title: 'Material Request',
    path: '/stores/materialreq1',
    icon: <FaIcons.FaProductHunt  />
  },,{
    title: 'Damaged Goods',
    path: '/stores/damagegoods',
    icon: <FaIcons.FaProductHunt  />
  }, {
    title: 'Gate Entry',
    path: '/stores/grnentry',
    icon: <FaIcons.FaProductHunt  />
  } 
];
 */

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


export const storeMenu = [
  // {
  //   title: 'Home',
  //   path: '/modules',
  //   icon: <FaIcons.FaProductHunt style={{ fontSize: '.9rem', margin: 'auto 0' }} />
  // },
  {
    title: 'Dashboard',
    path: '/stores',
    icon: <LetterIcon letter="D" />
  },/* ,{
    title: 'Gate Entry',
    path: '/stores/grnentry',
    icon: <LetterIcon letter="G" />
  } , */
  {
    title: 'Po Gate Entry',
    path: '/stores/poGateEntry',
    icon: <LetterIcon letter="P" />
  } ,
 /*  {
    title: 'Grn Entry Search',
    path: '/stores/grnEntrySearch',
    icon: <LetterIcon letter="G" />

  }, */
  /* {
    title: 'GRN Inward',
    path: '/stores/grnitems',
    icon: <LetterIcon letter="G" />
  } ,  */  {
    title: 'Stock Inward',
    path: '/stores/inward',
    icon: <LetterIcon letter="S" />
  }, {
    title: 'Material Request',
    path: '/stores/materialreq1',
    icon: <LetterIcon  letter="MR" />
  },{
    title: 'Material Search',
    path: '/stores/materialsearch',
    icon: <LetterIcon letter="M" />
  }, {
    title: 'Damaged Goods',
    path: '/stores/damagegoods',
    icon: <LetterIcon letter="D" />
  },{
    title: 'Material Issue Search',
    path: '/stores/materialIssueSearch',
    icon: <LetterIcon letter="MI" />
  },{
    title: 'Grn Item',
    path: '/stores/PurchaseGrnEntry',
    icon: <LetterIcon letter="GI" />
  },  {
    title: 'GRN Search',
    path: '/stores/GrnSearch',
    icon: <LetterIcon letter="G" />
  } , {
    title: 'Stock Transfer Search',
    path: '/stores/stockTransfer',
    icon: <LetterIcon letter="S" />
  },
];
