import React, { useState, useEffect } from 'react';
import { Disclosure } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import NextImage from 'next/image';
import Link from 'next/link';
import LogoImage from '@/public/api-idefi-ai.png';
import HeaderNavLink from './HeaderNavLink';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileCode, faFlaskVial, faBook, faShieldAlt, faCogs, faDatabase, faEye } from '@fortawesome/free-solid-svg-icons';

// Define menu items with icons and dropdowns for submenus
const menuItems = [
  { icon: <FontAwesomeIcon icon={faBook} />, label: 'Docs', url: '/docs' },
  { icon: <FontAwesomeIcon icon={faFileCode} />, label: 'Devs', url: '/devs' },
  {
    icon: <FontAwesomeIcon icon={faFlaskVial} />,
    label: 'Examples',
    children: [
      { icon: <FontAwesomeIcon icon={faCogs} />, label: 'Metrics', url: '/metrics' },
      { icon: <FontAwesomeIcon icon={faEye} />, label: 'Monitor', url: '/monitor' },
      { icon: <FontAwesomeIcon icon={faShieldAlt} />, label: 'Firewall', url: '/firewall' },
      { icon: <FontAwesomeIcon icon={faDatabase} />, label: 'Contracts', url: '/smartscan' },
      { icon: <FontAwesomeIcon icon={faShieldAlt} />, label: 'DustCheck', url: '/undust' },
      { icon: <FontAwesomeIcon icon={faEye} />, label: 'TxMapping', url: '/txmap' },
      { icon: <FontAwesomeIcon icon={faEye} />, label: 'Visualizing', url: '/visualize' },
    ],
  },
  { icon: null, label: 'Log out', url: '/' }, // Log out doesn't need an icon
];

const NavMenu: React.FC<NavMenuProps> = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Function to auto-collapse the dropdown menu after selection
  const handleLinkClick = () => {
    const activeDisclosure = document.querySelector('[aria-expanded="true"]');
    if (activeDisclosure) {
      (activeDisclosure as HTMLElement).click();
    }
  };

  return (
    <Disclosure as="nav" className={`bg-white shadow ${isScrolled ? 'sticky-header' : ''}`}>
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex px-2 lg:px-0">
                <div className="flex flex-shrink-0 items-center">
                  <Link href="/docs">
                    <NextImage
                      className="h-8 w-auto"
                      src={LogoImage}
                      alt=""
                      width={210}
                      height={125}
                    />
                  </Link>
                </div>
              </div>
              <div className="flex flex-1 items-center justify-center px-2 lg:ml-6 lg:justify-end">
                <div className="hidden lg:flex lg:space-x-8">
                  {menuItems.map((item) =>
                    item.children ? (
                      <div className="relative" key={item.label}>
                        <Disclosure>
                          {({ open }) => (
                            <>
                              <Disclosure.Button className="inline-flex items-center space-x-1 text-gray-700 hover:text-lightlaven">
                                {item.icon && <span>{item.icon}</span>}
                                <span className="text-sm font-medium">{item.label}</span>
                                <ChevronDownIcon className={`h-5 w-5 transform ${open ? 'rotate-180' : 'rotate-0'}`} />
                              </Disclosure.Button>
                              <Disclosure.Panel className="absolute mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                                <div className="py-1">
                                  {item.children.map((subItem) => (
                                    <Link href={subItem.url} key={subItem.label}>
                                      <div
                                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-lightlaven"
                                        onClick={handleLinkClick}
                                      >
                                        {subItem.icon && <span>{subItem.icon}</span>}
                                        <span>{subItem.label}</span>
                                      </div>
                                    </Link>
                                  ))}
                                </div>
                              </Disclosure.Panel>
                            </>
                          )}
                        </Disclosure>
                      </div>
                    ) : (
                      <HeaderNavLink href={item.url} key={item.label}>
                        <div className="flex items-center space-x-1">
                          {item.icon && <span>{item.icon}</span>}
                          <span>{item.label}</span>
                        </div>
                      </HeaderNavLink>
                    )
                  )}
                </div>
              </div>
              <div className="flex items-center lg:hidden">
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-lightlaven">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex ml-4 lg:flex lg:items-center"></div>
            </div>
          </div>

          <Disclosure.Panel className="lg:hidden">
            <div className="flex flex-col items-center space-y-2 py-3">
              {menuItems.map((item) => (
                item.children ? (
                  <Disclosure key={item.label} as="div">
                    {({ open }) => (
                      <>
                        <Disclosure.Button className="flex w-full items-center justify-between px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-lightlaven">
                          <span className="text-sm font-medium">{item.icon} {item.label}</span>
                          <ChevronDownIcon className={`h-5 w-5 transform ${open ? 'rotate-180' : 'rotate-0'}`} />
                        </Disclosure.Button>
                        <Disclosure.Panel className="space-y-1">
                          {item.children.map((subItem) => (
                            <Link href={subItem.url} key={subItem.label}>
                              <div
                                className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-lightlaven"
                                onClick={handleLinkClick}
                              >
                                {subItem.icon && <span>{subItem.icon}</span>}
                                <span>{subItem.label}</span>
                              </div>
                            </Link>
                          ))}
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                ) : (
                  <Link href={item.url} key={item.label}>
                    <div className="flex items-center space-x-2 block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-lightlaven">
                      {item.icon && <span>{item.icon}</span>}
                      <span>{item.label}</span>
                    </div>
                  </Link>
                )
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

interface NavMenuProps {}

export default NavMenu;
