'use client'

import React, { useState, useEffect } from 'react';
import {
  HomeIcon,
  BuildingIcon,
  Tools,
  ContractIcon,
  Bell,
  CogIcon,
  SignOutIcon,
  BarsIcon,
  Map,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@/components/icons';
import InterestRateTicker from '@/components/features/RateTicker';
import PortfolioSummary from '@/components/features/PortfolioSummary';
import DataRoom from './data/data-room';
import PropertyTable from '@/components/tables/PropertyTable';
import MapBoxSearch from '@/components/mapping/MapBoxSearch';
import NewsTable from '@/components/tables/NewsTable';
import PropertyDetails from './properties/PropertyDetails';
import HeatMap from './mapping/HeatMap';

interface Property {
  id: string;
  propertyName: string;
  address: string;
  noiYTD: number;
  cashYTD: number;
  netCashFlowThisMonth: number;
  vacancy: number;
  value: number;
  leverage: number;
  yieldRate: number;
  dscr: number;
  opportunity: string;
  tenants: Tenant[];
}

interface Tenant {
  id: string;
  propertyName: string;
  termEnd?: string;
  notes?: string;
}

const DashboardV2: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  useEffect(() => {
    const initialSidebarState = typeof window !== 'undefined' && window.innerWidth >= 1024;
    setIsSidebarOpen(initialSidebarState);

    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Load property data from JSON files in the public directory
  useEffect(() => {
    const loadProperties = async () => {
      try {
        const propertyPaths = [
          '/property_types/brickyardplaza.json',
          '/property_types/portolaplaza.json',
        ];

        const propertyPromises = propertyPaths.map((path) =>
          fetch(path).then((response) => response.json())
        );

        const propertiesData = await Promise.all(propertyPromises);
        setProperties(propertiesData);
      } catch (error) {
        console.error('Failed to load property data:', error);
      }
    };

    loadProperties();
  }, []);

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  // Implementing the missing functions
  const handleSubMenuToggle = (menu: string) => {
    setOpenSubMenu((prev) => (prev === menu ? null : menu));
  };

  const handlePropertyClick = (propertyId: string) => {
    const property = properties.find((p) => p.id === propertyId);
    if (property) {
      setSelectedProperty(property);
      setActiveSection('property-details');
    }
  };

  const handleAddAddress = (address: string) => {
    setSelectedAddress(address);
    console.log(`Address added: ${address}`);
  };

  const handleBackToOverview = () => {
    setSelectedProperty(null);
    setActiveSection('overview');
  };

  return (
    <div className="dashboard-layout">
      <header className="header">
        <div className="header-content">
          <button className="hamburger-button" onClick={toggleSidebar}>
            <BarsIcon />
          </button>
          <h2 className="logo-text">AiCRE Dashboard</h2>
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="logo-container">
          <h2 className="logo-text">AiCRE Dashboard</h2>
        </div>
        <nav className="nav-menu">
          <ul>
            <li
              className={activeSection === 'overview' ? 'active' : ''}
              onClick={() => handleSectionChange('overview')}
            >
              <HomeIcon /> Overview
            </li>
            <li
              className={`has-sub-menu ${openSubMenu === 'properties' ? 'open' : ''}`}
              onClick={() => handleSubMenuToggle('properties')}
            >
              <BuildingIcon /> Properties
              {openSubMenu === 'properties' ? (
                <ChevronUpIcon className="arrow-icon" />
              ) : (
                <ChevronDownIcon className="arrow-icon" />
              )}
              {openSubMenu === 'properties' && (
                <ul className="sub-menu">
                  <li onClick={() => handleSectionChange('brickyardplaza')}>Brickyard Plaza</li>
                  <li onClick={() => handleSectionChange('portolaplaza')}>Portola Plaza</li>
                </ul>
              )}
            </li>
            <li
              className={`has-sub-menu ${openSubMenu === 'mapping' ? 'open' : ''}`}
              onClick={() => handleSubMenuToggle('mapping')}
            >
              <Map /> Mapping
              {openSubMenu === 'mapping' ? (
                <ChevronUpIcon className="arrow-icon" />
              ) : (
                <ChevronDownIcon className="arrow-icon" />
              )}
              {openSubMenu === 'mapping' && (
                <ul className="sub-menu">
                  <li onClick={() => handleSectionChange('map-overview')}>Map Overview</li>
                  <li onClick={() => handleSectionChange('map-locations')}>Saved Locations</li>
                </ul>
              )}
            </li>
            <li
              className={`has-sub-menu ${openSubMenu === 'tasktools' ? 'open' : ''}`}
              onClick={() => handleSubMenuToggle('tasktools')}
            >
              <Tools /> Tooling
              {openSubMenu === 'tasktools' ? (
                <ChevronUpIcon className="arrow-icon" />
              ) : (
                <ChevronDownIcon className="arrow-icon" />
              )}
              {openSubMenu === 'tasktools' && (
                <ul className="sub-menu">
                  <li onClick={() => handleSectionChange('brickyardplaza')}>Brickyard Plaza</li>
                  <li onClick={() => handleSectionChange('portolaplaza')}>Portola Plaza</li>
                </ul>
              )}
            </li>
            <li
              className={`has-sub-menu ${openSubMenu === 'reporting' ? 'open' : ''}`}
              onClick={() => handleSubMenuToggle('reporting')}
            >
              <ContractIcon /> Reporting
              {openSubMenu === 'reporting' ? (
                <ChevronUpIcon className="arrow-icon" />
              ) : (
                <ChevronDownIcon className="arrow-icon" />
              )}
              {openSubMenu === 'reporting' && (
                <ul className="sub-menu">
                  <li onClick={() => handleSectionChange('financial-reports')}>Financial Reports</li>
                  <li onClick={() => handleSectionChange('analytics')}>Analytics</li>
                </ul>
              )}
            </li>
            <li
              className={activeSection === 'notifications' ? 'active' : ''}
              onClick={() => handleSectionChange('notifications')}
            >
              <Bell /> Notifications
            </li>
            <li
              className={activeSection === 'settings' ? 'active' : ''}
              onClick={() => handleSectionChange('settings')}
            >
              <CogIcon /> Settings
            </li>
            <li className="logout-button">
              <SignOutIcon /> Log Out
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className={`main-content ${isSidebarOpen ? '' : 'shifted'}`}>
        {/* Interest Rate Ticker */}
        <div className="ticker-section">
          <InterestRateTicker />
        </div>

        {activeSection === 'overview' && (
          <>
            {/* Responsive Layout for PortfolioSummary and DataRoom */}
            <div className="responsive-container">
              <div className="responsive-column">
                <PortfolioSummary />
              </div>
              <div className="responsive-column">
                <DataRoom />
              </div>
            </div>

            {/* Full-width PropertyTable */}
            <div className="full-width-container mb-10">
              <PropertyTable onPropertyClick={handlePropertyClick} />
            </div>
          </>
        )}

        {/* NewsTable and MapBoxSearch Side by Side */}
        <div className="responsive-container">
          <div className="responsive-column">
            <NewsTable newsType="national" />
            <NewsTable newsType="regional" />
            <NewsTable newsType="emerging" />
          </div>
          <div className="responsive-column">
            <MapBoxSearch onAddAddress={handleAddAddress} />
          </div>
        </div>

        {/* Display selected address */}
        {selectedAddress && (
          <div className="selected-address">
            <p>Selected Address: {selectedAddress}</p>
          </div>
        )}

      {activeSection === 'property-details' && selectedProperty && (
                <div className="property-details-section">
                  <button className="back-button" onClick={handleBackToOverview}>
                    Back to Overview
                  </button>
                  <PropertyDetails property={selectedProperty} />
                </div>
              )}
      </main>

      {/* Styling */}
      <style jsx>{`
        .dashboard-layout {
          display: flex;
          height: 100vh;
          overflow: hidden;
          position: relative;
        }

        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 20px;
          background-color: #1f2937;
          color: #000;
          position: fixed;
          width: 100%;
          z-index: 1100;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
        }

        .header-content {
          display: flex;
          align-items: center;
        }

        .hamburger-button {
          background-color: transparent;
          border: none;
          font-size: 28px;
          cursor: pointer;
          color: #60a5fa;
          margin-right: 10px;
        }

        .logo-text {
          font-size: 24px;
          font-weight: bold;
          color: #60a5fa;
          margin: 0;
        }

        .sidebar {
          background-color: #1f2937;
          color: #ffffff;
          padding: 20px;
          display: flex;
          flex-direction: column;
          border-right: 2px solid #3b82f6;
          width: 260px;
          height: 100vh;
          transition: transform 0.3s ease-in-out;
          position: fixed;
          top: 0;
          left: 0;
          z-index: 1000;
          box-shadow: 2px 0 10px rgba(0, 0, 0, 0.15);
        }

        .sidebar.closed {
          transform: translateX(-260px);
        }

        .sidebar.open {
          transform: translateX(0);
        }

        .logo-container {
          margin-bottom: 20px;
          text-align: center;
        }

        .nav-menu ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .nav-menu li {
          padding: 10px;
          font-size: 16px;
          display: flex;
          align-items: center;
          cursor: pointer;
          border-radius: 8px;
          margin-bottom: 50px;
          transition: background 0.3s, color 0.3s;
        }

        .nav-menu li.active {
          background-color: #3b82f6;
          color: #ffffff;
        }

        .nav-menu li:hover {
          background-color: #334155;
          color: #60a5fa;
        }

        .nav-menu li svg {
          margin-right: 10px;
        }

        .arrow-icon {
          width: 16px;
          height: 16px;
        }

        .has-sub-menu {
          position: relative;
        }

        .sub-menu {
          position: absolute;
          top: 100%;
          left: 0;
          background-color: #1f2937;
          width: 100%;
          z-index: 1;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          border-radius: 4px;
        }

        .sub-menu li {
          padding: 8px 10px;
          font-size: 14px;
          cursor: pointer;
          color: #b0c4de;
          transition: color 0.2s;
          margin-bottom: 10px;
        }

        .sub-menu li:hover {
          color: #ffffff;
          background-color: #334155;
        }

        .logout-button {
          margin-top: auto;
          padding: 12px;
          background-color: #ef4444;
          color: #ffffff;
          cursor: pointer;
          border-radius: 8px;
          text-align: center;
          transition: background 0.3s;
        }

        .logout-button:hover {
          background-color: #b91c1c;
        }

        .main-content {
          flex: 1;
          padding: 30px;
          margin-left: 260px;
          overflow-y: auto;
          background-color: #ffffff;
          transition: margin-left 0.3s ease-in-out;
        }

        .main-content.shifted {
          margin-left: 0;
        }

        .ticker-section {
          margin-top: 50px;
        }

        .responsive-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }

        .responsive-column {
          background-color: #ffffff;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .full-width-container {
          margin-top: 20px;
          background-color: #ffffff;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .selected-address {
          margin-top: 20px;
          padding: 10px;
          background-color: #e5f6ff;
          border: 1px solid #60a5fa;
          border-radius: 8px;
        }

        @media (max-width: 768px) {
          .main-content {
            padding: 20px;
          }

          .responsive-column,
          .full-width-container {
            padding: 15px;
          }

          .logo-text {
            font-size: 20px;
          }
        }

        @media (max-width: 480px) {
          .responsive-column,
          .full-width-container {
            padding: 10px;
          }

          .main-content {
            padding: 15px;
          }

          .nav-menu li {
            font-size: 14px;
          }

          .logo-text {
            font-size: 18px;
          }
        }
      `}</style>
    </div>
  );
};

export default DashboardV2;
