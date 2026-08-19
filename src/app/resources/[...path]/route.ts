import { NextRequest, NextResponse } from "next/server";

const photo = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1800&q=85`;

const visuals = {
  russia: photo("photo-1519681393784-d120267933ba"),
  thailand: photo("photo-1507525428034-b723cf961d3e"),
  india: photo("photo-1524492412937-b28074a5d7da"),
  skydiving: photo("photo-1521673252667-e05da380b252"),
  wind: photo("photo-1533130061792-64b345e4a833"),
  water: photo("photo-1530053969600-caed2596d242"),
  balloon: photo("photo-1528181304800-259b08848526"),
  helicopter: photo("photo-1521401830884-6c03c1c87ebb"),
  people: photo("photo-1529156069898-49953e39b3ac"),
  travel: photo("photo-1469474968028-56623f02e42e"),
};

export function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return params.then(({ path }) => {
    const name = path.join("/").toLowerCase();
    let destination = visuals.travel;
    if (name.includes("russia") || name.includes("moscow")) destination = visuals.russia;
    else if (name.includes("thailand") || name.includes("phuket")) destination = visuals.thailand;
    else if (name.includes("india") || name.includes("jaipur")) destination = visuals.india;
    else if (name.includes("skydiv") || name.includes("tandem")) destination = visuals.skydiving;
    else if (name.includes("wind")) destination = visuals.wind;
    else if (name.includes("jet")) destination = visuals.water;
    else if (name.includes("balloon")) destination = visuals.balloon;
    else if (name.includes("helicopter")) destination = visuals.helicopter;
    else if (name.includes("team") || name.includes("founder")) destination = visuals.people;
    return NextResponse.redirect(destination, { status: 307 });
  });
}
