import GithubIcon from "../assets/github.png";
import WebElephantWhite from "../assets/WebElephant_White.svg";

export const navLinks = [
    {
      id: "about",
      title: "About",
      post_link: "#about",
    },
    {
      id: "projects",
      title: "Projects",
      post_link: "#projects",
    },
  ];

export const footerLinks = [
  {
    id: 'github',
    title: 'Github',
    icon: GithubIcon,
    icon_link: 'https://www.github.com/Roybas2001',
  },
  {
    id: 'webelephant',
    title: 'WebElephant',
    icon: WebElephantWhite,
    icon_link: 'https://www.webelephant.nl/',
  },
];

export const projects = [
  {
    id: 'pixelmatchwe',
    title: 'PixelmatchWE',
    subtitle: 'Comparing images',
    post_link: '/posts/ENDocsPixelmatchWE/',
  },
  {
    id: "cypress",
    title: "Cypress",
    subtitle: "E2E Testing",
    post_link: "/posts/CypressDocs/",
  },
];