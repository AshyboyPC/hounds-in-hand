import { campaign, reviewedOn } from "@/data/community";
export default function FundraisingGoal() {
  const percent = Math.round(campaign.raised / campaign.goal * 100);
  return <div className="goal-layout"><div className="goal-ring" role="progressbar" aria-label="Community fundraising goal" aria-valuemin={0} aria-valuemax={campaign.goal} aria-valuenow={campaign.raised} aria-valuetext={`$${campaign.raised} raised of $${campaign.goal}`} style={{ background: `conic-gradient(#397bca ${percent}%, #e7edf4 0)` }}><div><strong>${campaign.raised}</strong><span>of ${campaign.goal} goal</span></div></div><div><h2>Our community fundraising goal.</h2><p>We’ve raised ${campaign.raised} toward our ${campaign.goal} goal. There’s ${campaign.goal - campaign.raised} left to go.</p><small>Club-reported total · {reviewedOn}</small><p className="source-note">Donations on shelter websites do not automatically update this total.</p></div></div>;
}
