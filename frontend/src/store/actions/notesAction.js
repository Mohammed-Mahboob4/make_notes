// src/store/actions/notesActions.js

import api from "../../api"; // Adjust this path to where your API instance is

// Fetch Notes Action
export const fetchNotes = () => async (dispatch) => {
  dispatch({ type: "FETCH_NOTES_REQUEST" });
  try {
    const response = await api.get("/api/notes/");
    dispatch({ type: "FETCH_NOTES_SUCCESS", payload: response.data });
    console.log(response.data)
  } catch (error) {
    dispatch({
      type: "FETCH_NOTES_FAILURE",
      payload: error.message || "An error occurred while fetching notes.",
    });
  }
};

// Create Note Action
export const createNote = (title, content) => async (dispatch) => {
  dispatch({ type: "CREATE_NOTE_REQUEST" });
  try {
    const response = await api.post("/api/notes/", { title, content });
    dispatch({ type: "CREATE_NOTE_SUCCESS", payload: response.data });
  } catch (error) {
    dispatch({
      type: "CREATE_NOTE_FAILURE",
      payload: error.message || "An error occurred while creating the note.",
    });
  }
};

// Delete Note Action
export const deleteNote = (id) => async (dispatch) => {
  try {
    await api.delete(`/api/notes/delete/${id}/`);
    dispatch({ type: "DELETE_NOTE", payload: id });
  } catch (error) {
    alert("Failed to delete note.");
  }
};

// Fetch Notes by Title and Delete Action
export const fetchNotesByTitleAndDelete = (titleToDelete) => async (dispatch) => {
  try {
    // Fetch all notes
    const response = await api.get("/api/notes/");
    const notes = response.data;

    // Find notes with the matching title
    const notesToDelete = notes.filter((note) => note.title === titleToDelete);

    if (notesToDelete.length === 0) {
      alert("No notes found with the specified title.");
      return;
    }

    // Delete each matching note
    for (const note of notesToDelete) {
      await api.delete(`/api/notes/delete/${note.id}/`);
      dispatch({ type: "DELETE_NOTE", payload: note.id });
    }

    alert(`${notesToDelete.length} note(s) with the title "${titleToDelete}" have been deleted.`);
  } catch (error) {
    alert("An error occurred while fetching or deleting notes.");
  }
};