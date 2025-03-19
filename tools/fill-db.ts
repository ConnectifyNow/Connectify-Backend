import dotenv from "dotenv";
import mongoose from "mongoose";
import City from "../src/models/city";
import FocusArea from "../src/models/focusArea";
import Skill from "../src/models/skill";
import User from "../src/models/user";
import Volunteer from "../src/models/volunteer";
import Organization from "../src/models/organization";
import Post from "../src/models/post";
import { getRandomNumber } from "../src/utils/functions";
import { Role } from "../src/types";
import { randomAvatarUrl } from "../src/utils/functions";

dotenv.config();

const DB_URL = process.env.DB_URL;

// Constants
const POST_IMAGES = [
  "https://images.unsplash.com/photo-1559027615-cd4628902d4a",
  "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c",
  "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b",
  "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846",
  "https://images.unsplash.com/photo-1526976668912-1a811878dd37",
  "https://images.unsplash.com/photo-1542810634-71277d95dcbb",
  "https://images.unsplash.com/photo-1593113598332-cd288d649433",
  "https://images.unsplash.com/photo-1593113630400-ea4288922497",
  "https://images.unsplash.com/photo-1547496502-affa22d38842",
  "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8",
  "https://images.unsplash.com/photo-1544027993-37dbfe43562a",
  "https://images.unsplash.com/photo-1517486430290-35657bdcef51",
  "https://images.unsplash.com/photo-1559024094-4a1e4495c3c1",
  "https://images.unsplash.com/photo-1576267423445-b2e0074d68a4",
  "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a",
  "https://images.unsplash.com/photo-1559027615-cd4628902d4a",
  "https://images.unsplash.com/photo-1559024094-4a1e4495c3c1",
  "https://images.unsplash.com/photo-1517457373958-b7bdd4587205",
  "https://images.unsplash.com/photo-1526976668912-1a811878dd37",
  "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b",
  "https://images.unsplash.com/photo-1517457373958-b7bdd4587205",
  "https://images.unsplash.com/photo-1509099836639-18ba1795216d",
  "https://images.unsplash.com/photo-1511632765486-a01980e01a18",
  "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c",
  "https://images.unsplash.com/photo-1560252829-804f1aedf1be",
  "https://images.unsplash.com/photo-1559024094-4a1e4495c3c1",
  "https://images.unsplash.com/photo-1517457373958-b7bdd4587205",
  "https://images.unsplash.com/photo-1526976668912-1a811878dd37"
];
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
  "San Jose",
  "Seattle",
  "Boston",
  "Denver",
  "Atlanta",
  "Portland"
];

const FOCUS_AREAS = [
  "Disaster Relief",
  "Education",
  "Healthcare",
  "Homelessness",
  "Animal Welfare",
  "Environmental Conservation",
  "Youth Development",
  "Elderly Care",
  "Food Security",
  "Mental Health",
  "Disability Support",
  "Community Development",
  "Refugee Support",
  "Arts & Culture",
  "Veterans Support"
];

const SKILLS = [
  "Teaching",
  "Mentoring",
  "Event Planning",
  "Fundraising",
  "Social Media",
  "First Aid",
  "Graphic Design",
  "Web Development",
  "Photography",
  "Cooking",
  "Construction",
  "Counseling",
  "Project Management",
  "Public Speaking",
  "Translation"
];

// Generate a realistic mix of users (60% volunteers, 40% organizations)
const generateUsers = (count: number) => {
  const users = [];
  for (let i = 0; i < count; i++) {
    const role = i < count * 0.6 ? Role.Volunteer : Role.Organization;
    users.push({ role });
  }
  return users;
};

const USERS = generateUsers(50);

// More realistic organization posts
const ORGANIZATION_POSTS = [
  {
    title: "Volunteer Needed: Community Garden Project",
    content:
      "We're looking for volunteers to help plant and maintain our community garden. Learn about sustainable gardening while helping provide fresh produce to local food banks. No experience necessary - just bring your enthusiasm and willingness to get your hands dirty!"
  },
  {
    title: "Mentors Wanted for Youth Program",
    content:
      "Our after-school program needs caring adults to mentor underprivileged youth. Just 2 hours per week can make a lasting impact on a child's life. Training provided. Background check required."
  },
  {
    title: "Emergency Shelter Volunteers",
    content:
      "As winter approaches, our homeless shelter needs additional volunteers to help with meal service, check-in, and overnight shifts. This is a great opportunity for those wanting to directly impact the lives of vulnerable community members."
  },
  {
    title: "Virtual Tutoring Program",
    content:
      "Help students succeed by becoming an online tutor! We're looking for volunteers proficient in math, science, and English to provide virtual tutoring sessions for K-12 students. Flexible scheduling available."
  },
  {
    title: "Beach Cleanup Event",
    content:
      "Join our monthly beach cleanup initiative! We'll provide all necessary equipment - you just need to bring water, sunscreen, and a commitment to protecting our coastal ecosystems. Great for families, groups, and individuals."
  },
  {
    title: "Tech Skills Workshop Leaders",
    content:
      "Share your technology expertise with job seekers! We're looking for volunteers to lead workshops on basic computer skills, Microsoft Office, and social media for professional networking."
  },
  {
    title: "Animal Shelter Assistance",
    content:
      "Our animal rescue center needs volunteers to help walk dogs, socialize cats, and assist with feeding and cleaning. This is perfect for animal lovers who can commit to regular weekly shifts."
  },
  {
    title: "Senior Companion Program",
    content:
      "Help reduce isolation among seniors by becoming a companion volunteer. Duties include friendly visits, assistance with errands, and simply providing conversation and companionship to elderly community members."
  },
  {
    title: "Food Bank Distribution Team",
    content:
      "Our food bank serves hundreds of families each week, and we need volunteers to help sort donations, pack boxes, and assist with distribution. This is a physical role that makes an immediate difference in fighting hunger."
  },
  {
    title: "Fundraising Gala Volunteers",
    content:
      "Our annual fundraising gala is coming up, and we need volunteers to help with setup, registration, silent auction management, and other event support. This is a fun way to support our cause while enjoying a elegant evening."
  },
  {
    title: "Crisis Hotline Responders",
    content:
      "After completing our training program, crisis hotline volunteers provide emotional support and resources to callers in distress. This challenging but rewarding role requires empathy, good listening skills, and reliability."
  },
  {
    title: "Habitat Build Volunteers",
    content:
      "Help build homes for deserving families! Construction experience is helpful but not required - we'll teach you everything you need to know. Both individual volunteers and groups are welcome."
  }
];

// More realistic volunteer posts
const VOLUNTEER_POSTS = [
  {
    title: "Experienced Tutor Available",
    content:
      "I'm a retired teacher with 25 years of experience in elementary education. I'm available to tutor students or help with educational programs 3 afternoons per week. I'm passionate about literacy and making learning fun!"
  },
  {
    title: "Social Media Manager Offering Services",
    content:
      "Marketing professional with 5+ years of experience in digital marketing looking to help nonprofits improve their online presence. Can assist with content creation, scheduling, and strategy development."
  },
  {
    title: "Weekend Availability for Manual Labor",
    content:
      "I'm a construction worker by trade and would like to use my skills to give back to the community. Available most weekends for building projects, repairs, or any physical work that needs strong hands."
  },
  {
    title: "Looking for Virtual Volunteer Opportunities",
    content:
      "Recent college graduate with limited transportation seeking remote volunteer opportunities. Skilled in research, writing, and data analysis. Can commit to 5-10 hours weekly for the right cause."
  },
  {
    title: "Healthcare Professional Offering Services",
    content:
      "I'm a registered nurse with experience in community health. I'm available to volunteer at health fairs, vaccination clinics, or educational programs. Certified in First Aid and CPR instruction."
  },
  {
    title: "Driver Available for Deliveries",
    content:
      "Retired but active senior with reliable vehicle looking to help with meal deliveries, transportation for medical appointments, or other driving needs. Clean driving record and flexible schedule."
  },
  {
    title: "Legal Professional Seeking Pro Bono Work",
    content:
      "Attorney specializing in family law interested in providing free legal advice to low-income clients. Can help with document review, know-your-rights workshops, or legal clinics."
  },
  {
    title: "Event Photographer Offering Services",
    content:
      "Amateur photographer with professional equipment looking to document charity events, fundraisers, or community activities. Will provide high-quality digital images at no cost."
  }
];

// Success stories and community updates
const SUCCESS_POSTS = [
  {
    title: "Volunteer Spotlight: Jane's Journey",
    content:
      "After volunteering with us for just six months, Jane has made an incredible impact on our literacy program. She's helped 15 adults improve their reading skills, leading to better job opportunities and increased confidence. 'Seeing someone read their first book is an indescribable feeling,' Jane says."
  },
  {
    title: "Community Garden Yields Record Harvest",
    content:
      "Thanks to our dedicated volunteers, our community garden produced over 2,000 pounds of fresh produce this season! All vegetables were donated to local food pantries, providing healthy options for families in need. Join us next spring to help us grow even more!"
  },
  {
    title: "Youth Mentorship Program Celebrates Graduation",
    content:
      "This month, we celebrated as 25 students from our mentorship program graduated high school. Many are the first in their families to earn diplomas, and 80% are continuing to college or technical training. Our volunteer mentors have been instrumental in this success."
  },
  {
    title: "Homeless Shelter Expansion Complete",
    content:
      "After months of fundraising and volunteer construction work, we've completed the expansion of our emergency shelter. We can now accommodate 50 additional people each night, ensuring fewer community members have to sleep outside during dangerous weather conditions."
  },
  {
    title: "Medical Clinic Serves 1000th Patient",
    content:
      "Our volunteer-run free clinic reached a milestone this week, serving its 1000th patient! With a team of dedicated healthcare professionals donating their time, we've provided critical care to uninsured community members. Special thanks to Dr. Martinez for coordinating this effort."
  }
];

// Helper functions
const getRandomFirstName = () => {
  const names = [
    "James",
    "Mary",
    "Robert",
    "Patricia",
    "John",
    "Jennifer",
    "Michael",
    "Linda",
    "David",
    "Elizabeth",
    "William",
    "Susan",
    "Richard",
    "Jessica",
    "Joseph",
    "Sarah",
    "Thomas",
    "Karen",
    "Charles",
    "Nancy",
    "Christopher",
    "Lisa",
    "Daniel",
    "Margaret",
    "Matthew",
    "Betty",
    "Anthony",
    "Sandra",
    "Mark",
    "Ashley",
    "Donald",
    "Kimberly",
    "Steven",
    "Emily",
    "Paul",
    "Donna",
    "Andrew",
    "Michelle",
    "Joshua",
    "Carol",
    "Kenneth",
    "Amanda",
    "Kevin",
    "Dorothy",
    "Brian",
    "Melissa",
    "George",
    "Deborah",
    "Timothy",
    "Stephanie",
    "Ronald",
    "Rebecca",
    "Edward",
    "Sharon",
    "Jason",
    "Laura",
    "Jeffrey",
    "Cynthia",
    "Ryan",
    "Kathleen",
    "Jacob",
    "Amy",
    "Gary",
    "Angela",
    "Nicholas",
    "Shirley",
    "Eric",
    "Brenda",
    "Jonathan",
    "Emma",
    "Stephen",
    "Anna",
    "Larry",
    "Pamela",
    "Justin",
    "Nicole",
    "Scott",
    "Samantha",
    "Brandon",
    "Katherine",
    "Benjamin",
    "Christine",
    "Samuel",
    "Helen",
    "Gregory",
    "Debra",
    "Alexander",
    "Rachel",
    "Patrick",
    "Carolyn",
    "Frank",
    "Janet",
    "Raymond",
    "Maria",
    "Jack",
    "Catherine",
    "Dennis",
    "Heather",
    "Jerry",
    "Diane",
    "Tyler",
    "Olivia",
    "Aaron",
    "Julie",
    "Jose",
    "Joyce",
    "Adam",
    "Victoria",
    "Nathan",
    "Kelly",
    "Henry",
    "Christina",
    "Zachary",
    "Lauren",
    "Douglas",
    "Joan",
    "Peter",
    "Evelyn",
    "Kyle",
    "Judith",
    "Noah",
    "Megan",
    "Ethan",
    "Andrea",
    "Jeremy",
    "Cheryl",
    "Walter",
    "Hannah",
    "Christian",
    "Jacqueline",
    "Keith",
    "Martha",
    "Roger",
    "Gloria",
    "Noah",
    "Teresa",
    "Terry",
    "Ann",
    "Austin",
    "Sara",
    "Sean",
    "Madison",
    "Gerald",
    "Frances",
    "Carl",
    "Kathryn",
    "Harold",
    "Janice",
    "Dylan",
    "Jean",
    "Arthur",
    "Abigail",
    "Lawrence",
    "Alice",
    "Jordan",
    "Julia",
    "Jesse",
    "Judy",
    "Bryan",
    "Sophia",
    "Billy",
    "Grace",
    "Bruce",
    "Denise",
    "Gabriel",
    "Amber",
    "Joe",
    "Doris",
    "Logan",
    "Marilyn",
    "Alan",
    "Danielle",
    "Juan",
    "Beverly",
    "Albert",
    "Isabella",
    "Willie",
    "Theresa",
    "Elijah",
    "Diana",
    "Wayne",
    "Natalie",
    "Randy",
    "Brittany",
    "Roy",
    "Charlotte",
    "Vincent",
    "Marie",
    "Ralph",
    "Kayla",
    "Eugene",
    "Alexis",
    "Russell",
    "Lori",
    "Louis",
    "Khalid",
    "Maya",
    "Zara",
    "Omar",
    "Aisha",
    "Wei",
    "Ming",
    "Jing",
    "Chen",
    "Raj",
    "Priya",
    "Sanjay",
    "Fatima",
    "Ibrahim",
    "Aicha",
    "Hiro",
    "Yuki",
    "Akira",
    "Seo-jun",
    "Ji-woo",
    "Carlos",
    "Javier",
    "Elena",
    "Amir",
    "Reza",
    "Ava",
    "Aaliyah",
    "Kenji",
    "Kimiko"
  ];
  return names[getRandomNumber(0, names.length - 1)];
};

const getRandomLastName = () => {
  const names = [
    "Smith",
    "Johnson",
    "Williams",
    "Brown",
    "Jones",
    "Garcia",
    "Miller",
    "Davis",
    "Rodriguez",
    "Martinez",
    "Hernandez",
    "Lopez",
    "Gonzalez",
    "Wilson",
    "Anderson",
    "Thomas",
    "Taylor",
    "Moore",
    "Jackson",
    "Martin",
    "Lee",
    "Perez",
    "Thompson",
    "White",
    "Harris",
    "Sanchez",
    "Clark",
    "Ramirez",
    "Lewis",
    "Robinson",
    "Walker",
    "Young",
    "Allen",
    "King",
    "Wright",
    "Scott",
    "Torres",
    "Nguyen",
    "Hill",
    "Flores",
    "Green",
    "Adams",
    "Nelson",
    "Baker",
    "Hall",
    "Rivera",
    "Campbell",
    "Mitchell",
    "Carter",
    "Roberts",
    "Gomez",
    "Phillips",
    "Evans",
    "Turner",
    "Diaz",
    "Parker",
    "Cruz",
    "Edwards",
    "Collins",
    "Reyes",
    "Stewart",
    "Morris",
    "Morales",
    "Murphy",
    "Cook",
    "Rogers",
    "Gutierrez",
    "Ortiz",
    "Morgan",
    "Cooper",
    "Peterson",
    "Bailey",
    "Reed",
    "Kelly",
    "Howard",
    "Ramos",
    "Kim",
    "Cox",
    "Ward",
    "Richardson",
    "Watson",
    "Brooks",
    "Chavez",
    "Wood",
    "James",
    "Bennett",
    "Gray",
    "Mendoza",
    "Ruiz",
    "Hughes",
    "Price",
    "Alvarez",
    "Castillo",
    "Sanders",
    "Patel",
    "Myers",
    "Long",
    "Ross",
    "Foster",
    "Jimenez",
    "Powell",
    "Jenkins",
    "Perry",
    "Russell",
    "Sullivan",
    "Bell",
    "Coleman",
    "Butler",
    "Henderson",
    "Barnes",
    "Gonzales",
    "Fisher",
    "Vasquez",
    "Simmons",
    "Romero",
    "Jordan",
    "Patterson",
    "Alexander",
    "Hamilton",
    "Graham",
    "Reynolds",
    "Griffin",
    "Wallace",
    "Moreno",
    "West",
    "Cole",
    "Hayes",
    "Bryant",
    "Herrera",
    "Gibson",
    "Ellis",
    "Tran",
    "Medina",
    "Aguilar",
    "Stevens",
    "Murray",
    "Ford",
    "Castro",
    "Marshall",
    "Owens",
    "Harrison",
    "Fernandez",
    "McDonald",
    "Woods",
    "Washington",
    "Kennedy",
    "Wells",
    "Chen",
    "Hoffman",
    "Meyer",
    "Soto",
    "Walsh",
    "Warren",
    "Rivas",
    "Daniels",
    "Espinoza",
    "Fujimoto",
    "Khan",
    "Sharma",
    "Gupta",
    "Wong",
    "Liu",
    "Singh",
    "Wu",
    "Zhang",
    "Li",
    "Wang",
    "Okafor",
    "Adebayo",
    "Kimura",
    "Tanaka",
    "Suzuki",
    "Yamamoto",
    "Nakamura",
    "Ahmed",
    "Hassan",
    "Mahmoud",
    "Ali",
    "Choi",
    "Park",
    "Kim",
    "Ngo",
    "Tran",
    "Phan",
    "Diop",
    "Mbeki",
    "Osei",
    "Mensah",
    "Rossi",
    "Bianchi",
    "Ricci",
    "Esposito",
    "Romano",
    "Novak",
    "Kovac",
    "Dvorak",
    "Nagy",
    "Hernandez",
    "Fernandez",
    "Martinez",
    "Rodriguez",
    "Gonzalez",
    "Lopez",
    "Perez"
  ];
  return names[getRandomNumber(0, names.length - 1)];
};

const getRandomOrganizationName = () => {
  const prefixes = [
    "United",
    "Global",
    "Community",
    "Hope",
    "Caring",
    "Helping",
    "Better",
    "Bright",
    "Green",
    "New",
    "Open",
    "Local",
    "Rising",
    "Active",
    "First",
    "Good",
    "Project",
    "Civic",
    "Urban",
    "Rural",
    "Regional",
    "National",
    "International",
    "World",
    "Forward",
    "Strong",
    "Healthy",
    "Sustainable",
    "Inclusive",
    "Diverse",
    "Empowering"
  ];

  const middleParts = [
    "Hands",
    "Hearts",
    "Minds",
    "Futures",
    "Dreams",
    "Voices",
    "Allies",
    "Partners",
    "Guardians",
    "Champions",
    "Volunteers",
    "Citizens",
    "Neighbors",
    "Friends",
    "Heroes",
    "Leaders",
    "Advocates",
    "Builders",
    "Keepers",
    "Protectors",
    "Supporters",
    "Healers"
  ];

  const suffixes = [
    "Foundation",
    "Initiative",
    "Alliance",
    "Coalition",
    "Network",
    "Association",
    "Trust",
    "Society",
    "Council",
    "Center",
    "Project",
    "Action",
    "Movement",
    "Corps",
    "Collective",
    "Collaborative",
    "Partners",
    "Hub",
    "Connection",
    "Community",
    "Group"
  ];

  const types = [
    "for Youth",
    "for Change",
    "for Children",
    "for Animals",
    "for Justice",
    "for Education",
    "for Health",
    "for Equality",
    "for Sustainability",
    "for Veterans",
    "for Seniors",
    "for Recovery",
    "for Hope",
    "for Opportunity",
    "for Tomorrow",
    "for Humanity",
    "for Progress",
    "for Innovation",
    "for Development",
    "for Empowerment"
  ];

  // Different patterns for organization names
  const pattern = getRandomNumber(1, 5);

  switch (pattern) {
    case 1:
      return `${prefixes[getRandomNumber(0, prefixes.length - 1)]} ${
        middleParts[getRandomNumber(0, middleParts.length - 1)]
      }`;
    case 2:
      return `${prefixes[getRandomNumber(0, prefixes.length - 1)]} ${
        suffixes[getRandomNumber(0, suffixes.length - 1)]
      }`;
    case 3:
      return `${middleParts[getRandomNumber(0, middleParts.length - 1)]} ${
        suffixes[getRandomNumber(0, suffixes.length - 1)]
      }`;
    case 4:
      return `${prefixes[getRandomNumber(0, prefixes.length - 1)]} ${
        middleParts[getRandomNumber(0, middleParts.length - 1)]
      } ${suffixes[getRandomNumber(0, suffixes.length - 1)]}`;
    case 5:
      return `${prefixes[getRandomNumber(0, prefixes.length - 1)]} ${
        suffixes[getRandomNumber(0, suffixes.length - 1)]
      } ${types[getRandomNumber(0, types.length - 1)]}`;
    default:
      return `${prefixes[getRandomNumber(0, prefixes.length - 1)]} ${
        middleParts[getRandomNumber(0, middleParts.length - 1)]
      }`;
  }
};

const getRandomEmail = (firstName: string, lastName: string) => {
  const domains = [
    "gmail.com",
    "yahoo.com",
    "outlook.com",
    "hotmail.com",
    "aol.com",
    "icloud.com",
    "protonmail.com",
    "mail.com"
  ];
  const patterns = [
    `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${
      domains[getRandomNumber(0, domains.length - 1)]
    }`,
    `${firstName.toLowerCase()}${lastName.toLowerCase()}@${
      domains[getRandomNumber(0, domains.length - 1)]
    }`,
    `${firstName.toLowerCase()}_${lastName.toLowerCase()}@${
      domains[getRandomNumber(0, domains.length - 1)]
    }`,
    `${firstName.toLowerCase()}${getRandomNumber(1, 999)}@${
      domains[getRandomNumber(0, domains.length - 1)]
    }`,
    `${lastName.toLowerCase()}.${firstName.toLowerCase()}@${
      domains[getRandomNumber(0, domains.length - 1)]
    }`,
    `${firstName.toLowerCase()[0]}${lastName.toLowerCase()}@${
      domains[getRandomNumber(0, domains.length - 1)]
    }`
  ];
  return patterns[getRandomNumber(0, patterns.length - 1)];
};

const getRandomOrganizationEmail = (orgName: string) => {
  // Clean up organization name for email
  const cleanName = orgName
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[^\w\s]/gi, "");
  const domains = [
    "org",
    "ngo",
    "foundation",
    "network",
    "association",
    "community"
  ];
  return `info@${cleanName}.${domains[getRandomNumber(0, domains.length - 1)]}`;
};

const getRandomPhoneNumber = () => {
  const areaCode = getRandomNumber(200, 999);
  const prefix = getRandomNumber(200, 999);
  const lineNumber = getRandomNumber(1000, 9999);
  return `${areaCode}-${prefix}-${lineNumber}`;
};

const getRandomWebsite = (orgName: string) => {
  const cleanName = orgName
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\s-]/gi, "");
  const domains = ["org", "ngo", "foundation", "network", "community"];
  return `https://www.${cleanName}.${
    domains[getRandomNumber(0, domains.length - 1)]
  }`;
};

const getRandomVolunteerAbout = () => {
  const introductions = [
    "I'm passionate about making a difference in my community.",
    "I believe in the power of volunteering to create positive change.",
    "I'm looking to use my skills to help others and make an impact.",
    "I have experience in various volunteer roles and enjoy giving back.",
    "I'm excited to connect with organizations that align with my values.",
    "I'm committed to serving others and building a stronger community.",
    "I'm seeking meaningful volunteer opportunities where I can contribute.",
    "I enjoy meeting new people while working toward common goals.",
    "I'm motivated by the opportunity to learn and grow through service.",
    "I've always found fulfillment in helping others and want to continue."
  ];

  const skills = [
    "I have experience in project management and organization.",
    "I'm skilled in communication and public speaking.",
    "I enjoy working with children and have relevant experience.",
    "I'm comfortable with technology and can help with digital tasks.",
    "I have a background in healthcare and can assist with medical initiatives.",
    "I'm passionate about environmental conservation and sustainability.",
    "I have experience in fundraising and donor relations.",
    "I'm skilled in graphic design and marketing materials.",
    "I enjoy working with seniors and have relevant experience.",
    "I have a background in education and can help with teaching initiatives.",
    "I'm fluent in multiple languages and can assist with translation.",
    "I have experience in event planning and coordination."
  ];

  const availabilities = [
    "I'm available on weekends and some weekday evenings.",
    "I can commit to regular weekly volunteering opportunities.",
    "I'm flexible and can adjust my schedule based on needs.",
    "I'm available for both short-term projects and ongoing commitments.",
    "I can volunteer remotely or in-person depending on the opportunity.",
    "I'm particularly available during summer months when I have more free time.",
    "I'm looking for opportunities that allow me to volunteer 5-10 hours per week.",
    "I can help with occasional events or regular programs.",
    "I'm available on a project basis for specific initiatives.",
    "I'm retired and have considerable flexibility in my schedule."
  ];

  return `${introductions[getRandomNumber(0, introductions.length - 1)]} ${
    skills[getRandomNumber(0, skills.length - 1)]
  } ${availabilities[getRandomNumber(0, availabilities.length - 1)]}`;
};

const getRandomOrganizationDescription = () => {
  const missions = [
    "Our mission is to create a more equitable and compassionate community through volunteer service.",
    "We are dedicated to addressing social issues through collective action and community engagement.",
    "Our organization works to empower individuals and strengthen communities through diverse initiatives.",
    "We believe in fostering positive change through collaboration and dedicated volunteerism.",
    "Our goal is to build a more inclusive society by connecting people with meaningful service opportunities.",
    "We aim to improve quality of life for all community members through targeted volunteer programs.",
    "Our organization is committed to sustainable development and community resilience.",
    "We work to bridge gaps in service and support for underserved populations.",
    "Our mission centers on creating pathways for meaningful civic engagement and social impact.",
    "We focus on developing innovative solutions to pressing community challenges."
  ];

  const programs = [
    "Our programs include mentorship, educational support, and community outreach initiatives.",
    "We offer volunteer opportunities in areas such as youth development, senior services, and environmental conservation.",
    "Our projects range from direct service to advocacy and awareness campaigns.",
    "We coordinate events, ongoing programs, and rapid response initiatives based on community needs.",
    "Our work includes direct assistance programs, capacity building, and community education.",
    "We manage volunteer-led projects addressing health, education, and economic opportunity.",
    "Our initiatives focus on both immediate needs and long-term community development.",
    "We provide training, resources, and coordination for various service projects throughout the year.",
    "Our organization supports both individual volunteers and corporate service groups.",
    "We implement evidence-based programs that address root causes of community challenges."
  ];

  const impacts = [
    "Since our founding, we've engaged over 1,000 volunteers and served 5,000+ community members.",
    "Our efforts have contributed to measurable improvements in community health and wellbeing.",
    "We've been recognized for our innovative approaches to volunteer engagement and community service.",
    "Our volunteers contribute thousands of hours annually toward creating positive social change.",
    "We've established strong partnerships with local businesses, schools, and government agencies.",
    "Our organization has a track record of meaningful impact through strategic volunteer initiatives.",
    "We've helped develop new leaders while addressing critical community needs.",
    "Our collaborative approach has resulted in sustainable solutions to complex challenges.",
    "We've created a network of engaged citizens committed to ongoing community improvement.",
    "Our programs have demonstrated significant positive outcomes for participants and communities."
  ];

  return `${missions[getRandomNumber(0, missions.length - 1)]} ${
    programs[getRandomNumber(0, programs.length - 1)]
  } ${impacts[getRandomNumber(0, impacts.length - 1)]}`;
};

// Main function to fill the database
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
    console.log(`Created ${citiesData.length} cities`);

    // Insert focus areas
    const focusAreas = FOCUS_AREAS.map((name) => ({ name }));
    const focusAreasData = await FocusArea.insertMany(focusAreas);
    console.log(`Created ${focusAreasData.length} focus areas`);

    // Insert skills
    const skills = SKILLS.map((name) => ({ name }));
    const skillsData = await Skill.insertMany(skills);
    console.log(`Created ${skillsData.length} skills`);

    const usersData = [];
    for (let i = 0; i < USERS.length; i++) {
      const user = USERS[i];
      const isOrganization = user.role === Role.Organization;

      if (isOrganization) {
        const orgName = getRandomOrganizationName();
        usersData.push({
          username: orgName.toLowerCase().replace(/\s+/g, "_"),
          email: getRandomOrganizationEmail(orgName),
          password: "password123",
          role: Role.Organization
        });
      } else {
        const firstName = getRandomFirstName();
        const lastName = getRandomLastName();
        usersData.push({
          username: `${firstName.toLowerCase()}${lastName
            .toLowerCase()
            .substring(0, 2)}`,
          email: getRandomEmail(firstName, lastName),
          password: "password123",
          role: Role.Volunteer
        });
      }
    }

    const users = await User.insertMany(usersData);
    console.log(`Created ${users.length} users`);

    // Insert volunteers
    const volunteersData = users
      .filter((user) => user.role === Role.Volunteer)
      .map((user) => {
        const firstName = getRandomFirstName();
        const lastName = getRandomLastName();
        return {
          userId: user._id,
          firstName,
          lastName,
          phone: getRandomPhoneNumber(),
          city: citiesData[getRandomNumber(0, citiesData.length - 1)]._id,
          skills: skillsData
            .sort(() => 0.5 - Math.random())
            .slice(0, getRandomNumber(1, 5))
            .map((skill) => skill._id),
          about: getRandomVolunteerAbout(),
          imageUrl: randomAvatarUrl()
        };
      });

    await Volunteer.insertMany(volunteersData);
    console.log(`Created ${volunteersData.length} volunteers`);

    // Insert organizations
    const organizationsData = users
      .filter((user) => user.role === Role.Organization)
      .map((user) => {
        const orgName = user.username
          .replace(/_/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase());
        return {
          userId: user._id,
          name: orgName,
          city: citiesData[getRandomNumber(0, citiesData.length - 1)]._id,
          focusAreas: focusAreasData
            .sort(() => 0.5 - Math.random())
            .slice(0, getRandomNumber(1, 3))
            .map((focusArea) => focusArea._id),
          description: getRandomOrganizationDescription(),
          websiteLink: getRandomWebsite(orgName),
          imageUrl: randomAvatarUrl()
        };
      });

    await Organization.insertMany(organizationsData);
    console.log(`Created ${organizationsData.length} organizations`);

    // Insert posts - Create a mix of opportunity posts and success stories
    const postsData = [];

    // Create a range of dates for the posts (last 3 months to now)
    const getRandomDate = () => {
      const now = new Date();
      const threeMonthsAgo = new Date(now);
      threeMonthsAgo.setMonth(now.getMonth() - 3);

      return new Date(
        threeMonthsAgo.getTime() +
          Math.random() * (now.getTime() - threeMonthsAgo.getTime())
      );
    };

    // Generate organization posts (opportunities and success stories)
    const orgUsers = users.filter((u) => u.role === Role.Organization);
    for (let i = 0; i < 20; i++) {
      const user = orgUsers[getRandomNumber(0, orgUsers.length - 1)];

      // 75% opportunity posts, 25% success stories
      const isOpportunityPost = getRandomNumber(1, 100) <= 75;
      let post;

      if (isOpportunityPost) {
        post =
          ORGANIZATION_POSTS[getRandomNumber(0, ORGANIZATION_POSTS.length - 1)];
      } else {
        post = SUCCESS_POSTS[getRandomNumber(0, SUCCESS_POSTS.length - 1)];
      }

      postsData.push({
        title: post.title,
        content: post.content,
        user: user._id,
        skills: skillsData
          .sort(() => 0.5 - Math.random())
          .slice(0, getRandomNumber(0, 3))
          .map((skill) => skill._id),
        createdAt: getRandomDate()
      });
    }

    // Generate volunteer posts
    const volunteerUsers = users.filter((u) => u.role === Role.Volunteer);
    for (let i = 0; i < 15; i++) {
      const user =
        volunteerUsers[getRandomNumber(0, volunteerUsers.length - 1)];
      const post =
        VOLUNTEER_POSTS[getRandomNumber(0, VOLUNTEER_POSTS.length - 1)];

      postsData.push({
        title: post.title,
        content: post.content,
        user: user._id,
        skills: skillsData
          .sort(() => 0.5 - Math.random())
          .slice(0, getRandomNumber(0, 3))
          .map((skill) => skill._id),
        createdAt: getRandomDate(),
        imageUrl: POST_IMAGES[getRandomNumber(0, POST_IMAGES.length - 1)]
      });
    }

    // Insert all posts
    await Post.insertMany(postsData);
    console.log(`Created ${postsData.length} posts`);

    console.log("Database successfully populated!");
    await mongoose.connection.close();
    console.log("Database connection closed");
  } catch (error) {
    console.error("Error filling database:", error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

fillDb();
