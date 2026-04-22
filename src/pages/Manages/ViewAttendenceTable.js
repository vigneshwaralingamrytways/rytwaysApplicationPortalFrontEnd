

import React, { useState } from "react";
import * as FaIcons from "react-icons/fa";
import { format, subDays, eachDayOfInterval, isSunday } from "date-fns";
const ViewAttendenceTable = ({ showFormHandler, actions,  days = [],data = [], holidays = [] }) => {



    //  const presentcolor = getColor(rowData.attendenceId, "present");
    //   const halfcolor = getColor(rowData.attendenceId, "half");


    // const today = new Date();
    // const startdate = subDays(today, 29);
    // const days = eachDayOfInterval({ start: startdate, end: today })


    const getColor = (status, isHoliday) => {
        if (isHoliday) return "orange";
        if (status === "present") return "green";
        if (status === "half") return "yellow";
        if (status === "absent") return "red";
        if(status === "leave")return "blue"
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
            val: "departmentName",
            render: (rowData) => <span>{rowData.departmentName}</span>
        },
        ...days.map((day) => ({
            title: format(day, "dd/MM/yyyy"),
            align: "center",
            val: format(day, "dd/MM/yyyy"),
            render: (rowData) => {
                const dateStr = format(day, "dd/MM/yyyy");
                const status = rowData.attendence?.[dateStr] || rowData.status || "present";
                const isHoliday = isSunday(day) || holidays.includes(dateStr);
                return (
                    <span>
                        <FaIcons.FaCircle color={getColor(status, isHoliday)} />
                    </span>
                );
            }

        })),
        {
            title: "Total Working Days",
            align: "center",
            val: "totalWorking",
            render: (rowData) => {
                const workingDays = days.filter(
                    (day) => !isSunday(day) && !holidays.includes(format(day, "dd/MM/yyyy"))
                ).length;
                return <span>{workingDays}</span>;
            },
        },
         {
      title: "Total Present",
      align: "center",
      val: "totalPresent",
      render: (rowData) => {
        const presentCount = days.filter((day) => {
          const dateStr = format(day, "dd/MM/yyyy");
          const status = rowData.attendence?.[dateStr] || rowData.status || "absent";
          const isHoliday = isSunday(day) || holidays.includes(dateStr);
          return !isHoliday && status === "present";
        }).length;
        return <span>{presentCount}</span>;
      },
    },
{
  title: "Total Half",
  align: "center",
  val: "totalHalf",
  render: (rowData) => {
    const count = days.filter((day) => {
      const dateStr = format(day, "dd/MM/yyyy");
      const status = rowData.attendence?.[dateStr] || rowData.status || "present";
      const isHoliday = isSunday(day) || holidays.includes(dateStr);
      return !isHoliday && status === "half";
    }).length;
    return <span>{count}</span>;
  },
}
,
 {
      title: "Total Absent",
      align: "center",
      val: "totalAbsent",
      render: (rowData) => {
        const absentCount = days.filter((day) => {
          const dateStr = format(day, "dd/MM/yyyy");
          const status = rowData.attendence?.[dateStr] || rowData.status || "absent";
          const isHoliday = isSunday(day) || holidays.includes(dateStr);
          return !isHoliday && status === "absent";
        }).length;
        return <span>{absentCount}</span>;
      },
    },


 {
      title: "Total Leave",
      align: "center",
      val: "totalLeave",
      render: (rowData) => {
        const leaveCount = days.filter((day) => {
          const dateStr = format(day, "dd/MM/yyyy");
          const status = rowData.attendence?.[dateStr] || rowData.status || "absent";
          const isHoliday = isSunday(day) || holidays.includes(dateStr);
          return !isHoliday && status === "leave";
        }).length;
        return <span>{leaveCount}</span>;
      },
    },


    ];
};

export default ViewAttendenceTable;