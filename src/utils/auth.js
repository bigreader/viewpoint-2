// import Axios from 'axios';
const Axios = null

const auth = {
  login: function(username, password) {
    return Axios.post('/login', { username, password });
  },
  create: function(username, password) {
    return Axios.post('/signup', { username, password })
  }
}

export default auth
