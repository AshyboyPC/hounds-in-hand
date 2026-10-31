import { Link } from "react-router-dom";
import PublicLayout from "./PublicLayout";

export default function ComingSoon({kind}:{kind:"adopt"|"stories"}) {
  const adopt = kind === "adopt";
  return <PublicLayout><section className="surface coming-soon"><span className="pill">Coming soon</span><h1>{adopt ? "Meet your next best friend." : "Stories from the shelter."}</h1><p>New dog photos and {adopt ? "adoption listings" : "stories"} are on the way.</p><div className="action-row"><Link to="/volunteer" className="depth-button">Volunteer →</Link><Link to="/contact" className="depth-button secondary">Contact us</Link></div></section>{adopt && <section className="site-section"><div className="section-heading"><h2>Find a dog today.</h2></div><div className="three-grid">{[{name:"PAWS Atlanta",url:"https://www.pawsatlanta.org/adopt/dogs"},{name:"Atlanta Humane Society",url:"https://atlantahumane.org/adopt/dogs/"},{name:"Furkids",url:"https://furkids.org/dog-adoptions/"}].map(s => <a className="surface shelter-shortcut" key={s.name} href={s.url} target="_blank" rel="noopener noreferrer"><h3>{s.name}</h3><span className="text-link">Meet the dogs ↗</span></a>)}</div></section>}</PublicLayout>;
}
