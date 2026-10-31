import { Link } from "react-router-dom";
import PublicLayout from "@/components/PublicLayout";
import { shelterLocations } from "@/data/community";

export default function Partnerships() {
  return <PublicLayout><header className="page-intro"><h1>Our shelter community.</h1><p>We partner with Furkids on donations and share ways to help shelters across Atlanta.</p></header><div className="three-grid">{shelterLocations.map(s => <article key={s.id} className="surface info-card"><span className="eyebrow">{s.area}</span><h2>{s.name}</h2><a className="depth-button secondary" href={s.website} target="_blank" rel="noopener noreferrer">Visit shelter ↗</a></article>)}</div><section className="site-section surface inline-callout"><h3>Start a school supply drive.</h3><Link to="/contact" className="depth-button">Get in touch →</Link></section></PublicLayout>;
}
