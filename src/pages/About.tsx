import { Link } from "react-router-dom";
import PublicLayout from "@/components/PublicLayout";

export default function About() {
  return <PublicLayout>
    <header className="page-intro"><h1>Our story.</h1><p>Students helping Atlanta’s shelter dogs.</p></header>
    <section className="surface founder-story">
      <div className="founder-aside"><span className="initial-avatar" aria-hidden="true">AM</span><h2>Anand Mehta</h2><p>Founder & project lead<br />Co-developer</p><span className="pill soft">Help-a-Hound Club vice president</span></div>
      <div className="story-copy"><h3>Why I started Connect 4 Paws</h3><p>I started Connect 4 Paws to bring our Help-a-Hound Club’s work to more people. After visiting Atlanta Humane Society, I wanted to make it easier for our community to help shelter dogs.</p><p>I lead the project and work with Furkids on donation efforts.</p><Link className="depth-button" to="/donate">Our donations →</Link></div>
    </section>
    <section className="site-section surface inline-callout"><div><span className="eyebrow">Website developer</span><h2>Ashwindh Ramesh</h2></div><Link to="/contact" className="depth-button secondary">Meet the team →</Link></section>
  </PublicLayout>;
}
