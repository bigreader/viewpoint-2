import React from 'react';
import './CellAdd.css';

class CellAdd extends React.Component {
  state = {
    text: '',
    focused: false
  }

  render = () => (
    <li className="cell-add">
      <form onSubmit={event => {
        event.preventDefault();
        this.props.onCreate({ name: this.state.text })
        this.setState({ text: '' });
      }}>
        <input type="text" className="title" placeholder={`Add ${this.props.type}...`}
          value={this.state.text} onChange={event => this.setState({ text: event.target.value })} />
      </form>
    </li>
  )
}

export default CellAdd;
