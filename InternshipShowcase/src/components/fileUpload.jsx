import { useState, useRef } from "react";
import $ from "jquery";

const FileUpload = () => {
  const formRef = useRef();
  const [formInput, setFormInput] = useState({
    id: "",
    title: "",
    subtitle: "",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormInput({ ...formInput, [name]: value });
  };

  // TODO: Generate new object in constants/index.js with the given values
  // TODO: Upload the given MD file to pages/posts/~uploaded file~
  /**
   *
   * @param {Event} e
   */
  const handleSubmit = async (e) => {  
    const form = $(e.target);

    try {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: form.attr("action"),
            data: form.serialize(),
            success(data) {
                setResult(data);
                setLoading(false);
            }
        });
    } catch (error) {
        console.error(error);
        setLoading(false);
    }
  };

  return (
    <div className="xl:mt-12 xl:flex-row flex-col-reverse flex gap-10 overflow-hidden">
      <div className="flex-[0.75] p-8 rounded-xl">
        <p className="sm:text-[18px] text-[14px] text-secondary uppercase tracking-wider">
          Upload MD files
        </p>
        <h2 className="text-[#F7D17E] font-black md:text-[60px] sm:text-[50px] xs:text-[40px] text-[30px]">
          Files
        </h2>

        <form
          action="http://localhost:8081/AppendFile.php"
          method="post"
          className="mt-12 flex flex-col gap-8"
          onSubmit={handleSubmit}
        >
          {/* id, title, subtitle, post_link */}
          {/* ID */}
          <label htmlFor="id" className="flex flex-col">
            <span className="text-white font-medium mb-4">id:</span>
            <input
              type="text"
              name="id"
              value={formInput.id}
              onChange={handleChange}
              placeholder="Give it an unique ID"
              className="py-4 px-6 placeholder:text-secundary text-white rounded-lg outlined-none border-none font-medium"
            />
          </label>

          {/* TITLE */}
          <label htmlFor="title" className="flex flex-col">
            <span className="text-white font-medium mb-4">Title:</span>
            <input
              type="text"
              name="title"
              value={formInput.title}
              onChange={handleChange}
              placeholder="Give it an unique Title"
              className="py-4 px-6 placeholder:text-secundary text-white rounded-lg outlined-none border-none font-medium"
            />
          </label>

          {/* SUBTITLE */}
          <label htmlFor="subtitle" className="flex flex-col">
            <span className="text-white font-medium mb-4">Subtitle:</span>
            <input
              type="text"
              name="subtitle"
              value={formInput.subtitle}
              onChange={handleChange}
              placeholder="Give it an unique subtitle"
              className="py-4 px-6 placeholder:text-secundary text-white rounded-lg outlined-none border-none font-medium"
            />
          </label>

          {/* File Upload
          <label htmlFor="file" className="flex flex-col">
            <span className="text-white font-medium mb-4">File:</span>
            <input type="file" name="file" className="py-4 px-6 rounded-lg outlined-none border-none" />
          </label> */}

          {/* Post_Link Auto generate? */}

          {/* Submit */}
          <button
            type="submit"
            className="py-3 px-8 outlined-none w-fit text-white font-bold shadow-md shadow-primary rounded-xl"
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FileUpload;
