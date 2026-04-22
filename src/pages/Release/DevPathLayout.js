 import React from "react";
import { FaArrowCircleLeft, FaArrowLeft } from "react-icons/fa";
import classes from "./DevPathLayout.module.css";

const DevPathLayout = ({ children, onBack }) => {
  return (
    <div className={classes.container}>
      <div className={classes.content}>
        <div className={classes.backButton} onClick={onBack}>
          <FaArrowCircleLeft
           style={{color:"#2e7d32"}} title="Back" />
        </div>
        <div className={classes.innerContent}>{children}</div>
      </div>
    </div>
  );
};

export default DevPathLayout;
 


/* import React from "react";
import { FaArrowCircleLeft } from "react-icons/fa";
import { FaCommentDots } from "react-icons/fa";  // comment/query icon
import classes from "./DevPathLayout.module.css";

const DevPathLayout = ({ children, onBack, onComment }) => {
  return (
    <div className={classes.container}>
      <div className={classes.content}>
        
        
        <div className={classes.backButton} onClick={onBack}>
          <FaArrowCircleLeft style={{ color: "#2e7d32" }} title="Back" />
        </div>

        
        <div className={classes.commentButton} onClick={onComment}>
          <FaCommentDots style={{ color: "#2e7d32" }} title="Queries / Comments" />
        </div>

        
        <div className={classes.innerContent}>{children}</div>
      </div>
    </div>
  );
};

export default DevPathLayout;
 */