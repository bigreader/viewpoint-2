import React from 'react';
import { Link } from 'react-router-dom';
import './Cell.css';

export default (props) => {
  const contents = (
    <>
      {props.title && <h3 className="title">{props.title}</h3>}
      {props.status && <p className="status">{props.status}</p>}
      {props.children && <p className="body">{props.children}</p>}
      {props.live && <div className="selectable" onClick={props.onClick}></div>}
      {props.editing && <button className="delete" onClick={props.onDelete}>&times;</button>}
      {props.picker}
    </>
  );

  let className = 'bg-';
  className += props.bg || 'unknown';
  if (props.active) className += ' active';
  if (props.picker) className += ' mood-cell';

  return (
    <li className={className}>
      {(props.link && !props.editing) ? <Link to={props.link}>{contents}</Link> : contents}
    </li>
  );
}



