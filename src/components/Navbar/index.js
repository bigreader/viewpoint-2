import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import API from '../../utils/api';
import './Navbar.css';

class Navbar extends React.Component {

  state = {
    decisions: null
  }

  componentDidMount() {
    this.reload();
  }

  reload = () => {
    if (this.props.showDecisions) {
      API.decision.list().then(res => {
        this.setState({
          decisions: res.data
        });
      });
    }
  }

  render() {
    return (
      <nav className={'navbar navbar-dark font-weight-bold justify-content-between bg-' + (this.props.bg || (this.props.current && this.props.current.bg()) || 'prob-p')}>
        <Link className="navbar-brand" to="/dashboard"><img src="/img/logo.svg" alt=""/> Viewpoint</Link>
        {this.state.decisions &&
          <div className="nav-item dropdown" style={{ fontSize: '1.5em', lineHeight: '1em' }}>
            <a className="nav-link text-white dropdown-toggle" href="/decisions" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              {this.props.current ? this.props.current.name : 'Decisions'}
            </a>
            <div className="dropdown-menu">
              {this.state.decisions.map((decision, i) => {
                return <NavLink key={decision._id} className="dropdown-item" to={'/decisions/' + decision._id}>{decision.name}</NavLink>;
              })}
              <div className="dropdown-divider"></div>
              <Link to="/dashboard" className="dropdown-item">All decisions...</Link>
            </div>
          </div>}
        <div className="nav-item dropdown">
          <a className="nav-link text-white dropdown-toggle" href="/account" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            Account
            </a>
          <div className="dropdown-menu">
            <Link to="/" className="dropdown-item">Sign out</Link>
          </div>
        </div>
      </nav>
    )
  }
}

export default Navbar;
