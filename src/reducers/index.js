import { combineReducers } from 'redux'
import model from './model';
import ast from './ast';

export default combineReducers({
  model,
  ast
})