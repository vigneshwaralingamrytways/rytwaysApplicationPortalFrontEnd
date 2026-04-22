import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as FaIcons from 'react-icons/fa'

const RenewalTable = ({showFormHandler, actions}) => {
    return [


        {
            title: "Renewal Date",
            align: 'left',

            render: rowData => {
                return <span>{rowData.renewalDate}</span>;
            },
        },

        {
            title: "AMC Start Date",
            align: 'left',

            render: rowData => {
                return <span>{rowData.amcStart}</span>;
            },
        },
         {
            title: "AMC End Date",
            align: 'left',

            render: rowData => {
                return <span>{rowData.amcEnd}</span>;
            },
        },
         {
            title: "Project Value",
            align: 'right',

            render: rowData => {
                return <span>{rowData.projectValue}</span>;
            },
        },

        {
            title: "Edit",
            align: 'center',
            render: rowData => {
                return <FaIcons.FaEdit
                    style={{ cursor: "pointer" }}
                    onClick={showFormHandler(rowData, actions[1])}>

                </FaIcons.FaEdit>
                
            },
        },
        {
            title: "Delete",
            align: 'center',
            render: rowData => {
                return <FaIcons.FaTrashAlt
                    style={{ cursor: "pointer" }}

                    onClick={showFormHandler(rowData, actions[2])}>

                </FaIcons.FaTrashAlt>
            },
        },


    ];
};



export default  RenewalTable;
