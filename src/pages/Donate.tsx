import { Link } from "react-router-dom";
import PublicLayout from "@/components/PublicLayout";
import FundraisingGoal from "@/components/FundraisingGoal";
import { donationLinks } from "@/data/community";

export default function Donate() {
  return <PublicLayout>
    <header className="page-intro"><h1>Give a little love.</h1><p>Help local dogs through Furkids and Atlanta Humane Society.</p></header>
    <section className="surface goal-panel"><FundraisingGoal /></section>
    <section className="site-section two-grid" id="donation-options">
      <article className="surface donation-card"><span className="card-kicker">Give funds</span><h2>Furkids</h2><p>Our partner in helping local dogs.</p><a className="depth-button rose" href={donationLinks.furkids} target="_blank" rel="noopener noreferrer">Donate to Furkids ↗</a></article>
      <article className="surface donation-card"><span className="card-kicker">Give supplies</span><h2>Atlanta Humane Society</h2><p>Food, toys, and everyday essentials.</p><a className="depth-button" href={donationLinks.supplies} target="_blank" rel="noopener noreferrer">Supply drop-off ↗</a></article>
    </section>
    <section className="surface inline-callout"><h3>Something from the wishlist?</h3><Link to="/supply-wishlist" className="depth-button secondary">Shop the wishlist →</Link></section>
  </PublicLayout>;
}
