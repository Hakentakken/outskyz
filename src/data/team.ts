import { images } from "@/config/images";

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  /**
   * Portrait photograph path under `public/team/`.
   * See `public/team/README.md` for the file-drop-in checklist.
   */
  image: string;
  /**
   * Set when the real person has not been confirmed yet. Surfaced in the UI
   * as an obvious TODO instead of silently shipping a job title as a name.
   */
  needsName?: boolean;
}

export const teamHero = {
  heading: "OUR TEAM",
  subtitle: "THE PEOPLE BEHIND YOUR JOURNEY",
  image: images.people,
} as const;

/**
 * Team roster.
 *
 * TODO(owner): entries flagged `needsName: true` currently carry a job title
 * in the `name` field because the real person's name has not been supplied.
 * Replace the placeholder name with the real one and drop the flag — see
 * `public/team/README.md`.
 */
export const teamMembers: TeamMember[] = [
  {
    id: "matvei",
    name: "Matvei Michkov",
    role: "Skydiving Instructor",
    bio: "Professional skydiver and freefall specialist with advanced coaching experience.",
    image: "/team/matvei-michkov.jpg",
  },
  {
    id: "tunnel-instructor",
    name: "TODO — name needed",
    role: "Wind Tunnel Instructor",
    bio: "Expert in indoor skydiving and bodyflight coaching with a focus on control and technique.",
    image: "/team/wind-tunnel-instructor.jpg",
    needsName: true,
  },
  {
    id: "wind-expert",
    name: "TODO — name needed",
    role: "Wind Tunnel Expert",
    bio: "Advanced bodyflight coach specialising in control, stability and performance.",
    image: "/team/wind-expert.jpg",
    needsName: true,
  },
  {
    id: "jump-coach",
    name: "TODO — name needed",
    role: "Skydiving Instructor",
    bio: "Specialist in tandem jumps, freefall skills and safe canopy control.",
    image: "/team/skydiving-instructor.jpg",
    needsName: true,
  },
  {
    id: "safety-coach",
    name: "TODO — name needed",
    role: "Skydiving Coach",
    bio: "Safety, gear and ground training specialist for all jump levels.",
    image: "/team/skydiving-coach.jpg",
    needsName: true,
  },
  {
    id: "havishadwaz",
    name: "Havishadwaz",
    role: "Experience Curator",
    bio: "Adventure planner and experience curator ensuring world-class journeys.",
    image: "/team/havishadwaz.jpg",
  },
];