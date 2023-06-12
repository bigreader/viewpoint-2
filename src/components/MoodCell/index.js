import React from 'react';
import Cell from '../Cell';
import MoodPicker from './MoodPicker';
import './MoodCell.css';

class MoodCell extends React.Component {
  
  render() {
    return (
      <Cell
        title={this.props.mood[this.props.titleSide].name}
        bg={this.props.mood.set ? 'mood-' + this.props.mood.val : 'unknown'}
        picker={<MoodPicker mood={this.props.mood} api={this.props.api} />} />
    );
  }
}

export default MoodCell;
