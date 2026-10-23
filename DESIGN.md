# Connect 4 Paws design refinement

## Brief
Keep the existing React/Vite site and its familiar blue identity, original Connecting Shelters with Loving Communities headline and four shortcut structure. Audience: Atlanta students, dog supporters and prospective volunteers. Purpose: useful routes to real shelter programs, the five-item drive and official donation destinations. No invented adoption profiles, metrics, event capacities or endorsements. Dogs only in commissioned illustrations.

## Concepts considered
1. Community noticeboard: pastel paper cards for local programs. Anchor: school club organizing real Atlanta service. Signature: cards lift and settle when pressed; emotion welcoming. Screenshot: dog hero and four shortcuts. Originality 4 / fit 5 / feasibility 5 / portability 3.
2. Atlanta trail: connected local stops, map-led navigation. Anchor: three named organizations. Signature: route drawing. Emotion discovery. Screenshot: location directory. Scores 4/4/3/3.
3. Donation parcel: all UI modeled on packed supply boxes. Anchor: five requested drive items. Signature: unfolding containers. Emotion practical generosity. Screenshot: illustrated drive. Scores 4/4/3/3.
Choose 1 because it refines the actual original layout. Borrow only the real supply-box image from 3. Avoid generic repeated eyebrow labels, fabricated quotes, bento clutter, fake social proof and repeated navbar artwork.

## Concept card
Idea: A welcoming school community noticeboard for helping Atlanta dogs.
Metaphor: Tactile paper cards with clear actions.
Signature: A 3px lower edge lifts on hover and compresses on press.
Emotion: Friendly, trustworthy and easy to use.
Motion verb: Lift, then settle.
Screenshot: Original blue headline alongside warm hand-painted dogs.

## System
Ground #fffdf9; ink #283e50; blue #2974bf; sky #eef5fc; honey #f6ce68; rose #e9677d. Soft green and lilac only for the original four shortcut categories. Goldplay headings and existing Poppins text; no new font dependencies. 1200px content width, 28px desktop gutters, 14px mobile. 26px section radii, 15px buttons. Motion 180ms, transform and shadow only. Still at rest by choice: dogs and public information need no ambient animation. No WebGL, glossy material, neon glow or custom cursor. Lenis now provides gentle wheel easing across all routes, driven by the GSAP ticker. Touch scrolling stays native; reduced-motion preferences disable the controller. Same-page section links ease into position and move keyboard focus to their destination. New pages reset to the top without carrying old scroll momentum. Preserve reduced motion and visible focus. Route focus and titles handled in PublicLayout.

Home composition: split hero → four familiar shortcut cards → wide donation drive with original illustration → compact adoption/story status.
Donate: brief intro → circular goal → two official destination cards → wishlist link.
Volunteer: intro → month selector → three sourced shelter schedules and signups → CAS guidance and provided ranking.
Wishlist: five-item list → practical donation guidance.
Other pages: clear single-purpose layouts with the same lower-edge depth.

## Content evidence
Campaign and volunteer hours are user-supplied club totals, not third-party audited metrics. Published event sources checked October 23, 2026. Only remaining 2026 events are shown; unavailable December dates are not invented. Public events and volunteer shifts have separate registrations. Furkids Marietta is the thrift-store program; direct dog-care location is Cumming. Donation links leave for the actual shelter sites. Adoption and stories are explicitly coming soon.
