// src/Pages/Release/ReleaseProcess.js
import React from "react";
import classes from "./ReleaseProcess.module.css";
import { FaArrowLeft } from "react-icons/fa";

const ReleaseProcess = ({ processData = [], onBack }) => {
  // Group functions by process name
  const groupedData = processData.reduce((acc, item) => {
    const processName = item.activity.function.process.processName;
    if (!acc[processName]) acc[processName] = [];
    acc[processName].push(item);
    return acc;
  }, {});

  return (
    <div className={classes.processContainer}>
      <div className={classes.header}>
        <FaArrowLeft className={classes.backIcon} onClick={onBack} />
        <h2 className={classes.title}>Process & Functions</h2>
      </div>

      <div className={classes.scrollArea}>
        {Object.keys(groupedData).map((process, i) => (
          <div key={i} className={classes.processCard}>
            <h3 className={classes.processTitle}>{process}</h3>
            {groupedData[process].map((item, idx) => (
              <div key={idx} className={classes.functionBlock}>
                <h4 className={classes.functionTitle}>{item.activity.function.functionName}</h4>
                <p className={classes.activityName}><strong>Activity:</strong> {item.activity.activityName}</p>
                <p className={classes.description}><strong>Description:</strong> {item.activity.description}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReleaseProcess;
