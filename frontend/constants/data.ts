import { Droplet, Hammer, Zap, Wrench, Home } from 'lucide-react-native';
import React from 'react';

export const OFFERS = [
  {
    id: '1',
    title: 'Summer Special',
    description: '20% Off All Services',
    bgColor: 'bg-blue-100'
  },
  {
    id: '2',
    title: 'First-Time User',
    description: 'Get $50 Credit',
    bgColor: 'bg-green-100'
  }
];

export const SERVICES = [
  { 
    id: '1', 
    name: 'Plumbing', 
    icon: React.createElement(Droplet, { color: "#2563EB", size: 32 }),
    route: '/services/plumbing'
  },
  { 
    id: '2', 
    name: 'Electrical', 
    icon: React.createElement(Zap, { color: "#DC2626", size: 32 }),
    route: '/services/electrical'
  },
  { 
    id: '3', 
    name: 'Carpentry', 
    icon: React.createElement(Hammer, { color: "#16A34A", size: 32 }),
    route: '/services/carpentry'
  },
  { 
    id: '4', 
    name: 'Handyman', 
    icon: React.createElement(Wrench, { color: "#7C3AED", size: 32 }),
    route: '/services/general'
  }
];

export const CONSULTATION_TOPICS = [
  {
    id: '1',
    title: 'Home Repairs',
    icon: React.createElement(Home, { color: "#2563EB", size: 24 }),
    issues: [
      'Wall Cracks',
      'Roof Leaks',
      'Foundation Issues'
    ]
  },
  {
    id: '2',
    title: 'Plumbing Problems',
    icon: React.createElement(Droplet, { color: "#16A34A", size: 24 }),
    issues: [
      'Pipe Leaks',
      'Drain Clogs',
      'Water Pressure'
    ]
  },
  {
    id: '3',
    title: 'Electrical Concerns',
    icon: React.createElement(Zap, { color: "#DC2626", size: 24 }),
    issues: [
      'Outlet Troubles',
      'Wiring Issues',
      'Circuit Breaker'
    ]
  }
];