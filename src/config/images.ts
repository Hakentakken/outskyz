const unsplash = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1800&q=85`;

/** Direct, free-to-use Unsplash image URLs for every non-gallery visual. */
export const images = {
  adventureHero: unsplash("photo-1519681393784-d120267933ba"),
  skydiving: unsplash("photo-1521673252667-e05da380b252"),
  windTunnel: "/resources/adventures/wind-tunnel.jpg",
  jetSki: "/resources/adventures/jet-skiing.jpg",
  balloon: "/resources/adventures/hot-air-balloon.jpg",
  helicopter: "/resources/adventures/helicopter-ride.jpg",
  russia: unsplash("photo-1519681393784-d120267933ba"),
  thailand: unsplash("photo-1507525428034-b723cf961d3e"),
  india: unsplash("photo-1524492412937-b28074a5d7da"),
  beyond: unsplash("photo-1469474968028-56623f02e42e"),
  people: unsplash("photo-1529156069898-49953e39b3ac"),
  travel: unsplash("photo-1500530855697-b586d89ba3ee"),
} as const;
