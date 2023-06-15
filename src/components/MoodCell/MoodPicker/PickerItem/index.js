import React from 'react';

const PickerItem = props => (
  <div className={"picker-item" + (props.selected? ' active' : '')} onClick={props.onClick}>
    <img src={`/img/mood-${props.val}.svg`} alt={props.val} />
  </div>
);

export default PickerItem
