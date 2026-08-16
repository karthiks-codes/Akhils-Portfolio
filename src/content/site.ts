import type { SocialLink } from "@/types/content";

export const site = {
  name: "Akhil Karthik Boddupalli",
  shortName: "Akhil",
  title: "Software Engineer building intelligent systems",
  description:
    "Exploring the intersection of software engineering, artificial intelligence, and cloud infrastructure.",
  location: "Hyderabad, India",
  availability: "I'm open to opportunities.",
  email: "akhilkarthikboddupalli@gmail.com",
  phone: "+91 7674842123",
  github: "https://github.com/karthiks-codes",
  linkedin: "https://linkedin.com/in/akhil-karthik-boddupalli",
  credly: "https://www.credly.com/users/akhil-karthik-boddupalli",
} as const;

export const socials: SocialLink[] = [
  { name: "GitHub", url: site.github, visible: true },
  { name: "LinkedIn", url: site.linkedin, visible: true },
  { name: "Credly", url: site.credly, visible: true },
  { name: "Email", url: `mailto:${site.email}`, visible: true },
];

export const education = [
  {
    qualification: "B.Tech — Computer Science and Business Systems (CSBS)",
    institution: "VNR Vignana Jyothi Institute of Engineering and Technology (VNRVJIET)",
    period: "2022–2026",
    result: "8.67 / 10",
    resultLabel: "CGPA",
  },
  {
    qualification: "Intermediate — MPC",
    institution: "Sri Chaitanya Junior College",
    period: "2020–2022",
    result: "97.9%",
    resultLabel: "Percentage",
  },
  {
    qualification: "SSC",
    institution: "Nirmal Hridai High School",
    period: "2019–2020",
    result: "10.0 / 10.0",
    resultLabel: "GPA",
  },
] as const;

export const leadership = {
  event: "Design-a-thon 2K25",
  roles: ["Documentation Lead", "Accommodation Coordinator"],
} as const;
