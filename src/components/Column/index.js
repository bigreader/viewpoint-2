import React from 'react';
import './Column.css';

const Column = props => {
  const cols = props.col.split(' ').map(str => 'col-' + str).join(' ');
  let className = (cols || 'col') + (props.className? ' ' + props.className : '');
  return (
    <div className={className} style={props.style}>
      {props.children}
    </div>
  )
}

export default Column
