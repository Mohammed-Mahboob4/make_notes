// src/store/reducers/notesReducer.js

const initialState = {
    notes: [],
    loading: false,
    error: null,
  };
  
  const notesReducer = (state = initialState, action) => {
    switch (action.type) {
      case "FETCH_NOTES_REQUEST":
        return {
          ...state,
          loading: true,
        };
      case "FETCH_NOTES_SUCCESS":
        return {
          ...state,
          loading: false,
          notes: action.payload,
        };
      case "FETCH_NOTES_FAILURE":
        return {
          ...state,
          loading: false,
          error: action.payload,
        };
  
      case "CREATE_NOTE_REQUEST":
        return {
          ...state,
          loading: true,
        };
      case "CREATE_NOTE_SUCCESS":
        return {
          ...state,
          loading: false,
          notes: [...state.notes, action.payload],
        };
      case "CREATE_NOTE_FAILURE":
        return {
          ...state,
          loading: false,
          error: action.payload,
        };
  
      case "DELETE_NOTE":
        return {
          ...state,
          notes: state.notes.filter((note) => note.id !== action.payload),
        };
  
      default:
        return state;
    }
  };
  
  export default notesReducer;
  