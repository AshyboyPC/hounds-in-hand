import { campaign } from "@/data/community";

export default function FundraisingGoal() {
  const progress = Math.min(campaign.raised, campaign.goal);
  const percent = Math.round(progress / campaign.goal * 100);
  const raised = campaign.raised.toLocaleString("en-US");
  const facilitated = campaign.facilitated.toLocaleString("en-US");
  const goalReached = campaign.raised >= campaign.goal;

  return <div className="goal-layout"><div className="goal-ring" role="progressbar" aria-label="Community fundraising goal" aria-valuemin={0} aria-valuemax={campaign.goal} aria-valuenow={progress} aria-valuetext={`$${raised} raised; original $${campaign.goal} goal${goalReached ? " surpassed" : ""}`} style={{ background: `conic-gradient(#397bca ${percent}%, #e7edf4 0)` }}><div><strong>${raised}</strong><span>of ${campaign.goal} goal</span></div></div><div><h2>{goalReached ? "Our community goal, surpassed." : "Our community fundraising goal."}</h2><p>{goalReached ? `We’ve raised $${raised}, surpassing our original $${campaign.goal} goal.` : `We’ve raised $${raised} toward our $${campaign.goal} goal. There’s $${campaign.goal - campaign.raised} left to go.`}</p><p>We’ve also facilitated ${facilitated} in donations.</p><small>Club-reported totals · {campaign.updatedOn}</small><p className="source-note">Donations on shelter websites do not automatically update these totals.</p></div></div>;
}
