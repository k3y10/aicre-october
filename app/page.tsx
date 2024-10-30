'use client';
import React, { useState, useEffect } from 'react';
import {
  BuildingIcon,
  ChecklistIcon,
  FileUpload,
  BarChartIcon,
  ContractIcon,
  SavingsIcon,
  Bell,
  PlusIcon,
  TimesIcon,
  BarsIcon,
  CogIcon,
  UserGearIcon,
  SignOutIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  Tools,
  Info,
  House,
  Shop,
  Mountain,
  Map,
  HomeIcon,
  Gauge, 
  Table
} from '@/components/icons';
import PropertyDetails from './properties/PropertyDetails';
import CommercialDetails from './properties/CommercialDetails';
import RecreationalDetails from './properties/RecreationalDetails';
import ResidentialDetails from './properties/ResidentialDetails';
import RetailDetails from './properties/RetailDetails';
import DataRoom from './data/data-room';
import NewsTable from '@/components/NewsTable';
import Image from 'next/image';
import Profile from '@/components/Profile';
import PortfolioSummary from '@/components/PortfolioSummary';
import AddressTable from '@/components/AddressTable';
import PropertyForm from '@/components/PropertyForm';
import DataVisual from '@/components/DataVisual';
import CapTable from './planning/CapTable';
import Forecaster from './planning/Forecaster';
import SREOTable from './planning/SREOTable';
import StressTester from './planning/StressTester';
import StockTicker from '@/components/StockTicker';
import Scenario from './planning/Scenario';
import HeatMap from './mapping/HeatMap';
import IdealMap from './mapping/IdealMap';
import AicreReport from './reporting/AicreReport';

type Address = {
  propertyName: string;
  type: string;
  address: string;
  noi: number;
  value: number;
  leverage: number;
  yieldRate: number;
  dscr: number;
  opportunity: string;
};

// Tools for the dashboard with updated icons
const tools = [
  { id: 1, name: 'PropertyDetails', label: 'Property 1', icon: BarChartIcon, active: true },
  { id: 2, name: 'CommercialDetails', label: 'Property 2', icon: BarChartIcon, active: true },
  { id: 3, name: 'RecreationalDetails', label: 'Property 3', icon: BarChartIcon, active: true },
  { id: 4, name: 'ResidentialDetails', label: 'Property 4', icon: BarChartIcon, active: true },
  { id: 5, name: 'RetailDetails', label: 'Property 5', icon: BarChartIcon, active: true },
  { id: 6, name: 'Forecaster', label: 'Forecaster', icon: BarChartIcon, active: true },
  { id: 7, name: 'CapTable', label: 'Cap Table', icon: BarChartIcon, active: true },
  { id: 8, name: 'SREOTable', label: 'SREO Table', icon: BarChartIcon, active: true },
  { id: 9, name: 'StressTester', label: 'Stress Tester', icon: BarChartIcon, active: true },
  { id: 10, name: 'Scenario', label: 'Scenario', icon: BarChartIcon, active: true },
  { id: 11, name: 'DataRoom', label: 'Data Room', icon: FileUpload, active: true },
  { id: 12, name: 'HeatMap', label: 'Heat Map', icon: FileUpload, active: true },
  { id: 13, name: 'IdealMap', label: 'Ideal Map', icon: FileUpload, active: true },
  { id: 14, name: 'AicreReport', label: 'Example', icon: FileUpload, active: true },

];

// Categories for filtering tools
const categories = {
  ALL: tools.map((tool) => tool.name),
  RESIDENTIAL: ['PropertyDetails'],
  COMMERCIAL: ['DataRoom'],
  FINANCE: ['NewsTable'],
};

const DashboardAiCRE: React.FC = () => {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [filteredTools, setFilteredTools] = useState<string[]>(categories.ALL);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isSubMenuOpen1, setIsSubMenuOpen1] = useState<boolean>(false); 
  const [isSubMenuOpen2, setIsSubMenuOpen2] = useState<boolean>(false);
  const [isSubMenuOpen3, setIsSubMenuOpen3] = useState<boolean>(false); 
  const [isSubMenuOpen4, setIsSubMenuOpen4] = useState<boolean>(false); 
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false); // State for toggling form visibility
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('property1'); // default property ID
  const [userId, setUserId] = useState<string | null>(null);
  const [propertyType, setPropertyType] = useState<string>('all'); // Default to 'all'
  
  const [addresses, setAddresses] = useState([
    {
      propertyName: 'Money Maker',
      type: 'Residential',
      address: '123 Main St, Anytown, USA',
      noi: 50000,
      value: 250000,
      leverage: 0.75,
      yieldRate: 0.05,
      dscr: 1.25,
      opportunity: 'High Growth',
    },
    {
      propertyName: 'Red Headed Child',
      type: 'Commercial',
      address: '456 Maple Ave, Springfield, USA',
      noi: 100000,
      value: 500000,
      leverage: 0.65,
      yieldRate: 0.08,
      dscr: 1.5,
      opportunity: 'Moderate Growth',
    },
  ]);

  // Toggle form visibility
  const toggleForm = () => {
    setIsFormOpen((prev) => !prev);
  };

  useEffect(() => {
    // Fetch data dynamically based on the selected property type
    const fetchAddresses = async () => {
      try {
        const response = await fetch(`/property_types/${propertyType}.json`);
        const data = await response.json();
        setAddresses(data); // Set the addresses from the fetched data
      } catch (error) {
        console.error('Error fetching addresses:', error);
      }
    };

    fetchAddresses();
  }, [propertyType]);

  const handleRemoveAddress = (index: number) => {
    setAddresses((prevAddresses) => prevAddresses.filter((_, i) => i !== index)); // Remove by index
  };

  // Add a new property to the address table
  const handleAddNewAddress = (newAddress: Address) => {
    setAddresses((prevAddresses) => [...prevAddresses, newAddress]);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Toggling specific submenus
  const toggleSubMenu1 = () => {
    setIsSubMenuOpen1(!isSubMenuOpen1);
  };

  const toggleSubMenu2 = () => {
    setIsSubMenuOpen2(!isSubMenuOpen2);
  };

  const toggleSubMenu3 = () => {
    setIsSubMenuOpen3(!isSubMenuOpen3);
  };

  const toggleSubMenu4 = () => {
    setIsSubMenuOpen4(!isSubMenuOpen4);
  };

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen); // Toggle the profile settings
  };

  const handleCloseProfile = () => {
    setIsSettingsOpen(false); // Close the profile modal
  };

  const handleToolClick = (toolName: string) => {
    setActiveTool(toolName);
    if (window.innerWidth < 768) setIsSidebarOpen(false); // Close sidebar on mobile
  };

  // Function to toggle the visibility of the form
  const toggleFormVisibility = () => {
    setIsFormVisible((prevState) => !prevState);
  };

   // Add the "Property Dash" button to the sidebar
   const handleGoToHome = () => {
    setActiveTool(null); // Reset active tool, so the home content is displayed
  };

  // Calculate Portfolio Summary
  const calculateSummary = () => {
    const totalValue = addresses.reduce((sum, property) => sum + property.value, 0);
    const totalNOI = addresses.reduce((sum, property) => sum + property.noi, 0);
    const avgLeverage =
      addresses.length > 0 ? addresses.reduce((sum, property) => sum + property.leverage, 0) / addresses.length : 0;
    const avgYieldRate =
      addresses.length > 0 ? addresses.reduce((sum, property) => sum + property.yieldRate, 0) / addresses.length : 0;
    const avgDSCR =
      addresses.length > 0 ? addresses.reduce((sum, property) => sum + property.dscr, 0) / addresses.length : 0;

    return { totalValue, totalNOI, avgLeverage, avgYieldRate, avgDSCR };
  };

  const { totalValue, totalNOI, avgLeverage, avgYieldRate, avgDSCR } = calculateSummary();
  const debt = totalValue * avgLeverage; // Example calculation for debt
  const equity = totalValue - debt; // Example calculation for equity
  
  const renderActiveTool = () => {
    const tool = tools.find((t) => t.name === activeTool);
    if (tool) {
      switch (tool.name) {
        case 'PropertyDetails':
          return <PropertyDetails selectedPropertyId={selectedPropertyId}/>;
        case 'CommercialDetails':
          return <CommercialDetails selectedPropertyId={selectedPropertyId}/>;
        case 'RecreationalDetails':
          return <RecreationalDetails selectedPropertyId={selectedPropertyId} />;
        case 'ResidentialDetails':
          return <ResidentialDetails selectedPropertyId={selectedPropertyId} />;
        case 'RetailDetails':
          return <RetailDetails selectedPropertyId={selectedPropertyId} />;
        case 'CapTable':
          return <CapTable />;
        case 'Forecaster':
          return <Forecaster />;
        case 'SREOTable':
          return <SREOTable />;
        case 'StressTester':
          return <StressTester />;
        case 'Scenario':
          return <Scenario />;
        case 'HeatMap':
          return <HeatMap />;
        case 'IdealMap':
          return <IdealMap />;
        case 'DataRoom':
          return <DataRoom />;
        case 'NewsTable':
          return <NewsTable newsType="regional" />;
        case 'AicreReport':
          return <AicreReport />;
        default:
          return renderToolGrid();
      }
    } else {
      return renderToolGrid();
    }
  };

  const renderToolGrid = () => (
    <div className="grid-container">
      {filteredTools.map((toolName) => {
        const tool = tools.find((t) => t.name === toolName);
        if (!tool) return null;

        return (
          <div
            key={tool.id}
            className={`grid-item ${tool.active ? '' : 'grayed-out'}`}
            onClick={() => tool.active && handleToolClick(tool.name)}
          >
            <div className="icon-placeholder">
              <tool.icon />
            </div>
            <p>{tool.label}</p>
          </div>
        );
      })}
    </div>
  );

  useEffect(() => {
    // Simulate fetching user ID from an API or auth context
    const fetchUserId = async () => {
      const fetchedUserId = '12345'; // Assume this comes from your API or auth service
      setUserId(fetchedUserId);
    };

    fetchUserId();
  }, []);

  if (!userId) {
    return <div>Loading user information...</div>;
  }

  return (
    <div className="dashboard-container">
      <button className="hamburger-button" onClick={toggleSidebar}>
        <BarsIcon />
      </button>

      {/* Sidebar with profile and navigation */}
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="logo">
           {/* Render Profile component conditionally */}
           <Profile />
          <div className="profile-container">
            {/* Avatar image (purely visual, no onClick action here) */}
            <Image src="/aicre-circle.png" alt="avatar" width={100} height={100} className="profile-image" />
          </div>
        </div>
        <nav className="nav-menu">  
          <ul>
            <li className="property-dash-button" onClick={handleGoToHome}>
              Portfoilio (home) 
            </li>
          </ul>
          <ul className="sub-menu-toggle" onClick={toggleSubMenu1}>
            <li>
              <HomeIcon /> Properties {isSubMenuOpen1 ? <ChevronUpIcon /> : <ChevronDownIcon />}
            </li>
          </ul>
          {isSubMenuOpen1 && (
            <ul className="sub-menu">
              <li onClick={() => handleToolClick('RetailDetails')}>
                <Shop /> Property 1
              </li>
              <li onClick={() => handleToolClick('PropertyDetails')}>
                <BuildingIcon /> Property 2
              </li>
              <li onClick={() => handleToolClick('ResidentialDetails')}>
                <House /> Property 3
              </li>
              <li onClick={() => handleToolClick('RecreationalDetails')}>
                <Mountain /> Property 4
              </li>
            </ul>
          )}
          <ul className="sub-menu-toggle" onClick={toggleSubMenu2}>
            <li>
              <Tools /> Property Tools {isSubMenuOpen2 ? <ChevronUpIcon /> : <ChevronDownIcon />}
            </li>
          </ul>
          {isSubMenuOpen2 && (
            <ul className="sub-menu">
              <li onClick={() => handleToolClick('Forecaster')}>
                <BuildingIcon /> Forecaster
              </li>
              <li onClick={() => handleToolClick('StressTester')}>
                <Gauge /> Stress Tester
              </li>
              <li onClick={() => handleToolClick('CapTable')}>
                <Table /> Cap Table
              </li>
              <li onClick={() => handleToolClick('SREOTable')}>
                <FileUpload /> SREO Forms
              </li>
              <li onClick={() => handleToolClick('DataRoom')}>
                <FileUpload /> Data Room
              </li>
            </ul>
          )}
          <ul className="sub-menu-toggle" onClick={toggleSubMenu3}>
            <li>
              <Map /> Mapping Tools {isSubMenuOpen3 ? <ChevronUpIcon /> : <ChevronDownIcon />}
            </li>
          </ul>
          {isSubMenuOpen3 && (
            <ul className="sub-menu">
              <li onClick={() => handleToolClick('HeatMap')}>
                <ChecklistIcon /> Basic Map
              </li>
              <li onClick={() => handleToolClick('IdealMap')}>
                <ChecklistIcon /> Ideal Map
              </li>
            </ul>
          )}
          <ul className="sub-menu-toggle" onClick={toggleSubMenu4}>
            <li>
              <ContractIcon /> Reporting {isSubMenuOpen4 ? <ChevronUpIcon /> : <ChevronDownIcon />}
            </li>
            {isSubMenuOpen4 && (
            <ul className="sub-menu">
              <li onClick={() => handleToolClick('AicreReport')}>
                <ChecklistIcon /> AiCRE Report
              </li>
            </ul>
          )}
          </ul>
          <ul>
            <li className="logout-button">
              <SignOutIcon /> Log Out
            </li>
          </ul>
        </nav>
      </div>

      <div className="main-content">
        {activeTool ? (
          <div className="tool-content">{renderActiveTool()}</div>
        ) : (
          <div className="home-content">
            <div className="header">
              <div className="portfolio-summary mt-4">
                <StockTicker />
                <PortfolioSummary
                  totalValue={totalValue}
                  totalNOI={totalNOI}
                  totalLeverage={avgLeverage}
                  totalYieldRate={avgYieldRate}
                  totalDSCR={avgDSCR}
                  leverageTrend={avgLeverage >= 0.65 ? 'up' : 'down'}
                  yieldRateTrend={avgYieldRate >= 0.07 ? 'up' : 'down'}
                  dscrTrend={avgDSCR >= 1.4 ? 'up' : 'down'}
                  equity={totalValue - debt}
                  debt={debt} 
                />
              </div>
              <div className="address-table">
                <AddressTable addresses={addresses} onRemove={handleRemoveAddress} />
              </div>
              <div className="news-section">
                <div className="news-grid">
                  {/* National News */}
                  <div className="news-card">
                    <NewsTable newsType="national" />
                  </div>
                  {/* Regional News */}
                  <div className="news-card">
                    <NewsTable newsType="regional" address="California" />
                  </div>
                  {/* Emerging Markets News */}
                  <div className="news-card">
                    <NewsTable newsType="emerging" />
                  </div>
                </div>
              </div>
              <div className="data-visual-container">
                <DataVisual addresses={addresses} />
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
      .dashboard-container {
        display: flex;
        height: 100vh;
        background-color: #f5f7fa;
        overflow: hidden;
      }

      .data-visual-container {
        width: 100%; /* Full width */
        display: flex;
        justify-content: center;
      }

      .portfolio-summary {
        width: 100%;
      }

      .address-table {
        width: 100%;
        justify-content: center;
        overflow-x: auto;
        max-height: 400px;
      }

      .form-container {
        width: 100%;
        display: flex;
        justify-content: center;
      }

      .toggle-form-button {
        margin-top: 55px;
        background-color: #5fd2d2;
        color: white;
        max-width: 250px;
        padding: 10px 15px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        margin-bottom: 10px;
        transition: background-color 0.3s ease;
      }

      .toggle-form-button:hover {
        background-color: #64e2e2;
      }

      .profile-container {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 20px;
      }

      .gear-icon {
        position: absolute;
        top: -10px;
        right: -10px;
        background-color: #fff;
        border: 2px solid #ddd;
        border-radius: 50%;
        padding: 6px;
        font-size: 20px;
        color: #555;
        cursor: pointer;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        transition: background-color 0.3s, transform 0.3s;
      }

      .gear-icon:hover {
        color: #5fd2d2;
        transform: scale(1.15);
      }

      .hamburger-button {
        position: fixed;
        top: 25px;
        left: 25px;
        z-index: 1002;
        background-color: transparent;
        border: none;
        color: #333;
        font-size: 26px;
        cursor: pointer;
        display: none;
      }

      .sidebar {
        width: 260px;
        background-color: #fff;
        padding: 20px;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        border-right: 1px solid #e1e1e1;
        overflow-y: auto;
        z-index: 1000;
        transition: all 0.3s ease;
      }

      .sidebar.open {
        left: 0;
      }

      .logo {
        margin-bottom: 40px;
      }

      .nav-menu ul {
        list-style: none;
        padding: 0;
        width: 100%;
        display: flex;
        flex-direction: column;
      }

      .nav-menu li {
        padding: 16px 22px;
        font-size: 17px;
        color: #666;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
        border-radius: 10px;
        transition: background-color 0.3s, color 0.3s;
      }

      .nav-menu li.active,
      .nav-menu li:hover {
        color: #5fd2d2;
        background-color: #f9f9f9;
        font-weight: bold;
      }

      .sub-menu-toggle {
        cursor: pointer;
        font-size: 16px;
        padding: 12px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .sub-menu {
        padding-left: 20px;
        margin-top: 5px;
      }

      .sub-menu li {
        padding: 10px;
        font-size: 15px;
        color: #555;
        cursor: pointer;
        border-radius: 6px;
        transition: background-color 0.3s, color 0.3s;
      }

      .sub-menu li:hover {
        color: #5fd2d2;
        background-color: #f3f3f3;
      }

      .main-content {
        flex: 1;
        padding: 30px;
        overflow-y: auto;
        background-color: #f5f7fa;
        transition: all 0.3s ease;
      }

      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        margin-bottom: 40px;
      }

      .address-management {
        display: flex;
        gap: 12px;
        width: 100%;
        max-width: 650px;
        margin-top: 25px;
      }

      .address-input {
        flex: 1;
        padding: 12px;
        border: 1px solid #ddd;
        border-radius: 10px;
      }

      .add-button {
        background-color: #007bff;
        color: white;
        padding: 12px 20px;
        border: none;
        border-radius: 10px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .saved-addresses {
        margin-top: 20px;
      }

      .saved-addresses ul {
        list-style: none;
        padding: 0;
      }

      .saved-addresses li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 0;
        border-bottom: 1px solid #ddd;
      }

      .remove-address {
        background-color: red;
        color: white;
        border: none;
        padding: 6px 10px;
        border-radius: 8px;
        cursor: pointer;
      }

      .filter-buttons {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
        width: 100%;
        margin-top: 5px;
      }

      .filter-button {
        background-color: #e9ecef;
        color: #444;
        padding: 12px 24px;
        border: none;
        border-radius: 10px;
        cursor: pointer;
        font-size: 15px;
        transition: background-color 0.3s, color 0.3s;
        flex: 1;
      }

      .filter-button.active,
      .filter-button:hover {
        background-color: #5fd2d2;
        color: white;
      }

      .grid-container {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 20px;
        width: 100%;
      }

      .grid-item {
        background-color: white;
        border: 1px solid #e0e0e0;
        border-radius: 12px;
        height: 160px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        cursor: pointer;
        transition: transform 0.3s, box-shadow 0.3s;
        position: relative;
      }

      .grid-item:hover {
        transform: translateY(-6px);
        box-shadow: 0 12px 18px rgba(0, 0, 0, 0.1);
      }

      .icon-placeholder {
        margin-bottom: 10px;
      }

      .grid-item p {
        font-size: 15px;
        color: #757575;
      }

      .news-section {
        width: 100%;
        margin-top: 30px;
      }

      .news-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
      }

      .news-card {
        background-color: #fff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
      }

      .news-card h4 {
        margin-bottom: 12px;
        font-size: 18px;
        color: #333;
      }

      @media (max-width: 1200px) {
        .grid-container {
          grid-template-columns: repeat(3, 1fr);
        }
      }

      @media (max-width: 1024px) {
        .grid-container {
          grid-template-columns: repeat(2, 1fr);
        }

        .news-grid {
          grid-template-columns: repeat(2, 1fr);
        }

        .sidebar {
          width: 220px;
        }
      }

      @media (max-width: 768px) {
        .news-grid {
          grid-template-columns: 1fr;
        }
        .grid-container {
          grid-template-columns: 1fr;
        }

        .hamburger-button {
          display: block;
        }

        .sidebar {
          width: 240px;
          position: fixed;
          top: 0;
          bottom: 0;
          left: -100%;
          transition: left 0.3s ease;
        }

        .sidebar.open {
          left: 0;
        }

        .main-content {
          padding: 20px 10px;
        }
      }

      @media (max-width: 480px) {
        .nav-menu ul {
          flex-wrap: wrap;
          justify-content: space-evenly;
        }

        .nav-menu li {
          flex: 1 0 100%;
          text-align: center;
          padding: 8px 0;
        }

        .sidebar {
          flex-direction: column;
          height: auto;
        }

        .header {
          flex-direction: column;
          align-items: flex-start;
        }

        .address-management {
          flex-direction: column;
          gap: 12px;
        }

        .saved-addresses ul {
          width: 100%;
        }
      }
    `}</style>
    </div>
  );
};

export default DashboardAiCRE;
