/* import React from 'react';
import classes from "./NewLink.module.css";

const LinkUpdateNotice = () => {
  return (
    <div className={classes.noticecontainer}>
      <div className={classes.noticecard}>
        <h1 className={classes.noticetitle}>Link Update Notice</h1>
        <p className={classes.noticemessage}>
          <span className={classes.oldlink}>VAFDigitalFactory</span> link has been changed to<br />
          <span className={classes["new-link"]}>http://app.rytways.com:9080/VAFDigitalFactory/</span>
        </p>
        <a
          href="http://app.rytways.com:9080/VAFDigitalFactory/"
          target="_blank"
          rel="noopener noreferrer"
          className={classes["visit-button"]}
        >
          Go to New Link
        </a>
      </div>
    </div>
  );
};

export default LinkUpdateNotice;
 */

import React from 'react';
import classes from "./NewLink.module.css";

const portals = [
  {
    name: "Sripathi IT Requirement Portal",
    link: "http://demo2.rytways.com:9090/SripathiITReqtPortal",
    username: "Admin",
    password: "Admin@456"
  },
  {
    name: "Sripathi Development Portal",
    link: "http://demo2.rytways.com:9090/SripathiDevPortal",
    username: "Admin",
    password: "Admin@456"
  },
  {
    name: "Sripathi Customer Portal",
    link: "http://demo2.rytways.com:9090/SripathiCustomerPortal/",
    username: "Admin",
    password: "Admin@456"
  },
  {
    name: "Sripathi Operational Portal",
    link: "http://demo2.rytways.com:9090/SripathiDigitalFactory",
    username: "Admin",
    password: "Admin@456"
  }
];

const LinkUpdateNotice = () => {
  return (
    <div className={classes.noticecontainer}>
      <div className={classes.noticecard}>
        <h1 className={classes.noticetitle}>Sripathi Portal Links</h1>
        <div className={classes.portalList}>
          {portals.map((portal, index) => (
            <div key={index} className={classes.portalItem}>
              <h2 className={classes.portalName}>{portal.name}</h2>
              <p className={classes.portalInfo}>
                <strong>Link:</strong>{' '}
                <a href={portal.link} target="_blank" rel="noopener noreferrer" className={classes["new-link"]}>
                  {portal.link}
                </a>
              </p>
              <p className={classes.portalInfo}>
                <strong>Username:</strong> {portal.username}
              </p>
              <p className={classes.portalInfo}>
                <strong>Password:</strong> {portal.password}
              </p>
              <a
                href={portal.link}
                target="_blank"
                rel="noopener noreferrer"
                className={classes["visit-button"]}
              >
                Visit Portal
              </a>
              {index < portals.length - 1 && <hr className={classes.divider} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LinkUpdateNotice;
