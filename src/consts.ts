import type { Site, Page, Links, Socials } from "@types"

// Global
export const SITE: Site = {
  TITLE: "Anosia's Grove",
  DESCRIPTION: "Bienvenue dans la grove.",
  AUTHOR: "Anosia",
  LAUNCH_DATE: "2026-05-18T00:00:00+08:00",
  // GoatCounter site code from your subdomain, e.g. "anosia" for https://anosia.goatcounter.com
  // Leave as "" to disable the public visitor counter and tracking script.
  GOATCOUNTER_CODE: "anosia",
}

// Blog Page
export const BLOG: Page = {
  TITLE: "Blog",
  DESCRIPTION: "Writing on topics I am passionate about.",
}

// Cabinet Page (a cabinet of curiosities — fragments, quotes, web findings)
export const CABINET: Page = {
  TITLE: "Cabinet",
  DESCRIPTION: "A cabinet of curiosities — fragments, quotes, and things from the web worth keeping.",
}

// Projects Page 
export const PROJECTS: Page = {
  TITLE: "Projects",
  DESCRIPTION: "Class projects and self-interest projects.",
}

// Search Page
export const SEARCH: Page = {
  TITLE: "Search",
  DESCRIPTION: "Search all posts and projects by keyword.",
}

// Links
export const LINKS: Links = [
  { 
    TEXT: "Home", 
    HREF: "/", 
  },
  { 
    TEXT: "Blog", 
    HREF: "/blog", 
  },
  { 
    TEXT: "Projects", 
    HREF: "/projects", 
  },
  { 
    TEXT: "Cabinet", 
    HREF: "/cabinet", 
  },
]

// Socials
export const SOCIALS: Socials = [
  { 
    NAME: "Email",
    ICON: "email", 
    TEXT: "vivianlulu1010@gmail.com",
    HREF: "mailto:vivianlulu1010@gmail.com",
  },
  { 
    NAME: "Email",
    ICON: "email", 
    TEXT: "xu-lu.zhang@connect.polyu.hk",
    HREF: "mailto:xu-lu.zhang@connect.polyu.hk",
  },
  { 
    NAME: "Github",
    ICON: "github",
    TEXT: "Luxiao-vivian",
    HREF: "https://github.com/Luxiao-vivian"
  },
  { 
    NAME: "LinkedIn",
    ICON: "linkedin",
    TEXT: "zhang-xulu",
    HREF: "https://www.linkedin.com/in/zhang-xulu-Anosia/",
  },
]

