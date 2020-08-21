import Axios from 'axios';

export function apiClient() {
  return Axios.create({
    baseURL: 'https://nestapicrm.herokuapp.com/'
  });
}
