import PublicLayout from "@/components/PublicLayout";
import { donationLinks, wishlist } from "@/data/community";

export default function SupplyWishlist() {
  return <PublicLayout>
    <header className="page-intro">
      <h1>A little goes a long way.</h1>
      <p>Everyday essentials for shelter dogs.</p>
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

    <section className="site-section surface wishlist-delivery">
      <div><h2>Where to send it</h2><p>Atlanta Humane Society’s drop-off locations and accepted supplies.</p></div>
      <a className="depth-button" href={donationLinks.supplies} target="_blank" rel="noopener noreferrer">Drop-off details <span aria-hidden="true">↗</span></a>
    </section>
  </PublicLayout>;
}
