import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080'
});

export const fetchProperties = () => API.get('/api/properties');
export const fetchPropertyById = (id) => API.get(`/api/properties/${id}`);
export const createProperty = (data) => API.post('/api/properties', data);
export const deleteProperty = (id) => API.delete(`/api/properties/${id}`);

export default API;
