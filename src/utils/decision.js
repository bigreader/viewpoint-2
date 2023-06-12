import API from './api';
import insightTemplates from './insights';
import Calc from './calc';
// import Calc from './calc';

export default class Decision {

  data = null;
  id = '';
  name = 'Unloaded Decision';
  options = [];
  factors = [];
  moods = [];

  constructor(input) {
    if (typeof input === 'string') {
      this.id = input;
      this.refresh();
    } else {
      this.loadData(input);
    }
  }

  refresh = () => {
    API.decision.find(this.id).then(res => {
      console.log('refreshed decision', res.data);
      this.loadData(res.data);
      this.refreshCalls.forEach(call => call());
    });
  }

  loadData = (data) => {
    this.data = data;
    this.id = data._id;
    this.name = data.name;
    this.options = data.options;
    this.factors = data.factors;
    this.moods = data.moods;
  }


  create = (list, api, data) => {
    console.log('creating', data);
    if (!list) return;
    return api.create(this.id, data).then(this.refresh);
  }

  update = (list, api, id, data) => {
    console.log('updating ' + id, data);

    if (!list) return;

    const item = list.find(doc => doc._id === id);
    if (!item) throw new Error('Unable to find decision child with id ' + id);

    Object.assign(item, data);
    this.changeCalls.forEach(call => call());
    return api.update(this.id, id, data);
  }

  delete = (list, api, id) => {
    console.log('deleting ' + id);

    if (!list) return;

    const item = list.find(item => item._id === id);
    if (!item) throw new Error('Unable to find decision child with id ' + id);

    return api.delete(this.id, id).then(this.refresh);
  }

  apis = {
    option: {
      create: (data) => this.create(this.options, API.option, data),
      update: (id, data) => this.update(this.options, API.option, id, data),
      delete: (id) => this.delete(this.options, API.option, id)
    },
    factor: {
      create: (data) => this.create(this.factors, API.factor, data),
      update: (id, data) => this.update(this.factors, API.factor, id, data),
      delete: (id) => this.delete(this.factors, API.factor, id)
    },
    mood: {
      update: (id, data) => this.update(this.moods, API.mood, id, data)
    }
  }

  slice = (sliceObj) => {
    const id = sliceObj._id;
    return this.moods.filter(mood => mood.option._id === id || mood.factor._id === id);
  }
  intersect = (option, factor) => {
    return this.moods.filter(mood => mood.option._id === option._id && mood.factor._id === factor._id)[0];
  }
  average = (sliceObj) => {
    return Calc.moods.average(this.slice(sliceObj));
  }
  bg = () => {
    const sorted = Calc.slices.sort(this, 'options');
    const slice = sorted[1] || sorted[0];
    if (!slice) return 'unknown';
    return Calc.moods.bg(this.slice(slice), this);
  }


  refreshCalls = [
    () => this.insights = null
  ];
  onRefresh(call) {
    this.refreshCalls.push(call);
  }

  offRefresh(call) {
    this.refreshCalls.splice(this.refreshCalls.findIndex(call), 1);
  }

  changeCalls = [
    () => this.insights = null
  ];
  onChange(call) {
    this.changeCalls.push(call);
  }

  offChange(call) {
    this.changeCalls.splice(this.changeCalls.findIndex(call), 1);
  }


  insights = null;

  getInsights = () => {
    if (this.insights) return this.insights;

    this.insights = [];
    let stop = false;
    insightTemplates.forEach(template => {
      if (stop) return;
      const result = template(this);
      if (result) this.insights = this.insights.concat(result);
      if (result.stop) stop = true;
    });
    if (this.insights.length === 0) {
      this.insights.push({
        title: 'No Insights Found',
        body: 'Add more options and factors to see helpful tips and recommendations.',
        bg: 'subtle'
      });
    }
    // this.insights = this.insights.sort((a, b) => a.order - b.order);

    return this.insights;
  }
}
