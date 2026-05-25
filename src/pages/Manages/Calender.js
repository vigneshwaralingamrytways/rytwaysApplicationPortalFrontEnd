import React, { useState, useEffect } from "react";
import Scheduler from "react-mui-scheduler";

export default function Calendar({ attendanceData = [] }) {
  const MAX_EVENT_LENGTH = 1;
  console.log(" addten Dat in cal", attendanceData)
  const [state] = useState({
    options: {
      transitionMode: "zoom",
      startWeekOn: "mon",
      defaultMode: "month",
      minWidth: "100%",
      maxWidth: "100%",
      minHeight: 570,
      maxHeight: 570,
    },
    toolbarProps: {
      showSwitchModeButtons: true,
      showDatePicker: true,
    },
  });

  const [events, setEvents] = useState([]);
  const getColor = (status) => {
    switch (status) {
      case "present": return "green";
      case "half": return "yellow";
      case "leave": return "blue";
      case "absent": return "red";
      case "holidayt": return "orange";
      default: return "grey";
    }
  };

  useEffect(() => {
    if (!attendanceData || attendanceData.length === 0) {
      setEvents([]);
      return;
    }
    const converted = attendanceData.map((item) => {
      const statusLower = item.status?.toLowerCase();
      let color;
      switch (statusLower) {
        case "present": color = "green"; break;
        case "absent": color = "red"; break;
        case "leave": color = "blue"; break;
        case "half": color = "yellow"; break;
        default: color = "grey";
      }
      return { id: item.id, label: statusLower, date: item.date, start: new Date(item.date), end: new Date(item.date), color };
    });
    setEvents(converted);
  }, [attendanceData]);

  const preprocess = (evs) => {

  };

  return (
    <div>
      <Scheduler
        events={events}
        options={state.options}
        toolbarProps={state.toolbarProps}
        legacyStyle={false}
      />
    </div>
  );
}