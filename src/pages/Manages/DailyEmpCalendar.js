import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { FaArrowLeft } from "react-icons/fa";

const DailyEmpCalendar = ({ employee, onBack }) => {
    const events = employee.attendance.map((att) => {
        const colorMap = {
            present: "green",
            absent: "red",
            leave: "blue",
            half: "yellow",
            holiday: "orange",
        };

        return {
            title: att.status.toUpperCase(),
            start: att.date,
            backgroundColor: colorMap[att.status.toLowerCase()] || "grey",
            borderColor: colorMap[att.status.toLowerCase()] || "grey",
            allDay: true,
        };
    });

    return (
        <div style={{ padding: "20px", background: "#f8f9fa", minHeight: "100vh" }}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
                <button 
                    onClick={onBack} 
                    style={{ 
                        marginRight: "20px", 
                        display: "flex", 
                        alignItems: "center", 
                        gap: "5px",
                        padding: "8px 15px",
                        cursor: "pointer"
                    }}
                >
                    <FaArrowLeft />
                    </button>
                <h2 style={{ margin: 0 }}>
                    Attendance Calendar: <span style={{ color: "blue" }}>{employee.employeeName}</span> 
                    <small> ({employee.department})</small>
                </h2>
            </div>

            <div style={{ background: "white", padding: "20px", borderRadius: "8px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
                <FullCalendar
                    plugins={[dayGridPlugin]}
                    initialView="dayGridMonth"
                    events={events}
                    height="75vh"
                    headerToolbar={{
                        left: "prev,next today",
                        center: "title",
                        right: "dayGridMonth",
                    }}
                />
            </div>
            <div style={{ marginTop: "20px", display: "flex", gap: "20px", justifyContent: "center" }}>
                <div><span style={{ color: 'green' }}>?</span> Present</div>
                <div><span style={{ color: 'red' }}>?</span> Absent</div>
                <div><span style={{ color: 'blue' }}>?</span> Leave</div>
                <div><span style={{ color: 'yellow' }}>?</span> Half Day</div>
            </div>
        </div>
    );
};

export default DailyEmpCalendar;