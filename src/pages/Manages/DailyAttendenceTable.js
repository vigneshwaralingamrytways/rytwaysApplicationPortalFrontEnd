import { gridFilterableColumnLookupSelector } from "@mui/x-data-grid";
import React, { useState } from "react";
import * as FaIcons from "react-icons/fa";

const DailyAttendenceTable = ({showFormHandler,actions,data = [],onCalendarClick,events=[]}) => {


const [attendence,SetAttendence]=useState(data.map(()=>"present"))
const [attendenceStatus, setAttendenceStatus] = useState(()=>{
const init={};
data.forEach(emp =>{
    init[emp.attendenceId]=emp.status || "present"
})
return init;

});


//  const presentcolor = getColor(rowData.attendenceId, "present");
//   const halfcolor = getColor(rowData.attendenceId, "half");


// const handleClick=(rowData,)
const handleClick = (id, status) => {
   setAttendenceStatus(prev => ({
    ...prev,
    [id]: status
  }));
};

const getColor = (id, status) => {

    const current=attendenceStatus[id];


  if (current=== status) {
    if (status === "present") return "green";
    if (status === "half") return "yellow";
    if (status === "absent") return "red";
    if(status === "leave") return "blue";
  }
  return "grey"; 
};




  return [
    {
      title: "Employee Name",
      align: "left",
      val: "employeeName",
      render: (rowData) => <span>{rowData?.employeeName}</span>,
    },
    {
      title: "Departmentt",
      align: "left",
      val: "department",
      render: (rowData) => <span>{rowData?.department}</span>,
    },

{
      title: "Calender",
      align: "center",
      render: (rowData) => (
        <>
          <span
            style={{ cursor: "pointer", color: "blue",  }}
            onClick={() => onCalendarClick(rowData)}

          >
            <FaIcons.FaCalendar />
          </span>
         
        </>
      ),
    },

//    {
//   title: "Present",
//   align: "center",
//   val: "present",
//   render: (rowData) => {
//     const color = getColor(rowData.attendenceId, "present");
//     return (
//       <span
//         style={{ cursor: "pointer" }}
//         onClick={() => handleClick(rowData.attendenceId, "present")}
//       >
//         <FaIcons.FaCircle color={color} />
//       </span>
//     );
//   },
// },
// {
//   title: "Half Day",
//   align: "center",
//   val: "half",
//   render: (rowData) => {
//     const color = getColor(rowData.attendenceId, "half");
//     return (
//       <span
//         style={{ cursor: "pointer" }}
//         onClick={() => handleClick(rowData.attendenceId, "half")}
//       >
//         <FaIcons.FaCircle color={color} />
//       </span>
//     );
//   },
// },
// {
//   title: "Absent",
//   align: "center",
//   val: "absent",
//   render: (rowData) => {
//     const color = getColor(rowData.attendenceId, "absent");
//     return (
//       <span
//         style={{ cursor: "pointer" }}
//         onClick={() => handleClick(rowData.attendenceId, "absent")}
//       >
//         <FaIcons.FaCircle color={color} />
//       </span>
//     );
  // },
// },



// {
//   title: "Leave",
//   align: "center",
//   val: "leave",
//   render: (rowData) => {
//     const color = getColor(rowData.attendenceId, "leave");
//     return (
//       <span
//         style={{ cursor: "pointer" }}
//         onClick={() => handleClick(rowData.attendenceId, "leave")}
//       >
//         <FaIcons.FaCircle color={color} />
//       </span>
//     );
//   },
// },

  ];
};

export default DailyAttendenceTable;