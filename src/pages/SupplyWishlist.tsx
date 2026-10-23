import PublicLayout from "@/components/PublicLayout";
import { donationLinks, wishlist } from "@/data/community";

export default function SupplyWishlist() {
  return <PublicLayout>
    <header className="page-intro">
      <h1>Our supply wishlist.</h1>
      <p>Five ways to help local dogs. Choose an item, then check the shelter’s donation instructions before sending it.</p>
    </header>
    <ul className="wishlist-products" aria-label="Supply wishlist">
      {wishlist.map(item => <li className={`surface wishlist-product product-${item.image}`} key={item.name}>
        <div className="wishlist-product-art">
          <img src={`/images/wishlist/${item.image}.avif`} alt="" width="320" height="260" loading="lazy" decoding="async" />
        </div>
        <div className="wishlist-product-copy">
          <h2>{item.name}</h2>
          <p>{item.detail}</p>
          <a className="depth-button secondary" href={item.amazon} target="_blank" rel="noopener noreferrer" aria-label={`${item.shoppingLabel}: ${item.name}`}>
            {item.shoppingLabel} <span aria-hidden="true">↗</span>
          </a>
        </div>
      </li>)}
    </ul>
    <p className="wishlist-shopping-note">Illustrations show the item types. “Find on Amazon” opens matching search results; select the right size and quantity.</p>
    <section className="site-section surface wishlist-delivery">
      <div><h2>Ready to donate?</h2><p>Check accepted items and drop-off details with the receiving shelter. For Rescue Disinfectant, confirm the formula and container size before buying.</p></div>
      <a className="depth-button" href={donationLinks.supplies} target="_blank" rel="noopener noreferrer">Donation instructions <span aria-hidden="true">↗</span></a>
    </section>
  </PublicLayout>;
}
