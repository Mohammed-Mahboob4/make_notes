// import api from "../api"; // Ensure this points to your API setup

// export const createNote = (title, content) => {
//     console.log("Creating note with Title:", title, "and Content:", content);
//   return api
//     .post("/api/notes/", { title, content })
//     .then((res) => {
//       if (res.status === 201) {
//         alert("Note created!");
//       } else {
//         alert("Failed to create note.");
//       }
//     })
//     .catch((err) => {
//       console.error(err);
//       alert("An error occurred while creating the note.");
//     });
// };

import api from "../api"; // Ensure this points to your API setup
// import Home from "../pages/Home"

export const getNotes = () => {
  return api
    .get("/api/notes/")
    .then((res) => res.data)
    .then((data) => {
      console.log("Notes fetched:", data);
      // return data; // Optionally return data for further use
    })
    .catch((err) => {
      console.error(err);
      alert("An error occurred while fetching notes.");
    });
};

export const createNote = (title, content) => {
  console.log("Creating note with Title:", title, "and Content:", content);
  return api
    .post("/api/notes/", { title, content })
    .then((res) => {
      if (res.status === 201) {
        alert("Note created!");
        getNotes(); // Directly call the function here
      } else {
        alert("Failed to create note.");
      }
    })
    .catch((err) => {
      console.error(err);
      alert("An error occurred while creating the note.");
    });
};

