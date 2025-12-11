import { ExternalLink, Mail, Phone } from "lucide-react";

const DeveloperBanner = () => {
  return (
    <div className="w-full bg-gradient-to-r from-blue-600 to-blue-700 border-t border-blue-800">
      <div className="max-w-7xl mx-auto py-3 px-4">
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-white/90">
          <span className="font-medium">Developed by Ashwindh Ramesh</span>
          
          <span className="hidden sm:inline text-white/40">|</span>
          
          <a
            href="https://locagenieai.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-white hover:text-blue-200 transition-colors font-medium"
          >
            <span>View My Other Projects</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          
          <span className="hidden sm:inline text-white/40">|</span>
          
          <div className="flex items-center gap-3">
            <span className="font-medium">Contact:</span>
            <a
              href="mailto:ashwindh.ramesh2325@gmail.com"
              className="inline-flex items-center gap-1.5 text-white hover:text-blue-200 transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>ashwindh.ramesh2325@gmail.com</span>
            </a>
            <span className="text-white/40">•</span>
            <a
              href="tel:+14709262583"
              className="inline-flex items-center gap-1.5 text-white hover:text-blue-200 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>+1 (470) 926-2583</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeveloperBanner;
