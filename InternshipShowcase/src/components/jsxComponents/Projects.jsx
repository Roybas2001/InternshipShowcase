import { useEffect, useState } from "react";
import $ from "jquery";

const Project = ({ project }) => {
  return (
    <div
      id={project.id}
      className="slideIn-left flex flex-col justify-between items-start  bg-black-100 p-8 rounded-2xl"
    >
      <p className="sm:text-[18px] text-[14px] text-secondary uppercase tracking-wider">
        {project.subtitle}
      </p>
      <h2 className="text-red-gradient font-black md:text-[60px] sm:text-[50px] xs:text-[40px] text-[30px]">
        {project.title}
      </h2>
      <a
            href={`/posts/${project.filename}/`}
            className="mt-4 hover:text-[#FF0029] text-white text-[18px] font-medium cursor-pointer"
          >
            Read More -&gt;
          </a>
    </div>
  );
};

const CreateProject = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    try {
      $.ajax({
        type: "GET",
        url: "http://localhost:8081/ReadProjects.php",
        success(data) {
          const parsedData = JSON.parse(data);
          setProjects(parsedData);
        },
        error(xhr, status, error) {
          console.error("AJAX Error: ", status, error);
        },
      });
    } catch (error) {
      console.error(error);
    }
  }, []);

  return (
    <div className="xl:mt-12 grid grid-cols-2 gap-10">
      {projects.map((project, index) => (
        <Project key={`project-${index}`} project={project} {...project} />
      ))}
    </div>
  );
};

export default CreateProject;
