import Axios from 'axios';

export default {
  login: function(username, password) {
    return Axios.post('/login', { username, password });
  },
  create: function(username, password) {
    return Axios.post('/signup', { username, password })
  }
}
