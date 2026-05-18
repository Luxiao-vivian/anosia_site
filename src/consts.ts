import type { Site, Page, Links, Socials } from "@types"

// Global
export const SITE: Site = {
  TITLE: "Anosia's space",
  DESCRIPTION: "你好旅行者~欢迎造访我的宇宙！",
  AUTHOR: "Anosia",
}

// Education Page
export const WORK: Page = {
  TITLE: "Education",
  DESCRIPTION: "My academic background.",
}

// Blog Page
export const BLOG: Page = {
  TITLE: "Blog",
  DESCRIPTION: "Writing on topics I am passionate about.",
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
    TEXT: "Education", 
    HREF: "/work", 
  },
  { 
    TEXT: "Blog", 
    HREF: "/blog", 
  },
  { 
    TEXT: "Projects", 
    HREF: "/projects", 
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
    HREF: "https://www.linkedin.com/in/zhang-xulu-00280834a/",
  },
]

