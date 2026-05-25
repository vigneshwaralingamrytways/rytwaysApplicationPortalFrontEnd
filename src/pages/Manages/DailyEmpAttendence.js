import React, { useContext, useState, useEffect, useCallback } from "react";
import Calendar from "./Calender";
import { api, AuthContext, classes, useFetch } from "../../Components/CommonImports/CommonImports";


const DailyEmpAttendence = () => {
    const { post, get, response, loading } = useFetch({ data: [] });
    const [attendanceData, setAttendanceData] = useState([]);
    const authCtx = useContext(AuthContext);
    const uName = authCtx.userName;
    const loadMyAttendance = useCallback(async () => {
        if (!uName) return;
        console.log(" u name" + uName)
        const data = await post(`${api}/manageEmployee/getAttendence`, { personName: uName });
        console.table(data)
        if (response.ok && Array.isArray(data)) {

            const formatted = data.map((item, index) => {

                return {
                    id: index,
                    date: item.markAttendanceDate,
                    status: item.attendanceType?.attendenceTypeName?.toLowerCase() || "present"
                }
            });
            setAttendanceData(formatted);
        } else {
            setAttendanceData([]);
        }
    }, [uName, post, response.ok]);

    useEffect(() => {
        loadMyAttendance();
    }, [loadMyAttendance]);

    
    return (
        <div className={classes.container}>

            <div style={{
                background: "white",
                padding: "20px",
                borderRadius: "12px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                height: "85vh"
            }}>
                <div style={{ marginBottom: "15px" }}>
                    <h3 style={{ color: "#1976d2", fontWeight: "bold" }}>My Attendance Calendar</h3>
                </div>

                <Calendar attendanceData={attendanceData} />
            </div>
        </div>
    );
};

export default DailyEmpAttendence;