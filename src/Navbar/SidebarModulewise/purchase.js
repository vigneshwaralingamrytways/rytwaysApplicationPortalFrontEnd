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

//export const purchaseMenu = [17,18].includes(Number(localStorage.roleId)) || localStorage.userId==1? [

// user id !=199
export const purchaseMenu = (roleId,userId,departmentIds) => [
 /*  { id:1,
    title: 'Home',
    path: '/modules',
    icon:  <LetterIcon letter="H" />
  }, */
  // {
  //   id:1,
  //   title: 'PR Template',
  //   path: '/purchase/prtemplate',
  //   icon:  <LetterIcon letter="P" />
  // }, 
  // // {
  //   title: 'Dashboard',
  //   path: '/purchase/dashboard',
  //   icon:  <LetterIcon letter="H" />
  // },
//   {
//     title: 'Po Material',
//     path: '/purchase/poentry',
//     icon:  <LetterIcon letter="M" />,
//   },
//   {
//     title: 'Po Service',
// path: '/purchase/ServicePoEntry',
// icon:  <LetterIcon letter="S" />,
//     data:{}
//   },
  // {
  //   title: 'New Po',
  //   path: '/purchase',
  //   icon: <AiIcons.AiFillHome />,
  //   iconClosed: <RiIcons.RiArrowDownSFill />,
  //   iconOpened: <RiIcons.RiArrowUpSFill />,

  //   subNav: [
      
  //     {
  //       title: 'Material Po',
  //   path: '/purchase/poentry',
  //   icon:  <LetterIcon letter="M" />,
  //       data:{}
  //     },
  //     {
  //       title: 'Service Po',
  //   path: '/purchase/ServicePoEntry',
  //   icon:  <LetterIcon letter="S" />,
  //       data:{}
  //     },
  //     // {
  //     //   title: 'Job Order Po',
  //     //   path: '/purchase/joPo',
  //     //   icon:  <LetterIcon letter="J" />,
  //     //   data:{}
  //     // },
  //   ]
  // },
  // {
  //   title: 'Job  Order Request',
  //   path: '/purchase/jorder',
  //   icon:  <LetterIcon letter="J" />
  // },
  // {
  //   title: 'Capex PR',
  //   path: '/purchase/capexpr',
  //   icon:  <LetterIcon letter="C" />
  // }, 
  // 

  ...( ([109].includes(userId))
  ? [
    {
      title: 'PO Search',
      path: '/purchase/Ceoposearch',
      icon:  <LetterIcon letter="P" />
    },
  ]: ([1,17,18].includes(roleId) && [1,20].includes(departmentIds))
  ? [
    {
      // title: 'RM CHM PAK Material',
      title: 'RM Import',
      path: '/purchase/ceoMatprsearch',
      icon:  <LetterIcon letter="C" />,
      data :{poTypes:"Po"}
    },

  {
    title: 'PR Material',
    path: '/purchase/matprsearch',
    icon:  <LetterIcon letter="M" />,
    data :{poTypes:"Po"}
  },
  {
    title: 'PR Service',
    path: '/purchase/serviceprsearch',
    icon:  <LetterIcon letter="S" />,
    data :{poTypes:"Service"}
  },
  // {
  //   title: 'PR Search',
  //   path: '/purchase/prsearch',
  //   icon:  <LetterIcon letter="H" />,
  //   iconClosed: <RiIcons.RiArrowDownSFill />,
  //   iconOpened: <RiIcons.RiArrowUpSFill />,

  //   subNav: [
      
  //     {
  //       title: 'Material Pr',
  //       path: '/purchase/matprsearch',
  //       icon:  <LetterIcon letter="M" />,
  //       data :{poTypes:"Po"}
  //     },
  //     {
  //       title: 'Service Pr',
  //       path: '/purchase/serviceprsearch',
  //       icon:  <LetterIcon letter="S" />,
  //       data :{poTypes:"Service"}
  //     },
  //     // {
  //     //   title: 'Job Order Pr',
  //     //   path: '/purchase/joprsearch',
  //     //   icon:  <LetterIcon letter="J" />,
  //     //   data :{poTypes:"Jo"}
  //     // },
  //   ]
  // },
  {
    title: 'PO Search',
    path: '/purchase/posearch',
    icon:  <LetterIcon letter="P" />
  },
  {
    title: 'Po Excel Download',
    path: '/purchase/poTallyDownload',
    icon:  <LetterIcon letter="M" />,
    data :{poTypes:"Po"}
  },
  // {
  //   title: 'Grn Entry Search',
  //   path: '/purchase/grnEntrySearch',
  //   icon:  <LetterIcon letter="G" />
  // },
  {
    title: 'PO Items Search',
    path: '/purchase/poitemssearch',
    icon:  <LetterIcon letter="P" />
  },
] : [
 
   {
     title: 'PO Search',
     path: '/purchase/posearch',
     icon:  <LetterIcon letter="P" />
   },
   
   {
     title: 'PO Items Search',
     path: '/purchase/poitemssearch',
     icon:  <LetterIcon letter="P" />
   },
 ]
 ),
 

];


// {
//   title: 'Master',
//   path: '#',
//   icon: <AiIcons.AiFillHome style={{ fontSize: '.9rem', margin: 'auto 0' }} />,
//   iconClosed: <RiIcons.RiArrowDownSFill style={{ fontSize: '.9rem', margin: 'auto 0' }} />,
//   iconOpened: <RiIcons.RiArrowUpSFill style={{ fontSize: '.9rem', margin: 'auto 0' }} />,

//   subNav: [
//     {
//       title: 'Product Master',
//       path: '/Master/Products',
//       icon: <IoIcons.IoIosPaper style={{ fontSize: '.9rem', margin: 'auto 0' }} />
//     },
//     {
//       title: 'Machines',
//       path: '/masters/machines',
//       icon: <FiIcons.FcProcess style={{ fontSize: '.9rem', margin: 'auto 0' }} />
//     }
//   ]
// }


// {
//   title: 'Purchase Requests',
//   path: '/purchase',
//   icon: <AiIcons.AiFillHome />,
//   iconClosed: <RiIcons.RiArrowDownSFill />,
//   iconOpened: <RiIcons.RiArrowUpSFill />,

//   subNav: [
    
//     {
//       title: 'Material PR',
//   path: '/purchase/materialpr',
//       icon: <FiIcons.FcProcess />,
//       data:{}
//     },
//     {
//       title: 'Service PR',
//   path: '/purchase/servicepr',
//       icon: <FiIcons.FcProcess />,
//       data:{}
//     },{
//       title: 'Job Order PR',
//       path: '/purchase/joPr',
//       icon: <FiIcons.FcProcess />,
//       data:{}
//     },
//   ]
// },