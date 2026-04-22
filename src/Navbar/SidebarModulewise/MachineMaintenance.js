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


export const maintenanceMasters = [
  {
    title: 'Asset Type Master',
    path: '/maintenance/',
    icon:  <LetterIcon letter="A" />
  },
  {
    title: 'Location Master',
    path: '/maintenance/location',
    icon:  <LetterIcon letter="L" />
  },
  
  {
    title: 'Sub Location Master',
    path: '/maintenance/subLocation',
    icon:  <LetterIcon letter="S" />
  },
  {
    title: 'Asset Categoryr',
    path: '/maintenance/assetCategory',
    icon:  <LetterIcon letter="A" />
  },
  
  {
    title: 'Asset Sub Category',
    path: '/maintenance/assetSubCategory',
    icon:  <LetterIcon letter="A" />
  },
  {
    title: 'Asset Schedule Category',
    path: '/maintenance',
    icon:  <LetterIcon letter="A" />
  },
  {
    title: 'Asset Schedule Sub Category',
    path: '/maintenance',
    icon:  <LetterIcon letter="A" />
  },
  {
    title: ' Asset Master',
    path: '/maintenance/assetMaster',
    icon:  <LetterIcon letter="A" />
  },
  {
    title: ' Asset Additional Details',
    path: '/maintenance',
    icon:  <LetterIcon letter="A" />
  },
  {
    title: 'Breakdown & Complaints',
    path: '/maintenance/Complaints',
    icon:  <LetterIcon letter="B" />  },
  
  /*{
    title: 'Category Master',
    path: '/category',
    icon: <AiIcons.AiFillHome />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      
      {
        title: 'Category Macro',
    path: '/masters/macro',
        icon: <FiIcons.FcProcess />,
        data:{}
      },
      {
        title: 'Category Micro',
    path: '/masters/micro',
        icon: <FiIcons.FcProcess />,
        data:{}
      },{
        title: 'Category Nano',
        path: '/masters/nano',
        icon:<FiIcons.FcProcess />,
        data:{}
      },
    ]
  }, */
 

];