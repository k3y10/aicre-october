import React from 'react';
import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome';
import { 
  faBuilding,  // Replacing for real estate focus
  faHome,  // Added for residential properties
  faCity,  // Added for urban development
  faLandmark,  // Added for notable buildings
  faFileContract, 
  faPiggyBank, 
  faClipboardList,
  faDollarSign,  // Replacing with dollar for commercial transactions
  faChartBar,  // Replacing chart line with a bar chart for financial analysis
  faKey, 
  faUsers,  // Replacing user tie with community/residential focus
  faGavel,  // Replacing hammer with legal aspect
  faFileSignature,  // Contract focus
  faMapSigns,  // Added for property direction/navigation
  faRulerCombined,  // Added for property measurements
  faWarehouse,  // Added for commercial buildings
  faHandsHelping,  // Replacing heart with assistance in property management
  faMedal,   // Added for commercial agent recognition
  faTriangleExclamation,
  faRobot,
  faIdCard,
  faBell,
  faInfoCircle,
  faChevronDown,
  faChevronUp,
  faFileUpload,
  faFileMedical,
  faHammer, 
  faHelmetSafety,
  faMagnifyingGlassChart,
  faListCheck,
  faEye,
  faUserTie,
  faPlus,
  faTimes, 
  faBars, 
  faCog, 
  faUserGear, 
  faSignOutAlt,
  faArrowUp,
  faArrowDown, 
  faTools,
  faHouse,
  faMountain,
  faShop,
  faMapLocationDot
} from '@fortawesome/free-solid-svg-icons';

interface IconProps extends Omit<FontAwesomeIconProps, 'icon'> {}

export const BuildingIcon: React.FC<IconProps> = (props) => (
  <FontAwesomeIcon icon={faBuilding} {...props} />  // General building/real estate icon
);

export const HomeIcon: React.FC<IconProps> = (props) => (
  <FontAwesomeIcon icon={faHome} {...props} />  // Residential real estate
);

export const CityIcon: React.FC<IconProps> = (props) => (
  <FontAwesomeIcon icon={faCity} {...props} />  // Urban development/real estate
);

export const LandmarkIcon: React.FC<IconProps> = (props) => (
  <FontAwesomeIcon icon={faLandmark} {...props} />  // Notable commercial properties
);

export const ContractIcon: React.FC<IconProps> = (props) => (
  <FontAwesomeIcon icon={faFileContract} {...props} />
);

export const SavingsIcon: React.FC<IconProps> = (props) => (
  <FontAwesomeIcon icon={faPiggyBank} {...props} />
);

export const ChecklistIcon: React.FC<IconProps> = (props) => (
  <FontAwesomeIcon icon={faClipboardList} {...props} />
);

export const DollarIcon: React.FC<IconProps> = (props) => (
  <FontAwesomeIcon icon={faDollarSign} {...props} />  // Dollar sign for transactions
);

export const BarChartIcon: React.FC<IconProps> = (props) => (
  <FontAwesomeIcon icon={faChartBar} {...props} />  // Financial chart
);

export const KeyIcon: React.FC<IconProps> = (props) => (
  <FontAwesomeIcon icon={faKey} {...props} />  // Property ownership/transfer
);

export const UsersIcon: React.FC<IconProps> = (props) => (
  <FontAwesomeIcon icon={faUsers} {...props} />  // Community/residential focus
);

export const GavelIcon: React.FC<IconProps> = (props) => (
  <FontAwesomeIcon icon={faGavel} {...props} />  // Legal aspect in real estate
);

export const SignatureIcon: React.FC<IconProps> = (props) => (
  <FontAwesomeIcon icon={faFileSignature} {...props} />  // Signing contracts
);

export const MapIcon: React.FC<IconProps> = (props) => (
  <FontAwesomeIcon icon={faMapSigns} {...props} />  // Directions or mapping
);

export const RulerIcon: React.FC<IconProps> = (props) => (
  <FontAwesomeIcon icon={faRulerCombined} {...props} />  // Property measurements
);

export const WarehouseIcon: React.FC<IconProps> = (props) => (
  <FontAwesomeIcon icon={faWarehouse} {...props} />  // Commercial building icon
);

export const HelpingIcon: React.FC<IconProps> = (props) => (
  <FontAwesomeIcon icon={faHandsHelping} {...props} />  // Property management/help
);

export const MedalIcon: React.FC<IconProps> = (props) => (
  <FontAwesomeIcon icon={faMedal} {...props} />  // Agent recognition
);

// Keeping the rest unchanged
export const Alert: React.FC<IconProps> = (props) => (
  <FontAwesomeIcon icon={faTriangleExclamation} {...props} />
);

export const Robot: React.FC<IconProps> = (props) => (
  <FontAwesomeIcon icon={faRobot} {...props} />
);

export const IdCard: React.FC<IconProps> = (props) => (
  <FontAwesomeIcon icon={faIdCard} {...props} />
);

export const Bell: React.FC<IconProps> = (props) => (
  <FontAwesomeIcon icon={faBell} {...props} />
);

export const Info: React.FC<IconProps> = (props) => (
  <FontAwesomeIcon icon={faInfoCircle} {...props} />
);

export const ChevronDownIcon: React.FC<IconProps> = (props) => (
  <FontAwesomeIcon icon={faChevronDown} {...props} />
);

export const ChevronUpIcon: React.FC<IconProps> = (props) => (
  <FontAwesomeIcon icon={faChevronUp} {...props} />
);

export const FileUpload: React.FC<IconProps> = (props) => (
  <FontAwesomeIcon icon={faFileUpload} {...props} />
);

export const Heal: React.FC<IconProps> = (props) => (
  <FontAwesomeIcon icon={faFileMedical} {...props} />
);

export const Build: React.FC<IconProps> = (props) => (
  <FontAwesomeIcon icon={faHammer} {...props} />
);

export const Scout: React.FC<IconProps> = (props) => (
  <FontAwesomeIcon icon={faMagnifyingGlassChart} {...props} />
);

export const Mine: React.FC<IconProps> = (props) => (
  <FontAwesomeIcon icon={faHelmetSafety} {...props} />
);

export const CheckList: React.FC<IconProps> = (props) => (
  <FontAwesomeIcon icon={faListCheck} {...props} />
);

export const Eye: React.FC<IconProps> = (props) => (
  <FontAwesomeIcon icon={faEye} {...props} />
);

export const AgentIcon: React.FC<IconProps> = (props) => (
  <FontAwesomeIcon icon={faUserTie} {...props} />
);

export const PlusIcon: React.FC<IconProps> = (props) => 
<FontAwesomeIcon icon={faPlus} {...props} />;

export const TimesIcon: React.FC<IconProps> = (props) => 
<FontAwesomeIcon icon={faTimes} {...props} />;

export const BarsIcon: React.FC<IconProps> = (props) => 
<FontAwesomeIcon icon={faBars} {...props} />;

export const CogIcon: React.FC<IconProps> = (props) => 
<FontAwesomeIcon icon={faCog} {...props} />;

export const UserGearIcon: React.FC<IconProps> = (props) => 
<FontAwesomeIcon icon={faUserGear} {...props} />;

export const SignOutIcon: React.FC<IconProps> = (props) => 
<FontAwesomeIcon icon={faSignOutAlt} {...props} />;

export const ArrowUpIcon: React.FC<IconProps> = (props) => 
<FontAwesomeIcon icon={faArrowUp} {...props} />;

export const ArrowDownIcon: React.FC<IconProps> = (props) => 
<FontAwesomeIcon icon={faArrowDown} {...props} />;

export const Tools: React.FC<IconProps> = (props) => 
<FontAwesomeIcon icon={faTools} {...props} />;

export const House: React.FC<IconProps> = (props) => 
<FontAwesomeIcon icon={faHouse} {...props} />;

export const Shop: React.FC<IconProps> = (props) => 
<FontAwesomeIcon icon={faShop} {...props} />;

export const Mountain: React.FC<IconProps> = (props) => 
<FontAwesomeIcon icon={faMountain} {...props} />;

export const Map: React.FC<IconProps> = (props) => 
<FontAwesomeIcon icon={faMapLocationDot} {...props} />;

