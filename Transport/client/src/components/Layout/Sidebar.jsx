import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Truck, Users, Map, Droplet, Wrench, DollarSign, Bell, FileText, Settings } from 'lucide-react';

const Sidebar = ({ role }) => {
  const location = useLocation();

  const adminLinks = [
    { label: 'Dashboard', icon: Home, path: '/' },
    { label: 'Vehicles', icon: Truck, path: '/vehicles' },
    { label: 'Drivers', icon: Users, path: '/drivers' },
    { label: 'Trips', icon: Map, path: '/trips' },
    { label: 'Fuel Logs', icon: Droplet, path: '/fuel' },
    { label: 'Maintenance', icon: Wrench, path: '/maintenance' },
    { label: 'Expenses', icon: DollarSign, path: '/expenses' },
    { label: 'Alerts', icon: Bell, path: '/alerts' },
    { label: 'Reports', icon: FileText, path: '/reports' },
    { label: 'Settings', icon: Settings, path: '/settings' },
  ];

  const driverLinks = [
    { label: 'Dashboard', icon: Home, path: '/driver' },
    { label: 'My Trips', icon: Map, path: '/driver/trips' },
    { label: 'Log Fuel', icon: Droplet, path: '/driver/fuel' },
    { label: 'Expenses', icon: DollarSign, path: '/driver/expenses' },
    { label: 'Profile', icon: Users, path: '/driver/profile' },
  ];

  const links = role === 'admin' ? adminLinks : driverLinks;

  return (
    <div className="w-64 bg-sidebar text-white flex flex-col h-full shadow-lg">
      <div className="p-6 text-2xl font-bold border-b border-gray-700 flex items-center gap-2">
        <Truck className="text-accent" />
        <span>FleetOS</span>
      </div>
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-primary text-white' : 'hover:bg-gray-800 text-gray-300'}`}
            >
              <Icon size={20} />
              <span className="font-medium">{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
