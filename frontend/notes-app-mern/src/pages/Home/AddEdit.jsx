import { useState } from "react";

const AddEdit = (props) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);

  const handleAddTag = () => {
    const newTag = document.getElementById("tag-input").value;
    if (newTag && newTag.length <= 20)
      setTags((prevTags) => [...prevTags, newTag]);
    document.getElementById("tag-input").value = "";
  };

  return (
    <div className="flex flex-col items-center justify-center w-full ">
      <span className="w-full pt-1">
        <button
          className="right-0 top-0 pr-8 pt-5 text-black text-2xl absolute"
          onClick={props.closeModal}
        >
          X
        </button>
      </span>
      <label className="text-md font-bold text-gray-400" htmlFor="title">
        Title:
      </label>
      <input
        id="title"
        className="w-[90%] p-2 m-4 border border-gray-300 rounded"
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <label className="text-md font-bold text-gray-400" htmlFor="content">
        Content:
      </label>
      <textarea
        id="content"
        className="w-[90%] p-2 mb-4 border border-gray-300 rounded"
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      ></textarea>
      <div className="flex flex-wrap mx-2">
        {tags.map((tag, index) => (
          <div
            className=" bg-blue-400 rounded-xl p-1 m-2 text-sm text-white"
            key={index}
          >
            #{tag}
            <button
              className="text-gray-500 text-xl ml-2"
              onClick={() => setTags(tags.filter((_, i) => i !== index))}
            >
              x
            </button>
          </div>
        ))}
      </div>

      <div className="w-[90%] p-2 mb-4 border border-gray-300 rounded">
        <label className="text-md font-bold text-gray-400" htmlFor="tag-input">
          Tags:
        </label>
        <input id="tag-input" type="text" placeholder="Tags" className="m-4" />
        <button onClick={handleAddTag}>Add Tag</button>
      </div>
      <button
        onClick={() => {
          if (props.type === "add") {
            props.handleAddNote({
              title,
              content,
              tags,
            });
          } else {
            props.handleEditNote({
              title,
              content,
              tags,
            });
          }
        }}
        className="bg-blue-600 rounded-xl p-2 m-2 text-xl text-white"
      >
        Submit
      </button>
    </div>
  );
};

export default AddEdit;
