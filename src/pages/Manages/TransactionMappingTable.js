
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as FaIcons from 'react-icons/fa'
const TransactionMappingTable = () => {
  return [
    {
      title: "Transaction Date",
      align: "left",
      render: (rowData) => (
        <span>{rowData.transactionDate}</span>
      ),
    },

    {
      title: "Account No",
      align: "left",
      render: (rowData) => (
        <span>{rowData.accountNo}</span>
      ),
    },

    

    {
      title: "Transaction Amount",
      align: "right",
      render: (rowData) => (
        <span>{rowData.amount}</span>
      ),
    },

    {
      title: "Utilized Amount",
      align: "right",
      render: (rowData) => (
        <span>{rowData.utilizedAmount || 0}</span>
      ),
    },
  ];
};

export default TransactionMappingTable;
