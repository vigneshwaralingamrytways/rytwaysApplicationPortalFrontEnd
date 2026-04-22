import { Type } from "lucide-react";
import React from "react";
import * as FaIcons from "react-icons/fa";
//same like curencymastertable.js
 const CountryNameMasterTable = (showFormHandler, actions) => {
   
   
   
    return [
        
        {
            title: "Country Name",
            align: "left",
            val: "countryName",
            render: (rowData) => <span>{rowData?.countryName}</span>,
        },
        {
            title: "Action",
            align: "center",
            render: (rowData) => (
                <>
                    <span
                        style={{ cursor: "pointer", color: "blue", marginRight: 10 }}
                        onClick={showFormHandler(rowData, actions[0])}
                    >
                        <FaIcons.FaEdit />
                    </span>
                    {/* <span
                        style={{ cursor: "pointer", color: "red" }}
                        onClick={showFormHandler(rowData, actions[1])}
                    >
                        <FaIcons.FaTrash />
                    </span> */}
                </>
            ),
        },

       
        {
            title: "Action",
            align: "center",
            render: (rowData) => (
                <>
                    {/* <span
                        style={{ cursor: "pointer", color: "blue", marginRight: 10 }}
                        onClick={showFormHandler(rowData, actions[0])}
                    >
                        <FaIcons.FaEdit /> */}
                    {/* </span> */}
                    <span
                        style={{ cursor: "pointer", color: "red" }}
                        onClick={showFormHandler(rowData, actions[1])}
                    >
                        <FaIcons.FaTrash />
                    </span>
                </>
            ),
        },
    ];
};

export default CountryNameMasterTable;
