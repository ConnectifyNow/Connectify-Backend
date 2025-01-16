import dotenv from "dotenv";
import mongoose from "mongoose";
import City from "../src/models/city";
import FocusArea from "../src/models/focusArea";
import Skill from "../src/models/skill";
import User from "../src/models/user";
import Volunteer from "../src/models/volunteer";
import Organization from "../src/models/organization";
import Post from "../src/models/post";
import { randomAvatarUrl, getRandomNumber } from "../src/utils/functions";
import { Role } from "../src/types";

dotenv.config();

// Change this to your actual DB connection string
const DB_URL = process.env.DB_URL;

// Constants
const CITIES = [
  "New York",
  "Los Angeles",
  "Chicago",
  "Houston",
  "Phoenix",
  "Philadelphia",
  "San Antonio",
  "San Diego",
  "Dallas",
  "San Jose"
];

const FOCUS_AREAS = [
  "Medical",
  "Business",
  "Arts",
  "Sports",
  "Marketing",
  "Finance",
  "Education",
  "Environment",
  "Technology",
  "Research"
];

const SKILLS = [
  "TypeScript",
  "Product Management",
  "React",
  "Node.js",
  "UI/UX",
  "Data Analysis",
  "Java",
  "Python",
  "Communication",
  "Leadership"
];

const USERS = [
  { role: Role.Volunteer },
  { role: Role.Volunteer },
  { role: Role.Volunteer },
  { role: Role.Volunteer },
  { role: Role.Volunteer },
  { role: Role.Organization },
  { role: Role.Organization },
  { role: Role.Organization },
  { role: Role.Organization },
  { role: Role.Organization }
];

const ORGANIZATION_POSTS = [
  "We are looking for volunteers to help with our upcoming charity event.",
  "Join us in making a difference in the community by volunteering at our food drive.",
  "We need volunteers to assist with our educational programs for underprivileged children.",
  "Help us clean up the local park and make it a better place for everyone.",
  "We are seeking volunteers to help with our fundraising efforts.",
  "Join our team and help us provide medical assistance to those in need.",
  "We need volunteers to help with our environmental conservation projects.",
  "Help us organize our annual sports event for the community.",
  "We are looking for volunteers to assist with our marketing campaigns.",
  "Join us in providing support to the elderly in our community."
];

const VOLUNTEER_POSTS = [
  "Looking for opportunities to volunteer in educational programs.",
  "I am available to help with community clean-up projects.",
  "Seeking volunteer opportunities in medical assistance.",
  "I am interested in volunteering for fundraising events.",
  "Looking for opportunities to volunteer in environmental conservation.",
  "I am available to help with sports events for the community.",
  "Seeking volunteer opportunities in marketing and promotions.",
  "I am interested in volunteering for food drives and charity events.",
  "Looking for opportunities to provide support to the elderly.",
  "I am available to help with any community service projects."
];

export const getRandomName = () => {
  const names = [
    "John",
    "Jane",
    "Alex",
    "Chris",
    "Taylor",
    "Jordan",
    "Morgan",
    "Casey",
    "Riley",
    "Quinn",
    "Sam",
    "Pat",
    "Jamie",
    "Robin",
    "Drew",
    "Cameron",
    "Avery",
    "Skyler",
    "Parker",
    "Dakota",
    "Reese",
    "Kendall",
    "Harper",
    "Rowan",
    "Sawyer",
    "Emerson",
    "Finley",
    "Hayden",
    "Jesse",
    "Kai",
    "Logan",
    "Micah",
    "River",
    "Sage",
    "Tatum",
    "Blake",
    "Charlie",
    "Elliot",
    "Frankie",
    "Gray",
    "Hunter",
    "Jaden",
    "Karter",
    "Lennon",
    "Marlowe",
    "Nico",
    "Oakley",
    "Peyton",
    "Quincy",
    "Reagan",
    "Shiloh",
    "Toby",
    "Vaughn",
    "Wren",
    "Zion",
    "Arden",
    "Blaine",
    "Cody",
    "Devon",
    "Eden",
    "Flynn",
    "Gale",
    "Hollis",
    "Indigo",
    "Jules",
    "Kieran",
    "Linden",
    "Merritt",
    "Noel",
    "Orion",
    "Phoenix",
    "Quinn",
    "Rory",
    "Sasha",
    "Teagan",
    "Val",
    "Wynn",
    "Zephyr",
    "Ainsley",
    "Briar",
    "Cypress",
    "Darian",
    "Ellis",
    "Fable",
    "Gentry",
    "Haven",
    "Ivory",
    "Joss",
    "Kasey",
    "Lark",
    "Madden",
    "Navy",
    "Onyx",
    "Pax",
    "Quill",
    "Reeve",
    "Scout",
    "Tanner",
    "Urban",
    "Vesper",
    "Wilder",
    "Xen",
    "Yale",
    "Zane"
  ];
  return names[getRandomNumber(0, names.length - 1)];
};

export const getRandomOrganizationName = () => {
  const names = [
    "Helping Hands",
    "Community Care",
    "Bright Future",
    "Hope Foundation",
    "Charity Works",
    "Goodwill Group",
    "Support Squad",
    "Aid Alliance",
    "Relief Network",
    "Volunteer Vision",
    "Unity Corps",
    "Service Society",
    "Compassion Crew",
    "Kindness Collective",
    "Generosity Guild",
    "Benevolent Brigade",
    "Philanthropy Partners",
    "Humanitarian Helpers",
    "Altruism Association",
    "Empathy Ensemble"
  ];
  return names[getRandomNumber(0, names.length - 1)];
};

export const getRandomUniqueName = (usedNames: Set<string>) => {
  let name;
  do {
    name = getRandomName();
  } while (usedNames.has(name));
  return name;
};

async function fillDb() {
  try {
    await mongoose.connect(DB_URL);
    console.log("Connected to DB");

    // Drop entire database
    await mongoose.connection.dropDatabase();
    console.log("Dropped existing database data");

    // Insert cities
    const cities = CITIES.map((name) => ({ name }));
    const citiesData = await City.insertMany(cities);
    console.log("Created 10 real cities");

    // Insert focus areas
    const focusAreas = FOCUS_AREAS.map((name) => ({ name }));
    const focusAreasData = await FocusArea.insertMany(focusAreas);
    console.log("Created 10 focus areas");

    // Insert skills
    const skills = SKILLS.map((name) => ({ name }));
    const skillsData = await Skill.insertMany(skills);
    console.log("Created 10 skills");

    // Insert users
    const usedNames = new Set<string>();
    const userData = USERS.map((user) => {
      const username = getRandomUniqueName(usedNames);
      usedNames.add(username);
      return {
        username,
        email: `${username.toLowerCase()}@example.com`,
        password: "password", // You can hash this password if needed
        role: user.role
      };
    });
    const users = await User.insertMany(userData);
    console.log("Created 10 users");

    // Insert volunteers and organizations
    const volunteersData = users
      .filter((user) => user.role === Role.Volunteer)
      .map((user) => ({
        userId: user._id,
        firstName: getRandomUniqueName(usedNames),
        lastName: getRandomUniqueName(usedNames),
        phone: `123-456-789${getRandomNumber(0, 9)}`,
        city: citiesData[getRandomNumber(0, citiesData.length - 1)]._id,
        skills: skillsData
          .slice(0, getRandomNumber(1, 5))
          .map((skill) => skill._id),
        imageUrl: randomAvatarUrl(),
        about:
          "I am passionate about helping the community and looking for opportunities to volunteer."
      }));
    await Volunteer.insertMany(volunteersData);
    console.log("Created 5 volunteers");

    const organizationsData = users
      .filter((user) => user.role === Role.Organization)
      .map((user) => ({
        userId: user._id,
        name: getRandomOrganizationName(),
        city: citiesData[getRandomNumber(0, citiesData.length - 1)]._id,
        focusAreas: focusAreasData
          .slice(0, getRandomNumber(1, 5))
          .map((focusArea) => focusArea._id),
        imageUrl: randomAvatarUrl(),
        description:
          "We are an organization dedicated to making a positive impact in the community.",
        websiteLink: `http://example.com/${getRandomOrganizationName()}`
      }));
    await Organization.insertMany(organizationsData);
    console.log("Created 5 organizations");

    // Insert posts
    const postsData = [...Array(20)].map((_, index) => {
      const isOrganizationPost = index % 2 === 0;
      const user = users[getRandomNumber(0, users.length - 1)];
      const content = isOrganizationPost
        ? ORGANIZATION_POSTS[getRandomNumber(0, ORGANIZATION_POSTS.length - 1)]
        : VOLUNTEER_POSTS[getRandomNumber(0, VOLUNTEER_POSTS.length - 1)];

      return {
        title: isOrganizationPost ? "Organization Post" : "Volunteer Post",
        content,
        imageUrl: randomAvatarUrl(),
        user: user._id,
        skills: skillsData
          .slice(0, getRandomNumber(1, 5))
          .map((skill) => skill._id)
      };
    });
    await Post.insertMany(postsData);
    console.log("Created 20 posts");

    console.log("Database fill complete!");
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Error filling database:", error);
    process.exit(1);
  }
}

fillDb();
