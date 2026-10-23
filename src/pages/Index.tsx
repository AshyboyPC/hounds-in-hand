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
  <section className="home-drive surface"><div><h2>Our community drive.</h2><div className="drive-total"><strong>${campaign.raised}</strong><span>of ${campaign.goal} raised</span></div><div className="drive-track" aria-hidden="true"><span style={{width:`${campaign.raised/campaign.goal*100}%`}} /></div><p>Help us reach our ${campaign.goal} goal for local dogs.</p><Link to="/donate" className="depth-button">See our progress →</Link></div><img className="supply-art" src="/images/donation-box.avif" alt="Illustrated box of dog supplies" width="440" height="440" loading="lazy" /><div className="home-drive-list"><h3>On our wishlist</h3><ul><li>Milkbones · 10 lb box</li><li>Large, heavy-duty dog leash</li><li>Rope toys</li><li>Water and food bowls</li><li>Rescue Disinfectant</li></ul><Link to="/supply-wishlist" className="text-link">View donation details →</Link></div></section>
  <section className="home-updates"><div><span className="pill">Coming soon</span><h2>New faces. New stories.</h2><p>We’re preparing dog photos, adoption details, and shelter stories.</p></div><div className="action-row"><Link to="/adopt" className="text-link">Adoption updates →</Link><Link to="/stories" className="text-link">Shelter stories →</Link></div></section>
</PublicLayout>; }
