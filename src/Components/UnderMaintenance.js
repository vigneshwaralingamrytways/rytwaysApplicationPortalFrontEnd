import React from 'react';
import classes from './NewLink.module.css'; // Reusing your CSS

const UnderMaintenance = () => {
  return (
    <div className={classes.noticecontainer}>
      <div className={classes.noticecard}>
        <h1 className={classes.noticetitle}> This Function Is Not Yet Available</h1>
        <p className={classes.noticemessage}>
        We're still working on this feature<br />
        Please check back later or contact the support team for more details<br />
          <br />
          Thank you for your patience and understanding.<br />
          <br />
          The Rytwas Team
        </p>
      </div>
    </div>
  );
};

export default UnderMaintenance;
