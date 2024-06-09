import { BsPinAngle } from "react-icons/bs";
import { BsPinAngleFill } from "react-icons/bs";
import { MdOutlineDeleteOutline } from "react-icons/md";
const Notecard = (props) => {
  const { title, tags, date, content, isPinned } = props;

  const { onEdit, onDelete, onPin } = props;

  return (
    <div className="mx-5">
      <div className="w-full h-64 flex flex-col justify-between dark:bg-gray-700 bg-white dark:border-gray-700 rounded-lg border border-gray-400 mb-6 py-5 px-4 ">
        <div>
          <h4 className="text-gray-800 dark:text-gray-100 font-bold mb-3">
            {title}
          </h4>
          <p className="text-gray-800 dark:text-gray-100 text-sm">{content}</p>
        </div>
        <p className="text-gray-800 dark:text-gray-100 text-sm ">
          Tags:{" "}
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-gray-800 dark:text-gray-100 text-sm p-2 mr-1 border border-white rounded-full "
            >
              #{tag}
            </span>
          )) || "No tags"}
        </p>
        <div>
          <div className="flex items-center justify-between text-gray-800 dark:text-gray-100">
            <p className="text-sm">{date}</p>
            <div className="flex gap-1">
              <button
                onClick={() => onEdit(props.id)}
                className="m-2 w-8 h-8 rounded-full bg-gray-800 dark:bg-gray-100 dark:text-gray-800 text-white flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2  focus:ring-gray-100"
                aria-label="edit note"
                role="button"
              >
                <img
                  className="dark:block hidden"
                  src="https://tuk-cdn.s3.amazonaws.com/can-uploader/4-by-3-multiple-styled-cards-svg1dark.svg"
                  alt="edit"
                />
              </button>
              <button
                onClick={() => onPin(props.id)}
                className={`m-2 w-8 h-8 rounded-full bg-gray-100  text-gray-800 flex items-center justify-center focus:outline-none focus:ring-2  focus:ring-offset-2  focus:ring-gray-100`}
                aria-label="edit note"
                role="button"
              >
                {isPinned ? <BsPinAngleFill /> : <BsPinAngle />}
              </button>
              <button
                onClick={() => onDelete(props.id)}
                className="m-2 w-8 h-8 rounded-full bg-gray-800 dark:bg-gray-100 dark:text-gray-800 text-white flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2  focus:ring-gray-100"
                aria-label="edit note"
                role="button"
              >
                <MdOutlineDeleteOutline />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notecard;
