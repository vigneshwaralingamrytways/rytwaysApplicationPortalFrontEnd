import React, { useState } from 'react';
import { FaExchangeAlt } from 'react-icons/fa';
import classes from './MainComponent.module.css';

const SlidingComponent = () => (
  <div className={classes.contentBox}>
    <h2>Sliding Component</h2>
    <p>This is the sliding content.</p>
  </div>
);

const ReleaseInfoComponent = () => (
  <div className={classes.contentBox}>
    <h2>Release Info Component</h2>
    <p>This is the release information content.</p>
  </div>
);

const MainComponent = () => {
  const [showSliding, setShowSliding] = useState(true);

  const toggleView = () => {
    setShowSliding(prev => !prev);
  };

  return (
    <div className={classes.mainContainer}>
      {/* Top Left Switch Icon */}
      <FaExchangeAlt
        className={classes.switchIcon}
        title="Switch View"
        onClick={toggleView}
      />

      {/* Conditional Component Rendering */}
      {showSliding ? <SlidingComponent /> : <ReleaseInfoComponent />}
    </div>
  );
};

export default MainComponent;
