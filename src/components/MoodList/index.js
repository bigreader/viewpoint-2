import React from 'react';
import MoodCell from '../MoodCell';
// import './MoodList.css';

class MoodList extends React.Component {
  state = {
    editing: false
  }

  render() {
    const opposingSide = this.props.side === 'option' ? 'factor' : 'option';
    return (
      <ul className="cell-list mood-list">
        {this.props.moods && this.props.moods.map(mood => (
          <MoodCell key={mood._id} mood={mood} titleSide={opposingSide} api={this.props.decision.apis.mood} />
        ))}
      </ul>
    )
  }
}

export default MoodList;
