import React from 'react';
import { Redirect } from 'react-router-dom';
import PageContainer from '../components/PageContainer';
import Column from '../components/Column';
import API from '../utils/api';

class AddDecisionPage extends React.Component {
  state = {
    data: {
      name: ''
    },
    creating: false,
    id: null
  }

  handleChange = ({ target }) => {
    this.setState({
      data: {
        [target.name]: target.value
      }
    });
  }

  submit = (event) => {
    event.preventDefault();
    if (this.state.created) return;
    this.setState({ created: true })
    API.decision.create(this.state.data).then(res => {
      this.setState({ id: res.data._id });
    });
  }

  render = () => {
    if (this.state.id) return <Redirect to={"/decisions/" + this.state.id} />
    else return (
      <PageContainer>
        <Column col="6" className="mx-auto">
          <h2>Add Decision</h2>
          <form onSubmit={this.submit}>
            <div className="form-group">
              <label for="name">Name</label>
              <input type="text" className="form-control" name="name" id="name" placeholder="My Decision" onChange={this.handleChange}/>
            </div>
            <button type="submit" className="btn btn-primary" disabled={this.state.creating}>Create</button>
          </form>
        </Column>
      </PageContainer>
    );
  }
}

export default AddDecisionPage;
