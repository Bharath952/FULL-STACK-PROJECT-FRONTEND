export const propertyTypes = ['Apartment', 'Independent House', 'Villa', 'Builder Floor'];
export const propertyConditions = ['New', 'Good', 'Needs Renovation', 'Old'];

export const mockProperties = [
  {
    id: 1,
    location: 'Indiranagar, Bangalore',
    type: 'Apartment',
    budget: '₹1.2 Cr',
    area: '1200 sqft',
    condition: 'Good',
    estimatedValue: 12500000,
    addedOn: '2025-10-12',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 2,
    location: 'Andheri West, Mumbai',
    type: 'Independent House',
    budget: '₹3.5 Cr',
    area: '2500 sqft',
    condition: 'Needs Renovation',
    estimatedValue: 32000000,
    addedOn: '2025-11-05',
    image: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
  }
];

export const mockRecommendations = [
  {
    id: 1,
    title: 'Modular Kitchen Upgrade',
    description: 'Install a modern modular kitchen with built-in appliances and smart storage.',
    costEstimate: '₹2,50,000',
    valueIncreasePct: 15,
    priority: 'High',
    category: 'Interior',
    iconType: 'kitchen'
  },
  {
    id: 2,
    title: 'Premium Wall Painting & Texture',
    description: 'Repaint with high-quality weather-resistant paint and add accent textures.',
    costEstimate: '₹80,000',
    valueIncreasePct: 8,
    priority: 'Medium',
    category: 'Renovation',
    iconType: 'paint'
  },
  {
    id: 3,
    title: 'Smart Home Automation',
    description: 'Add smart locks, lighting, and security cameras for premium appeal.',
    costEstimate: '₹1,20,000',
    valueIncreasePct: 5,
    priority: 'Low',
    category: 'Tech',
    iconType: 'tech'
  },
  {
    id: 4,
    title: 'Bathroom Remodel',
    description: 'Upgrade fixtures, add glass partitions, and install premium anti-skid tiles.',
    costEstimate: '₹1,50,000',
    valueIncreasePct: 12,
    priority: 'High',
    category: 'Interior',
    iconType: 'bath'
  }
];

export const mockStats = {
  totalProperties: 2,
  potentialValueIncrease: '₹42,50,000',
  averageROI: '212%',
  pendingRecommendations: 4
};
