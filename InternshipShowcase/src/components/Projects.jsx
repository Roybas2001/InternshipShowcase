import { useEffect, useState } from "react";
import $ from "jquery";

// const Project = () => {
//     return (
//         {
//             projects.map((link) => (
//               <div class="slideIn-left flex-[0.75] bg-black-100 p-8 rounded-2xl">
//                 <p class="sm:text-[18px] text-[14px] text-secondary uppercase tracking-wider">
//                   {link.subtitle}
//                 </p>
//                 <h2 class="text-red-gradient font-black md:text-[60px] sm:text-[50px] xs:text-[40px] text-[30px]">
//                   {link.title}
//                 </h2>
//                 <a
//                   href={`${link.post_link}`}
//                   class="mt-4 hover:text-[#FF0029] text-white text-[18px] font-medium cursor-pointer"
//                 >
//                   Read More -&gt;
//                 </a>
//               </div>
//             ))
//           }
//     )
// }

const CreateProject = () => {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        try {
            $.ajax({
                type: "GET",
                url: "http://localhost:8081/ReadProjects.php",
                success(data) {
                    setProjects(JSON.parse(data));
                },
                error(xhr, status, error) {
                    console.error("AJAX Error: ", status, error);
                }
            });
        } catch (error) {
            console.error(error);
        }
    }, []);

    console.log(projects);
}

export default CreateProject;