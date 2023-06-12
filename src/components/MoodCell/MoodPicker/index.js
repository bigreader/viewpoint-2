import React from 'react';
import PickerItem from './PickerItem';

class MoodPicker extends React.Component {
  state = {
    selected: this.props.mood.val
  }

  select = (n) => {
    this.setState({ selected: n });
    this.props.api.update(this.props.mood._id, {
      val: n,
      set: true
    });
  }

  render = () => (
    <div className="mood-picker">
      {[1, 2, 3, 4, 5].map(n => (
        <PickerItem key={n} val={n} selected={n === this.state.selected} onClick={() => this.select(n)} />
      ))}
    </div>
  );
}

export default MoodPicker;
