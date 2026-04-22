import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as FaIcons from 'react-icons/fa'

const BillTable = ({ showFormHandler, actions }) => {
    return [


        {
            title: "Invoice Date",
            align: 'left',

            render: rowData => {
                return <span>{rowData.invoiceHeader?.invoiceDate}</span>;
            },
        },

        {
            title: "Invoice No",
            align: 'left',

            render: rowData => {
                return <span>{rowData.invoiceHeader?.invoiceNo}</span>;
            },
        },
        //  {
        //     title: "Invoice Amount",
        //     align: 'right',

        //     render: rowData => {
        //         return <span>{rowData.PaymentDetails?.netTotal}</span>;
        //     },
        // },
        {
            title: "Utilized Amount",
            align: 'right',

            render: rowData => {
                return <span>{rowData.bill?.utilizedAmount}</span>;
            },
        },

        {
            title: "Edit",
            align: 'center',
            render: rowData => {
                return <FaIcons.FaEdit
                    style={{ cursor: "pointer" }}
                    //   onClick={() => showFormHandler(rowData, actions[0])}
                    onClick={showFormHandler(rowData, actions[0])}
                >

                </FaIcons.FaEdit>
            },
        },
        {
            title: "Delete",
            align: 'center',
            render: rowData => {
                return <FaIcons.FaTrashAlt
                    style={{ cursor: "pointer" }}

                    onClick={showFormHandler(rowData, actions[1])}>

                </FaIcons.FaTrashAlt>
            },
        },


    ];
};



export default BillTable;
