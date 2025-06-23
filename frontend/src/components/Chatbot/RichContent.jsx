import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createNote, fetchNotes, fetchNotesByTitleAndDelete } from "../../store/actions/notesAction";

const RichContent = ({ richContent }) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState({ title: "", content: "" });

  if (!richContent || !Array.isArray(richContent[0])) return null;

  const isDelete = richContent[0].some(item => item.event?.name === "submit_delete_note");

  const handleSubmit = (e) => {
    e.preventDefault();

    const newError = { title: "", content: "" };
    let hasError = false;

    if (!title.trim()) {
      newError.title = "Title is required.";
      hasError = true;
    }
    if (!isDelete && !content.trim()) {
      newError.content = "Content is required.";
      hasError = true;
    }

    setError(newError);
    if (hasError) return;

    if (isDelete) {
      dispatch(fetchNotesByTitleAndDelete(title))
        .then(() => {
          dispatch(fetchNotes());
          setTitle("");
        })
        .catch((error) => {
          console.error("Delete error:", error);
        });
    } else {
      dispatch(createNote(title, content))
        .then(() => {
          dispatch(fetchNotes());
          setTitle("");
          setContent("");
        })
        .catch((error) => {
          console.error("Create error:", error);
        });
    }
  };

  return (
    <form className="rich-card" onSubmit={handleSubmit}>
      {richContent[0].map((item, idx) => {
        if (item.type === "input") {
          return (
            <div key={idx} className="rich-input">
              <label>{item.label}</label>
              <input
                type="text"
                placeholder={item.placeholder}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              {error.title && <small className="error-text">{error.title}</small>}
            </div>
          );
        }

        if (item.type === "textarea" && !isDelete) {
          return (
            <div key={idx} className="rich-textarea">
              <label>{item.label}</label>
              <textarea
                placeholder={item.placeholder}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              {error.content && <small className="error-text">{error.content}</small>}
            </div>
          );
        }

        if (item.type === "button") {
          return (
            <div key={idx} className="rich-button-container">
              <button
                type="submit"
                className="rich-button"
                style={{ backgroundColor: item.color || "#0b8457" }}
              >
                {item.text}
              </button>
            </div>
          );
        }

        return null;
      })}
    </form>
  );
};

export default RichContent;