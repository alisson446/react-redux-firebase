import React, { Component } from 'react';
import { render } from 'react-dom';

import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';

import { Provider, connect } from 'react-redux';

const todo = (state, action) => {
  switch(action.type) {
    case 'ADD_TODO':
      return {
        id: action.id,
        text: action.text,
        completed: false
      };

    case 'TOGGLE_TODO':
      if(state.id !== action.id) {
        return state;
      }

      // return {
      //   ...state,
      //   completed: !state.completed
      // };

    default:
      return state;
  }
};

const todos = (state = [], action) => {
  switch(action.type) {
    case 'ADD_TODO':
      return [
        ...state,
        todo(undefined, action)
      ];

    case 'TOGGLE_TODO':
      return state.map(t =>
        todo(t, action)
      );

    default:
      return state;
  }
};

let idCount = 0;
const localAddTodo = (text) => {
  return { type: 'ADD_TODO', id: idCount++, text }
};

const localToggleTodo = (id) => {
  return { type: 'TOGGLE_TODO', id };
};

const localSetVisibilityFilter = (filter) => {
  return { type: 'SET_VISIBILITY_FILTER', filter };
};

const visibilityFilter = (state = 'SHOW_ALL', action) => {
  switch(action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.filter;

    default:
      return state;
  }
};

const reducerTodoApp = combineReducers({
  todos,
  visibilityFilter
});

const logger = createLogger();

let AddTodo = ({ dispatch }) => {
  let input;

  return (
    <div>
      <input ref={(node) => {
        input = node;
      }} />
      <button onClick={() => {
        dispatch(localAddTodo(input.value));
        input.value = '';
      }}>
        Add Todo
      </button>
    </div>
  );
};

AddTodo = connect()(AddTodo);

const getVisibleTodos = (todos, filter) => {
  switch(filter) {
    case 'SHOW_ALL':
      return todos;

    case 'SHOW_ACTIVE':
      return todos.filter(f => !f.completed);

    case 'SHOW_COMPLETED':
      return todos.filter(f => f.completed);

    default:
      return todos;
  }
};

const Todo = ({ completed, text, onClick }) => (
  <li
    onClick = {onClick}
    style={{textDecoration: completed ? 'line-through' : 'none'}}
  >
    {text}
  </li>
);

const TodoList = (props) => {
  const { todos, onTodoClick } = props;

  return (
    <ul>
      {todos.map(todo =>
        <Todo
          key = {todo.id}
          {...todo}
          onClick = { onTodoClick(todo.id) }
        />
      )}
    </ul>
  );
}

const mapStateToTodoListProps = (state) => {
  return {
    todos: getVisibleTodos(state.todos, state.visibilityFilter)
  };
};

const mapDispatchToTodoListProps = (dispatch) => {
  return {
    onTodoClick: (id) => {
      dispatch(localToggleTodo(id));
    }
  };
};

const VisibleTodoList = connect(
  mapStateToTodoListProps,
  mapDispatchToTodoListProps
)(TodoList);

const Footer = () => (
  <p>
    Show:
      {' '}
      <FilterLink
        filter='SHOW_ALL'
      >
        All
      </FilterLink>
      {' '}
      <FilterLink
        filter='SHOW_ACTIVE'
      >
        Active
      </FilterLink>
      {' '}
      <FilterLink
        filter='SHOW_COMPLETED'
      >
        Completed
      </FilterLink>
  </p>
);

const Link = ({ active, children, onClick }) => {
  if(active) {
    return <span>{children}</span>
  }

  return (
    <a href='#' onClick={e => {
      e.preventDefault();
      onClick();
    }}>
      {children}
    </a>
  );
};

const mapStateToLinkProps = (state, ownProps) => {
  return {
    active: ownProps.filter === state.visibilityFilter
  };
};

const mapDispatchToLinkProps = (dispatch, ownProps) => {
  return {
    onClick: () => {
      dispatch(localSetVisibilityFilter(ownProps.filter));
    }
  };
};

const FilterLink = connect(
  mapStateToLinkProps,
  mapDispatchToLinkProps
)(Link);

const TodoApp = () => {
  return (
    <div>
      <AddTodo />
      <VisibleTodoList />
      <Footer />
    </div>
  );
}

render(
  <Provider store={createStore(reducerTodoApp, applyMiddleware(thunk, logger))}>
    <TodoApp />
  </Provider>,
document.getElementById('root'));
