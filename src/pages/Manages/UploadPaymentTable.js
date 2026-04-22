import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as FaIcons from 'react-icons/fa'

const UploadPaymentTable = (showFormHandler, actions) => {
    return [


        {
            title: "File Name",
            align: 'left',

            render: rowData => {
                return <span>{rowData.fileName}</span>;
            },
        },

        {
            title: "Desc ",
            align: 'left',

            render: rowData => {
                return <span>{rowData.desc}</span>;
            },
        },

        {
            title: "View",
            align: 'center',
            render: rowData => {
                return <FaIcons.FaEye
                    style={{ cursor: "pointer" }}
                    onClick={showFormHandler(rowData, "view")}>

                </FaIcons.FaEye>
            },
        },
        {
            title: "Delete",
            align: 'center',
            render: rowData => {
                return <FaIcons.FaTrashAlt
                    style={{ cursor: "pointer" }}

                    onClick={showFormHandler(rowData, "print")}>

                </FaIcons.FaTrashAlt>
            },
        },


    ];
};



export default UploadPaymentTable;
