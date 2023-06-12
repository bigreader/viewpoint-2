import React from 'react';

export default props => (
  <div className={"picker-item" + (props.selected? ' active' : '')} onClick={props.onClick}>
    <img src={`/img/mood-${props.val}.svg`} alt={props.val} />
  </div>
);
