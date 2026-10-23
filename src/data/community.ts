export const reviewedOn = "October 23, 2026";
export const campaign = { raised: 200, goal: 350 };
export const donationLinks = {
  furkids: "https://furkids.org/donation",
  supplies: "https://atlantahumane.org/contact-us/donate-supplies/",
};
export const wishlist = [
  { name: "Milkbones", detail: "10 lb box", category: "Treats" },
  { name: "Large, heavy-duty dog leash", detail: "Strong, durable leash", category: "Walking" },
  { name: "Rope toys", detail: "Durable toys for dogs", category: "Enrichment" },
  { name: "Water and food bowls", detail: "Easy-to-clean bowls", category: "Everyday care" },
  { name: "Rescue Disinfectant", detail: "Check the shelter’s preferred product and size before purchasing", category: "Cleaning" },
];
export const leaders = [
  { name: "Matthew Pastor", hours: 51 },
  { name: "Finn Bennett", hours: 33 },
  { name: "Kyle Wright", hours: 27 },
];
export const shelters = [
  { id: "paws", name: "PAWS Atlanta", area: "Decatur", address: "5287 Covington Highway, Decatur, GA 30035", description: "Dog care, enrichment, events and off-site supply drives.", eligibility: "On-site volunteering is 18+. Younger students can organize off-site supply drives and fundraisers.", volunteer: "https://www.pawsatlanta.org/volunteer-overview/individual", signup: "https://app.betterimpact.com/Application?ApplicationFormNumber=1&OrganizationGuid=d9c2f9c8-6b5d-49ac-9316-ee516417a55e", signupLabel: "Apply to volunteer", portal: "https://app.betterimpact.com/Login", youth: "https://www.pawsatlanta.org/volunteer-overview/youth", calendar: "https://www.pawsatlanta.org/events", website: "https://www.pawsatlanta.org", note: "Apply first, then complete orientation before scheduling a shift." },
  { id: "ahs", name: "Atlanta Humane Society", area: "Atlanta & Roswell", address: "1551 Perry Boulevard NW, Atlanta, GA 30318", description: "Shelter volunteering, dog adoption events and school community service.", eligibility: "The documented community-service program is 18+. Check the regular volunteer application for role-specific requirements.", volunteer: "https://atlantahumane.org/get-involved/volunteer/", signup: "https://atlantahumane.org/get-involved/volunteer/", signupLabel: "Choose a volunteer program", portal: "https://atlantahumane.volunteerportal.org", youth: "https://atlantahumane.org/get-involved/volunteer/community-service/", calendar: "https://atlantahumane.org/events/", website: "https://atlantahumane.org", note: "Applications, training and available shifts are managed by Atlanta Humane." },
  { id: "furkids", name: "Furkids Marietta", area: "Marietta", address: "1487 Roswell Road, Marietta, GA 30062", description: "Help at the Marietta thrift store, where proceeds support Furkids’ rescue work.", eligibility: "The thrift program welcomes youth volunteers. Confirm age, supervision and orientation requirements with Furkids before signing up.", volunteer: "https://furkids.org/thrift-store", signup: "https://furkids.volunteerhub.com/vv2/", signupLabel: "Find a Furkids shift", portal: "https://furkids.volunteerhub.com/vv2/", youth: "https://furkids.org/volunteer/youth-opportunities", calendar: "https://furkids.org/events", website: "https://furkids.org", note: "Marietta is a thrift-store opportunity. Hands-on dog care is at the Sutherlin Dog Shelter in Cumming." },
];
export type ShelterEvent = { shelter: string; title: string; start: string; end: string; time: string; location: string; kind: "Orientation" | "Community event" | "Dog adoption" | "Fundraiser" | "Vaccine clinic"; url: string };
const pawsCalendar = "https://www.pawsatlanta.org/events";
export const shelterEvents: ShelterEvent[] = [
  { shelter: "paws", title: "Fee-Waived Adoptions by Subaru", start: "2026-10-18", end: "2026-10-31", time: "Oct 18–31", location: "PAWS Atlanta · Decatur", kind: "Dog adoption", url: pawsCalendar },
  { shelter: "paws", title: "The Perfect Match: Choosing Your Ideal Dog", start: "2026-10-24", end: "2026-10-24", time: "11 a.m.–1 p.m.", location: "Check the PAWS event calendar for location", kind: "Community event", url: pawsCalendar },
  { shelter: "paws", title: "Volunteer Orientation", start: "2026-10-24", end: "2026-10-24", time: "11:30 a.m.–12:30 p.m.", location: "Check PAWS for orientation location", kind: "Orientation", url: pawsCalendar },
  { shelter: "paws", title: "Rescue Brew Release Party", start: "2026-10-24", end: "2026-10-24", time: "1–5 p.m.", location: "Fire Maker Brewery & Bar · Atlanta", kind: "Fundraiser", url: pawsCalendar },
  { shelter: "paws", title: "CompassionCon", start: "2026-10-25", end: "2026-10-25", time: "10 a.m.–2 p.m.", location: "Decatur Legacy Park · Decatur", kind: "Community event", url: pawsCalendar },
  { shelter: "paws", title: "Rescue Dog Games", start: "2026-10-31", end: "2026-10-31", time: "10 a.m.–3 p.m.", location: "Peachtree Corners Town Green", kind: "Community event", url: pawsCalendar },
  ...["2026-11-01", "2026-11-15", "2026-11-29"].map(date => ({ shelter: "paws", title: "Vaccine Clinic", start: date, end: date, time: "10 a.m.–noon", location: "PAWS Atlanta · Decatur", kind: "Vaccine clinic" as const, url: pawsCalendar })),
  { shelter: "ahs", title: "Adopt-o-ween Adoption Promotion", start: "2026-10-23", end: "2026-10-25", time: "Oct 23–25", location: "Atlanta Humane locations", kind: "Dog adoption", url: "https://atlantahumane.org/event/adopt-o-ween-adoption-promotion/" },
  { shelter: "ahs", title: "Dog Adoption Event in Roswell", start: "2026-10-24", end: "2026-10-24", time: "Noon–3 p.m.", location: "1010 Mansell Road · Roswell", kind: "Dog adoption", url: "https://atlantahumane.org/event/dog-adoption-event-in-roswell-11/" },
  { shelter: "ahs", title: "Dog Adoption Event in Roswell", start: "2026-10-31", end: "2026-10-31", time: "Noon–3 p.m.", location: "1010 Mansell Road · Roswell", kind: "Dog adoption", url: "https://atlantahumane.org/events/" },
  { shelter: "ahs", title: "Paint Your Pet", start: "2026-11-02", end: "2026-11-02", time: "6:30–8:30 p.m.", location: "Muchacho · Atlanta", kind: "Fundraiser", url: "https://atlantahumane.org/event/paint-your-pet-at-muchachos/" },
  { shelter: "furkids", title: "Halloween at Halcyon: Dog Adoption Event", start: "2026-10-24", end: "2026-10-24", time: "See organizer for time", location: "Halcyon · Forsyth County", kind: "Dog adoption", url: "https://furkids.org/events/modal/212092" },
  { shelter: "furkids", title: "Zombies, Booze, & Rescues", start: "2026-10-24", end: "2026-10-24", time: "See organizer for time and age restrictions", location: "See Furkids event listing", kind: "Fundraiser", url: "https://furkids.org/events/modal/213253" },
  { shelter: "furkids", title: "Adoption Event at Subaru", start: "2026-10-30", end: "2026-10-30", time: "See organizer for time", location: "See Furkids event listing", kind: "Dog adoption", url: "https://furkids.org/events/modal/213305" },
  { shelter: "furkids", title: "Dog Adoptions at Rescue Dog Games", start: "2026-10-31", end: "2026-10-31", time: "See organizer for time", location: "Peachtree Corners Town Green", kind: "Dog adoption", url: "https://furkids.org/events/modal/213252" },
  { shelter: "furkids", title: "Senior Dog Bingo", start: "2026-11-03", end: "2026-11-03", time: "6–7 p.m.", location: "5235 Union Hill Road · Cumming", kind: "Fundraiser", url: "https://furkids.org/tickets/senior-dog-bingo" },
];
export function currentEvents(shelter: string, today = new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date())) {
  return shelterEvents.filter(event => event.shelter === shelter && event.end >= today && event.start <= "2026-12-31").sort((a, b) => a.start.localeCompare(b.start));
}
export const casSource = "https://www.ibo.org/programmes/diploma-programme/curriculum/dp-core/creativity-activity-and-service/";
