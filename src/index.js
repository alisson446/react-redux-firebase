import React, { Component } from 'react';
import { render } from 'react-dom';

import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import { Map, OrderedMap } from 'immutable';

const todo = (state, action) => {
  switch(action.type) {
    case 'ADD_TODO':
      return {
        id: action.id,
        text: action.text,
        completed: false
      };

    case 'TOGGLE_TODO':
      if(state.id != action.id) {
        return state;
      }

      return {
        ...state,
        completed: !state.completed
      };

    default:
      return state;
  }
};

const todos = (state = [], action) => {
  switch(action.type) {
    case 'ADD_TODO':
      return [
        ...state,
        todo(undefined, action);
      ];

    case 'TOGGLE_TODO':
      return state.map(t => {
        todo(t, action);
      });

    default:
      return state;    
  }
};

const visibilityFilter = (state = 'SHOW_ALL', action) => {
  switch(action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.filter;

    default:
      return state;
  }
};

const todoApp = combineReducers({
  todos,
  visibilityFilter
});

const logger = createLogger({
  collapsed: true,
  stateTransformer: (state) => state.toJS()
});

const store = createStore(todoApp, applyMiddleware(thunk, logger));

let idCount = 0;
class TodoApp extends Component {
  render() {
    return(
      <div>
        <button onClick={() => {
          store.dispatch({
            type: 'ADD_TODO',
            text: 'todo',
            id: idCount++;
          });          
        }}>
          Add Todo
        </button>

        <ul>
          {this.props.todos.map(todo => {
            <li key = {todo.id}>
              {todo.text}
            </li>
          })}
        </ul>
      </div>
    );
  }
}

const render = () => {
  render(<TodoApp todos = {store.getState().todos}/>, 
  document.getElementById('root'));
};

store.subscribe(render);
render();
