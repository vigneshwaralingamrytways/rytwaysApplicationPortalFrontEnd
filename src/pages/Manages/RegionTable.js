import React from 'react';
import * as BsIcons from 'react-icons/bs'
import * as FaIcons from 'react-icons/fa'
import {AiOutlinePullRequest,AiOutlineReconciliation} from 'react-icons/ai'

// This is the table constant/settings which needed to render table elements

export const RegionTable = (showFormHandler,actions) => {
  return [
    {
      title: 'Region',
      align:'left',
      render: rowData => {
        return <span>{rowData.regionName}</span>;
      
      },
      
    },
    {
      title: 'Group',
      align:'left',
      render: rowData => {
        return <span>{rowData.groupName}</span>;
      
      },
      
    },
    {
      title: 'State',
      align:'left',
      render: rowData => {
        return <span>{rowData.state?.stateName}</span>;
      
      },
      
    },
    {
      title: 'Country Name',
      align:'left',
      render: rowData => {
        return <span>{rowData.country?.countryName}</span>;
      
      },
      
    },
    /*
    {
      title: 'Discount',
      align:'left',
      render: rowData => {
        return <FaIcons.FaPercentage style={{cursor:"pointer"}} onClick={showFormHandler(rowData,actions[3])}></FaIcons.FaPercentage>
      },
    },
    {
      title: 'Terms',
      align:'center',
      render: rowData => {
        return <FaIcons.FaRegFileAlt style={{cursor:"pointer"}} onClick={showFormHandler(rowData,actions[2])}></FaIcons.FaRegFileAlt>
      },
    }, */
      {
        title: 'Edit',
        align:'center',
        render: rowData => {
          return <FaIcons.FaEdit style={{cursor:"pointer"}} onClick={showFormHandler(rowData,actions[1])}></FaIcons.FaEdit>
        },
      }
  ];
};


export default RegionTable

