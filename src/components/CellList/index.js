import React from 'react';
import Cell from '../Cell';
import EditHead from '../EditHead';
import CellAdd from '../CellAdd';
import './CellList.css';

class CellList extends React.Component {
  state = {
    editing: false
  }

  isActive = (id) => {
    return this.props.selectFrom === this.props.selected.from && id === this.props.selected.id
  }

  handleEdit = () => this.setState({ editing: !this.state.editing });

  render() {
    return (
      <>
        {this.props.head === false ? null : <EditHead editable={this.props.editable} editing={this.state.editing} onEdit={this.handleEdit}>{this.props.list}</EditHead>}
        <ul id={'list-' + this.props.list.toLowerCase()} className={'cell-list' + (this.props.grid ? ' cell-grid' : '')}>
          {!this.props.cells ? this.props.children : this.props.cells.map(cell => (
            <Cell
              key={cell.id || cell.key || Math.random()}
              live={this.props.selectFrom || cell.link}
              active={this.props.selectFrom && this.isActive(cell.id)}
              link={cell.link}
              title={cell.title}
              status={cell.status}
              bg={cell.bg}
              editing={this.state.editing}
              onClick={this.props.selectFrom ? () => this.props.onSelect(this.props.selectFrom, cell.id) : null}
              onDelete={() => this.props.api.delete(cell.id)}
            >
              {cell.body}
            </Cell>
          ))}
          {(this.state.editing || (this.props.api && this.props.cells && this.props.cells.length === 0))
            && <CellAdd
              type={this.props.list.toLowerCase().replace(/s$/, '')}
              onCreate={data => this.props.api.create(data).then(() => {
                this.setState({ editing: true });
              })} />}
        </ul>
      </>
    )
  }
}

export default CellList;
