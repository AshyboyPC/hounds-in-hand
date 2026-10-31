import { Link } from "react-router-dom";
import PublicLayout from "@/components/PublicLayout";
import { campaign } from "@/data/community";
const shortcuts = [
  {label:"Volunteer", detail:"Give your time", path:"/volunteer"},
  {label:"Supply wishlist", detail:"Give what’s needed", path:"/supply-wishlist"},
  {label:"Shelter map", detail:"Find local shelters", path:"/map"},
  {label:"Our story", detail:"Meet the team", path:"/about"},
];
export default function Index() { return <PublicLayout>
  <section className="home-hero surface"><div className="hero-copy"><h1>Connecting shelters<br />with <em>loving communities.</em></h1><p>Help dogs in our Atlanta community through volunteering, supplies, and donations.</p><div className="action-row"><Link to="/volunteer" className="depth-button sunshine">Volunteer</Link><Link to="/donate" className="depth-button rose">Donate</Link></div></div><div className="hero-art"><img src="/images/community-dog.avif" alt="Illustration of two friendly dogs sitting beside a blue bowl" width="620" height="520" fetchPriority="high" /></div></section>
  <nav className="home-shortcuts" aria-label="Explore Connect 4 Paws">{shortcuts.map((item,index)=><Link key={item.path} to={item.path} className={"shortcut shortcut-"+index}><div><strong>{item.label}</strong><span>{item.detail}</span></div><span className="shortcut-arrow" aria-hidden="true">↗</span></Link>)}</nav>
  <section className="home-drive surface"><div><span className="eyebrow">Together, we’ve raised</span><div className="drive-total"><strong>${campaign.raised.toLocaleString("en-US")}</strong></div><p>For local shelter dogs.</p><Link to="/donate" className="depth-button rose">Donate →</Link></div><img className="supply-art" src="/images/donation-box.avif" alt="Illustrated box of dog supplies" width="440" height="440" loading="lazy" /><div className="home-drive-list"><h3>Treats, toys<br />& essentials.</h3><p>Pick something for a shelter dog.</p><Link to="/supply-wishlist" className="depth-button secondary">Shop the wishlist →</Link></div></section>
  <section className="home-updates"><div><span className="pill">Coming soon</span><h2>New faces. New stories.</h2><p>Dog photos and shelter stories are on the way.</p></div><div className="action-row"><Link to="/adopt" className="text-link">Adopt →</Link><Link to="/stories" className="text-link">Stories →</Link></div></section>
</PublicLayout>; }
