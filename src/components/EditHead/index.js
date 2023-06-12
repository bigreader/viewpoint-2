import React from 'react';
import './EditHead.css';

export default (props) => (
  <div className="edit-head">
    <h2>{props.children}</h2>
    {props.editable === false ? null : <button className={`btn btn-sm btn${props.editing? '' : '-outline'}-secondary`} onClick={props.onEdit}>{props.editing? 'Done' : 'Edit'}</button>}
  </div>
);
