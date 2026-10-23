import { Link } from "react-router-dom";
import PublicLayout from "@/components/PublicLayout";
export default function NotFound(){return <PublicLayout><section className="surface coming-soon"><span className="pill">404</span><h1>This page wandered off.</h1><p>Let’s get you back to Connect 4 Paws.</p><Link className="depth-button" to="/">Back to home →</Link></section></PublicLayout>;}
