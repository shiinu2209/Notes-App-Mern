import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Notecard from "../../components/Notecard/Notecard";
import AddEdit from "./AddEdit";
import Modal from "react-modal";
import moment from "moment";
// import axios from "axios";
import axiosInstance from "../../utils/axiosinstance";

const Home = () => {
  const [modalIsOpen, setModalIsOpen] = useState({
    type: "add",
    isOpen: false,
  });
  const [User, setUser] = useState("");
  const [notes, setNotes] = useState([]);
  const handleModaladd = () => {
    setModalIsOpen({ isOpen: !modalIsOpen.isOpen, type: "add" });
  };
  const handleDelete = async (id) => {
    await axiosInstance.delete(`/delete-note/${id}`);
    console.log("Note deleted successfully");
    fetchNotes();
  };
  const handleAddNote = async (data) => {
    if (!data.title & !data.content & !data.tags[0]) {
      await handleModaladd();
      return;
    }
    try {
      await axiosInstance.post("/add-note", data);
      console.log("note added successfully");
      fetchNotes();
      handleModaladd();
    } catch (error) {
      console.log(error.message);
      handleModaladd();
    }
  };
  const handleEditNote = async (data) => {
    if (!data.title & !data.content & !data.tags[0]) {
      await handleModaladd();
      return;
    }

    await axiosInstance.put(
      `/edit-note/${localStorage.getItem("noteId")}`,
      data
    );
    console.log("note edited successfully");
    localStorage.removeItem("noteId");
    fetchNotes();
    handleModaladd();
  };
  const handleEdit = (id) => {
    setModalIsOpen({ isOpen: !modalIsOpen.isOpen, type: "edit" });
    localStorage.setItem("noteId", id);
  };
  const handleLogOut = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };
  const handlePin = async (id) => {
    await axiosInstance.put(`/pin-note/${id}`);
    console.log("Note pinned successfully");
    await fetchNotes();
  };
  const fetchNotes = async () => {
    try {
      const response = await axiosInstance.get("/get-all-notes");
      setNotes(response.data.notes);
      console.log("Fetched notes successfully");
    } catch (error) {
      console.log(error.message);
      console.log("Failed to fetch notes");
    }
  };
  const getUser = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      setUser(response.data.user.name.toUpperCase());
      console.log(response.data);
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    fetchNotes();
    getUser();
  }, []);
  return (
    <>
      <Navbar user={User} logout={handleLogOut} />

      <div className="container mx-auto">
        <div className="grid max-sm:grid-cols-1 max-md:grid-cols-2 max-lg:grid-cols-3 grid-cols-4 mt-8 ">
          {notes.map((note) => (
            <Notecard
              key={note._id}
              id={note._id}
              title={note.title}
              content={note.content}
              date={moment.utc(note.createdAt).format("DD MMM YYYY")}
              tags={note.tags}
              isPinned={note.isPinned}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onPin={handlePin}
            />
          ))}
        </div>
      </div>
      <Modal
        isOpen={modalIsOpen.isOpen}
        type={modalIsOpen.type}
        className="w-[40%] h-auto mt-[2%] mx-auto bg-white border border-slate-600 rounded-3xl"
      >
        <AddEdit
          handleEditNote={handleEditNote}
          handleAddNote={handleAddNote}
          closeModal={handleModaladd}
          type={modalIsOpen.type}
        />
      </Modal>
      <div>
        <button
          onClick={() => {
            handleModaladd();
          }}
          className="fixed bottom-10 right-10 bg-blue-600 text-white px-4 text-3xl rounded-xl"
        >
          +
        </button>
      </div>
    </>
  );
};

export default Home;
