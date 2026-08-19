export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
}

export const teamHero = {
  heading: "OUR TEAM",
  subtitle: "THE PEOPLE BEHIND YOUR JOURNEY",
  image: images.people,
} as const;

export const teamMembers: TeamMember[] = [
  {
    id: "matvei",
    name: "Matvei Michkov",
    role: "Skydiving Instructor",
    bio: "Professional skydiver and freefall specialist with advanced coaching experience.",
    image: images.people,
  },
  {
    id: "tunnel-instructor",
    name: "Wind Tunnel Instructor",
    role: "Wind Tunnel Expert",
    bio: "Expert in indoor skydiving and bodyflight coaching with a focus on control and technique.",
    image: images.people,
  },
  {
    id: "wind-expert",
    name: "Wind Tunnel Expert",
    role: "Flight & Coach",
    bio: "Advanced bodyflight coach specializing in control, stability and performance.",
    image: images.people,
  },
  {
    id: "jump-coach",
    name: "Skydiving Instructor",
    role: "Jump & Canopy Coach",
    bio: "Specialist in tandem jumps, freefall skills and safe canopy control.",
    image: images.people,
  },
  {
    id: "safety-coach",
    name: "Skydiving Coach",
    role: "Safety & Ground Trainer",
    bio: "Safety, gear and ground training specialist for all jump levels.",
    image: images.people,
  },
  {
    id: "havishadwaz",
    name: "Havishadwaz",
    role: "ZIP Gravity Hyderabad",
    bio: "Adventure planner and experience curator ensuring world-class journeys.",
    image: images.people,
  },
];
import { images } from "@/config/images";
