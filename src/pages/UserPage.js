import React from 'react';
import PageContainer from '../components/PageContainer';
import Column from '../components/Column';
import CellList from '../components/CellList';
import API from '../utils/api';
import { Redirect } from 'react-router-dom';
import Decision from '../utils/decision';

class UserPage extends React.Component {
  state = {
    username: '',
    decisions: [],
    redirect: null
  }

  componentDidMount = () => {
    API.user.me().then(res => {
      this.setState({ username: res.data.username });

      API.decision.list().then(res => {
        this.setState({ decisions: res.data.map(obj => new Decision(obj)) });
      })
    })
  }

  displayName = (str) => {
    if (!str) return str;
    const lowercase = str.toLowerCase();
    if (str !== lowercase) return str;
    let letters = lowercase.split('');
    letters[0] = letters[0].toUpperCase();
    return letters.join('');
  }

  handleCreate = data => {
    return API.decision.create(data).then(res => {
      this.setState({
        // decisions: this.state.decisions.concat([res.data]),
        redirect: '/decisions/' + res.data._id
      });
    }).catch(console.log);
  }

  handleDelete = id => {
    return API.decision.delete(id).then(res => {
      this.setState({
        decisions: this.state.decisions.filter(d => d.id !== id)
      });
    }).catch(console.log);
  }

  render = () => {
    const decisionCount = this.state.decisions.length;
    const moodCount = this.state.decisions.reduce((acc, decision) => acc + decision.moods.length, 0);

    return (
      <PageContainer>
        {this.state.redirect && <Redirect to={this.state.redirect} />}
        <Column col="md-6 lg-4" className="text-center d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
          <img src="/img/avatar.png" alt="avatar" className="rounded-circle w-50 h-auto mb-4" />
          <p className="i mb-0">Welcome,</p>
          <h2 className="text-center">{this.displayName(this.state.username) || 'Anonymous'}</h2>
          <p className="text-secondary">{decisionCount} decisions &mdash; {moodCount} feelings</p>
        </Column>
        <Column col="md-6 lg-8">
          <CellList grid list="Decisions"
            api={{
              create: this.handleCreate,
              delete: this.handleDelete
            }}
            cells={this.state.decisions.map(decision => {
              return {
                id: decision.id,
                title: decision.name,
                link: '/decisions/' + decision.id,
                bg: decision.bg()
              }
            })} />
        </Column>
      </PageContainer>
    );
  }
}

export default UserPage;
