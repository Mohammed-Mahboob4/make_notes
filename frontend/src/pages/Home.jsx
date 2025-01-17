import { useState, useEffect } from "react";
import api from "../api";
import Note from "../components/Note";
import "../styles/Home.css";
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotes, createNote, deleteNote } from '../store/actions/notesAction';

function Home() {
  const dispatch = useDispatch();
  const notes = useSelector(state => state.notes.notes);
  const loading = useSelector(state => state.notes.loading);
  const error = useSelector(state => state.notes.error);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    dispatch(fetchNotes());
  }, [dispatch]);

  const handleCreateNote = (e) => {
    e.preventDefault();
    dispatch(createNote(title, content));
  };

  const handleDeleteNote = (id) => {
    dispatch(deleteNote(id));
  };

  if (loading) {
    return <p>Loading notes...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  };

  return (
    <div>
      <div>
        <h2>Notes</h2>
        {notes.map((note) => (
          <Note note={note} onDelete={handleDeleteNote} key={note.id} />
        ))}
      </div>
      <h2>Create a Note</h2>
      <form onSubmit={handleCreateNote}>
        <label htmlFor="title">Title:</label>
        <br />
        <input
          type="text"
          id="title"
          name="title"
          required
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />
        <label htmlFor="content">Content:</label>
        <br />
        <textarea
          id="content"
          name="content"
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
        <br />
        <input type="submit" value="Submit"></input>
      </form>
    </div>
  );
}

export default Home;
