import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
// import reportWebVitals from './reportWebVitals';
import { legacy_createStore as createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { thunk as reduxThunk } from 'redux-thunk';
import chatbotReducer from './store/reducers/chatbotReducer';
import notesReducer from './store/reducers/notesReducer'; // Import the notes reducer


const rootReducer = combineReducers({
  chatbot: chatbotReducer, // Add other reducers if needed
  notes: notesReducer,
});

let store = createStore(rootReducer, applyMiddleware(reduxThunk));

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

// reportWebVitals();