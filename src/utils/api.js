import Axios from "axios";

let defaultDecision = '';

export default {
  user: {
    me: function () { return Axios.get(`/api/users`) }
  },

  decision: {
    list   : function()               { return Axios.get(   `/api/decisions`) },
    create : function(data)           { return Axios.post(  `/api/decisions`, data) },
    find   : function(decision)       { return Axios.get(   `/api/decisions/${decision || defaultDecision}`) },
    update : function(decision, data) { return Axios.put(   `/api/decisions/${decision || defaultDecision}`, data) },
    delete : function(decision)       { return Axios.delete(`/api/decisions/${decision || defaultDecision}`) },
    use: function(decision) { defaultDecision = decision }
  },

  option: {
    list   : function(decision)               { return Axios.get(   `/api/decisions/${decision || defaultDecision}/options`) },
    create : function(decision, data)         { return Axios.post(  `/api/decisions/${decision || defaultDecision}/options`, data) },
    find   : function(decision, option)       { return Axios.get(   `/api/decisions/${decision || defaultDecision}/options/${option}`) },
    update : function(decision, option, data) { return Axios.put(   `/api/decisions/${decision || defaultDecision}/options/${option}`, data) },
    delete : function(decision, option)       { return Axios.delete(`/api/decisions/${decision || defaultDecision}/options/${option}`) }
  },

  factor: {
    list   : function(decision)               { return Axios.get(   `/api/decisions/${decision || defaultDecision}/factors`) },
    create : function(decision, data)         { return Axios.post(  `/api/decisions/${decision || defaultDecision}/factors`, data) },
    find   : function(decision, factor)       { return Axios.get(   `/api/decisions/${decision || defaultDecision}/factors/${factor}`) },
    update : function(decision, factor, data) { return Axios.put(   `/api/decisions/${decision || defaultDecision}/factors/${factor}`, data) },
    delete : function(decision, factor)       { return Axios.delete(`/api/decisions/${decision || defaultDecision}/factors/${factor}`) }
  },

  mood: {
    list   : function(decision)             { return Axios.get(`/api/decisions/${decision || defaultDecision}/moods`) },
    find   : function(decision, mood)       { return Axios.get(`/api/decisions/${decision || defaultDecision}/moods/${mood}`) },
    update : function(decision, mood, data) { return Axios.put(`/api/decisions/${decision || defaultDecision}/moods/${mood}`, data) }
  }
}