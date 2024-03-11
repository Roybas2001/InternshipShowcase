import { useState } from "react";
import { menu, close } from "../assets";
import { navLinks } from "../constants";

const NavBarMobile = () => {
    const [active, setActive] = useState("");
    const [toggle, setToggle] = useState(false);

    return (
        <>
        <img src={toggle ? close : menu} alt="menu" className="w-[28px] h-[28px] object-contain cursor-pointer" onClick={() => setToggle(!toggle)} />

        <div className={`${!toggle ? 'hidden' : 'flex'} p-6 absolute top-20 right-0 mx-4 my-2 min-w[140] z-10 rounded-xl`}>
            <ul>
                {navLinks.map((link) => (
                    <li
                     key={link.id}
                     className={`${
                        active === link.title ? "text-white" : "text-[#FF0029]"
                     } font-poppins font-medium cursor-pointer text-[16]`}
                    >
                        <a href={`#${link.id}`}>{link.title}</a>
                    </li>
                ))}
            </ul>
        </div>
        </>
    )
}

export default NavBarMobile;