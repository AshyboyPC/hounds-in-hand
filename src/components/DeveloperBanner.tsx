import { useState } from "react";
import { ExternalLink } from "lucide-react";

const DeveloperBanner = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="w-full bg-white border-t border-gray-200 overflow-hidden">
      <div 
        className={`max-w-7xl mx-auto transition-all duration-500 ease-in-out ${
          isExpanded ? 'py-8' : 'py-4'
        }`}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        {/* Collapsed State */}
        <div 
          className={`transition-all duration-500 ${
            isExpanded ? 'opacity-0 h-0' : 'opacity-100 h-auto'
          }`}
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-sm text-gray-600 px-4">
            <span className="font-medium">Developed by</span>
            <a
              href="https://locagenieai.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              <span>Ashwindh Ramesh</span>
              <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
            <span className="hidden sm:inline text-gray-400">•</span>
            <span className="text-gray-500">© 2025</span>
          </div>
        </div>

        {/* Expanded State */}
        <div 
          className={`transition-all duration-500 ${
            isExpanded ? 'opacity-100' : 'opacity-0 absolute pointer-events-none'
          }`}
        >
          <div className="flex flex-col items-center justify-center gap-4 px-4">
            <div className="flex items-center gap-3">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary"></div>
              <h3 className="text-lg font-bold text-primary heading-font">
                Crafted by Ashwindh Ramesh
              </h3>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-primary"></div>
            </div>
            
            <p className="text-sm text-gray-600 max-w-2xl text-center body-font">
              Full-stack developer passionate about creating impactful solutions. 
              Explore more innovative projects and AI-powered applications.
            </p>
            
            <div className="flex gap-3">
              <a
                href="https://locagenieai.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-primary to-blue-600 text-white rounded-full font-semibold text-sm hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                <span>View Portfolio</span>
                <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
              
              <a
                href="https://locagenieai.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2.5 border-2 border-primary text-primary rounded-full font-semibold text-sm hover:bg-primary hover:text-white transition-all duration-300"
              >
                <span>More Projects</span>
              </a>
            </div>
            
            <p className="text-xs text-gray-400 mt-2">© 2025 • Built with ❤️ for Connect 4 Paws</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeveloperBanner;
