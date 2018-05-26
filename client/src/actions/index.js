import axios from 'axios';
import {FETCH_USER, FILE_UPLOAD} from './types';


export const fetchUser = () => async dispatch => {
  const res = await axios.get('/api/current_user');

  dispatch({type: FETCH_USER, payload: res.data});
};

export const handleToken = token => async dispatch => {
  const res = await axios.post('/api/stripe', token);

  dispatch({type: FETCH_USER, payload: res.data});
};


export const submitFile = (file) => async dispatch => {
  const uploadConfig = await axios.get('/api/upload');
  await axios.put(uploadConfig.data.url,file, {
    headers: {
      'Content-Type': file.type
    }
  });

  dispatch({type: FILE_UPLOAD, payload: res.data});
};
