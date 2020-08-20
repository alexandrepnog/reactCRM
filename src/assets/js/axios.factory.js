import Axios from 'axios';

export function apiClient() {
  return Axios.create({
    baseURL: 'http://localhost:8081/'
  });
}
