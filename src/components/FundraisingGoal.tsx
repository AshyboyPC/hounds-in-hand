import { campaign } from "@/data/community";

export default function FundraisingGoal() {
  return <div className="fundraising-summary" aria-label="Community donations">
    <div className="fundraising-stat"><strong>${campaign.raised.toLocaleString("en-US")}</strong><span>Raised for local dogs</span></div>
    <div className="fundraising-stat"><strong>${campaign.facilitated.toLocaleString("en-US")}</strong><span>In donations facilitated</span></div>
  </div>;
}
