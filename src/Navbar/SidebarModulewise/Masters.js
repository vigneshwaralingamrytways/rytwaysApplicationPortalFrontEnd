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

export const Masters = [
  
 /*  {
    title: 'Home',
    path: '/modules',
    icon:  <LetterIcon letter="H" />
  }, */
  {
    title: 'User Master',
    path: '/master/user',
    icon:  <LetterIcon letter="U" />
  },
  {
    title: 'Role Master',
    path: '/master/role',
    icon:  <LetterIcon letter="R" />
  },
  {
    title: 'Department',
    path: '/master/department',
    icon:  <LetterIcon letter="D" />
  },{
    title: 'Customer Master',
    path: '/master/customer',
    icon:  <LetterIcon letter="C" />
  },{
    title: 'Supplier Master',
    path: '/masters/supplierMaster',
    icon:  <LetterIcon letter="S" />
  },{
    title: 'Region Master',
    path: '/master/regon',
    icon:  <LetterIcon letter="R" />
  },
  {
    title: 'Product Master',
    path: '/master/product',
    icon:  <LetterIcon letter="P" />
  },{
    title: 'Material Master',
    path: '/masters/materials',
    icon: <LetterIcon letter='MM'  />
  },{
    title: 'Material Category',
    path: '/masters/materialsCat',
    icon: <LetterIcon letter='MC'  />
  },
  /*{
    title: 'Product Prize List',
    path: '/master/productprize',
    icon:  <LetterIcon letter="P" />
  }, */
  {
    title: 'Product Prize List',
    path: '/master/approval',
    icon:  <LetterIcon letter="P" />
  },

  {
    title: 'Unit Master',
    path: '/master/unitMaster',
    icon:  <LetterIcon letter="U" />
  },
  {
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
    title: 'Check List',
    path: '/master/checkList',
    icon: <LetterIcon letter='C'  />
  },{
    title: 'Check List Group',
    path: '/master/checkListGroup',
    icon: <LetterIcon letter='CG'  />
  },{
    title: 'Categories',
    path: '/master/CatMaster',
    icon: <LetterIcon letter='C'  />
  },{
    title: 'Store',
    path: '/master/store',
    icon: <LetterIcon letter='S'  />
  },{
    title: 'UOM',
    path: '/master/UOM',
    icon: <LetterIcon letter='U'  />
  },{
    title: 'Country',
    path: '/master/country',
    icon: <LetterIcon letter='C'  />
  },{
    title: 'Budget Master',
    path: '/budgetmaster',
    icon:  <LetterIcon letter="B" />
  },
  
];