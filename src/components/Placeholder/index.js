import React from 'react';
import './Placeholder.css';

const Placeholder = props => (
  <div className="placeholder">
    <img src="/img/placeholder.svg" alt=""/>
    <p>{props.children}</p>
  </div>
);

export default Placeholder
