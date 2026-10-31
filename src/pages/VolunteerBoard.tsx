import { useState } from "react";
import PublicLayout from "@/components/PublicLayout";
import { casSource, currentEvents, leaders, shelters } from "@/data/community";

const eventDate = (date: string) => new Date(date + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" });

export default function VolunteerBoard() {
  const [month, setMonth] = useState("all");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  return <PublicLayout>
    <header className="page-intro"><h1>Give your time.</h1><p>Find your next day with the dogs.</p></header>
    <div className="volunteer-toolbar"><strong>Events & shifts</strong><label>Month<select value={month} onChange={e => setMonth(e.target.value)}><option value="all">All dates</option><option value="10">October</option><option value="11">November</option><option value="12">December</option></select></label></div>
    <nav className="shelter-jumps" aria-label="Jump to a shelter">{shelters.map(s => <a href={"#" + s.id} key={s.id}>{s.name} ↓</a>)}<a href="#cas">IB CAS ↓</a><a href="#volunteers">Top volunteers ↓</a></nav>
    <div className="shelter-list">{shelters.map(shelter => {
      const events = currentEvents(shelter.id).filter(e => month === "all" || e.start.slice(5, 7) === month || e.end.slice(5, 7) === month);
      return <section className="surface shelter-block" key={shelter.id} id={shelter.id}>
        <div className="shelter-heading"><div><span className="eyebrow">{shelter.area}</span><h2>{shelter.name}</h2><p>{shelter.description}</p></div><a className="depth-button" href={shelter.signup} target="_blank" rel="noopener noreferrer">Sign up ↗</a></div>
        <div className="shelter-detail-grid"><div>
          <details className="volunteer-details"><summary>Age & training</summary><p>{shelter.eligibility}</p><a className="text-link" href={shelter.youth} target="_blank" rel="noopener noreferrer">Youth volunteering ↗</a></details>
          <details className="volunteer-details"><summary>About the shifts</summary><p>{shelter.note}</p><a className="text-link" href={shelter.volunteer} target="_blank" rel="noopener noreferrer">Volunteer program ↗</a></details>
          <a className="depth-button secondary" href={shelter.portal} target="_blank" rel="noopener noreferrer">Volunteer login ↗</a>
        </div><div className="shelter-events"><div className="event-list-title"><h3>Coming up</h3><a className="text-link" href={shelter.calendar} target="_blank" rel="noopener noreferrer">Calendar ↗</a></div>
          {events.length ? events.slice(0, expanded[shelter.id] ? events.length : 3).map(event => <article className="event-row" key={event.title + event.start}><div className="date-chip"><span>{eventDate(event.start).split(" ")[0]}</span><strong>{eventDate(event.start).split(" ")[1]}</strong></div><div className="event-copy"><h4>{event.title}</h4><p>{event.time} ET · {event.location}</p><a href={event.url} target="_blank" rel="noopener noreferrer">View event ↗</a></div></article>) : <div className="quiet-panel"><p>Looking for more dates?</p><a className="text-link" href={shelter.calendar} target="_blank" rel="noopener noreferrer">Check the calendar ↗</a></div>}
          {events.length > 3 && <button type="button" className="depth-button secondary event-toggle" aria-expanded={!!expanded[shelter.id]} onClick={() => setExpanded(previous => ({ ...previous, [shelter.id]: !previous[shelter.id] }))}>{expanded[shelter.id] ? "Show less" : "More events"} <span aria-hidden="true">{expanded[shelter.id] ? "−" : "+"}</span></button>}
        </div></div>
      </section>;
    })}</div>
    <section className="site-section cas-section" id="cas"><div className="section-heading"><h2>IB CAS service.</h2><a href={casSource} className="text-link" target="_blank" rel="noopener noreferrer">CAS guide ↗</a></div><div className="two-grid"><article className="surface info-card"><h3>Make it part of your CAS.</h3><p>Plan a shelter shift or supply drive with your CAS coordinator.</p><div className="cas-labels"><span>Plan your service</span><span>Log your time</span><span>Save your reflections</span></div><a className="depth-button secondary" href={casSource} target="_blank" rel="noopener noreferrer">Plan your CAS ↗</a></article><aside className="surface leaderboard" id="volunteers"><h3>Top volunteers</h3><ol>{leaders.map((person, index) => <li key={person.name}><span className="rank-number">{index + 1}</span><span className="leader-name">{person.name}</span><strong>{person.hours}<small>hours</small></strong></li>)}</ol></aside></div></section>
  </PublicLayout>;
}
