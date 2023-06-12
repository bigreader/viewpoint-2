import React from 'react';
import './Placeholder.css';

export default props => (
  <div className="placeholder">
    <img src="/img/placeholder.svg" alt=""/>
    <p>{props.children}</p>
  </div>
);
