import React from 'react';
import CellList from '../components/CellList';
import Navbar from '../components/Navbar';
import Slice from '../components/Slice';
import Calc from '../utils/calc';
import Decision from '../utils/decision';
import PageContainer from '../components/PageContainer';
import Column from '../components/Column';
import Placeholder from '../components/Placeholder';

class DecisionPage extends React.Component {
  state = {
    decision: null,
    selected: {
      from: '',
      id: ''
    }
  }

  componentDidMount() {
    this.reloadDecision();
  }

  componentDidUpdate() {
    if (!this.state.decision || this.props.id !== this.state.decision.id) {
      this.reloadDecision();
    }
  }

  reloadDecision() {
    const decision = new Decision(this.props.id);
    decision.onRefresh(() => this.forceUpdate());
    decision.onChange(() => this.forceUpdate());

    this.setState({
      decision,
      selected: {
        from: '',
        id: ''
      }
    });
  }

  selectSlice = (from, id) => {
    this.setState({
      selected: { from, id }
    });
  }

  render() {
    if (!this.state.decision || !this.state.decision.data) {
      return (
        <>
          <Navbar showDecisions={true} bg="grad-3" />
          <PageContainer navbar={false}>
            <Column col="md-5 lg-3">
              <CellList list="Options" />
            </Column>

            <Column col="md-7 lg-5 xl-6" className="px-xl-5">
              <Placeholder>Loading...</Placeholder>
            </Column>

            <Column col="lg-4 xl-3">
              <CellList list="Insights" />
            </Column>
          </PageContainer>
        </>
      )
    }

    if (this.state.selected.from && !this.state.decision[this.state.selected.from].find(doc => doc._id === this.state.selected.id)) {
      this.setState({ selected: { from: '', id: '' }});
      return null;
    }

    return (
      <>
        <Navbar showDecisions={true} current={this.state.decision} />

        <PageContainer navbar={false}>
          <Column col="md-5 lg-3">
            <CellList list="Options" decision={this.state.decision} api={this.state.decision.apis.option}
              selectFrom="options" onSelect={this.selectSlice} selected={this.state.selected}
              cells={this.state.decision.options.map(option => {
                const moods = this.state.decision.moods.filter(mood => mood.option._id === option._id);
                return {
                  id: option._id,
                  title: option.name,
                  status: Calc.moods.summary(moods),
                  bg: Calc.moods.bg(moods, this.state.decision)
                }
              })} />
            <hr />
            <CellList list="Factors" decision={this.state.decision} api={this.state.decision.apis.factor}
              selectFrom="factors" onSelect={this.selectSlice} selected={this.state.selected}
              cells={this.state.decision.factors.map(factor => {
                const moods = this.state.decision.moods.filter(mood => mood.factor._id === factor._id);
                const good = moods.filter(mood => mood.val > 3).length
                return {
                  id: factor._id,
                  title: factor.name,
                  status: (good || 'No') + ' good option' + (good === 1 ? '' : 's'),
                  bg: Calc.moods.bg(moods, this.state.decision)
                }
              })} />
          </Column>

          <Column col="md-7 lg-5 xl-6" className="px-xl-5">
            <Slice decision={this.state.decision} selected={this.state.selected} onChangeMood={(id, data) => {
              this.state.decision.moods.find(mood => mood._id === id).assign(data)
            }} />
          </Column>

          <Column col="lg-4 xl-3">
            <CellList list="Insights" editable={false} cells={this.state.decision.getInsights()} />
          </Column>
        </PageContainer>
      </>
    );
  }
}

export default DecisionPage;
