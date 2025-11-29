import React from 'react';
import MapComponent from '../components/MapComponent';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FadeIn, ScaleIn, StaggerContainer, StaggerItem } from "@/components/animations";
import PageTransition from "@/components/PageTransition";

const MapPage: React.FC = () => {
  return (
    <PageTransition className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <FadeIn direction="up">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Interactive Map
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Search for any location worldwide and explore with our interactive map powered by OpenStreetMap.
              </p>
            </div>
          </FadeIn>

          <ScaleIn delay={0.2}>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <MapComponent 
                height="600px"
                className="w-full"
              />
            </div>
          </ScaleIn>

          <StaggerContainer staggerDelay={0.15} className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <StaggerItem>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="w-3 h-3 bg-blue-600 rounded-full mr-3"></div>
                  <h3 className="text-lg font-semibold text-gray-900">Search Anywhere</h3>
                </div>
                <p className="text-gray-600">
                  Use the search bar to find any location worldwide. Our map uses real OpenStreetMap data.
                </p>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                  <h3 className="text-lg font-semibold text-gray-900">Real Data</h3>
                </div>
                <p className="text-gray-600">
                  All map data comes from OpenStreetMap contributors, ensuring accurate and up-to-date information.
                </p>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <h3 className="text-lg font-semibold text-gray-900">Free & Open</h3>
                </div>
                <p className="text-gray-600">
                  No API keys required. This map uses completely free and open-source mapping services.
                </p>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </main>

      <Footer />
    </PageTransition>
  );
};

export default MapPage;
