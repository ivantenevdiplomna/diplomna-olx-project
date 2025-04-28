export const categories = {
  vehicles: {
    name: 'Vehicles',
    subcategories: [
      { value: 'cars', label: 'Cars' },
      { value: 'motorcycles', label: 'Motorcycles' },
      { value: 'scooters', label: 'Scooters' },
      { value: 'commercial', label: 'Commercial Vehicles' },
      { value: 'spare-parts', label: 'Spare Parts' }
    ]
  },
  property: {
    name: 'Property',
    subcategories: [
      { value: 'houses', label: 'Houses' },
      { value: 'apartments', label: 'Apartments' },
      { value: 'land', label: 'Land' },
      { value: 'commercial', label: 'Commercial Property' }
    ]
  },
  electronics: {
    name: 'Electronics',
    subcategories: [
      { value: 'mobile-phones', label: 'Mobile Phones' },
      { value: 'laptops', label: 'Laptops' },
      { value: 'desktops', label: 'Desktops' },
      { value: 'cameras', label: 'Cameras' },
      { value: 'tv', label: 'TVs' },
      { value: 'audio', label: 'Audio Devices' }
    ]
  },
  fashion: {
    name: 'Fashion',
    subcategories: [
      { value: 'mens-clothing', label: "Men's Clothing" },
      { value: 'womens-clothing', label: "Women's Clothing" },
      { value: 'kids-clothing', label: "Kids' Clothing" },
      { value: 'accessories', label: 'Accessories' }
    ]
  },
  home: {
    name: 'Home & Living',
    subcategories: [
      { value: 'furniture', label: 'Furniture' },
      { value: 'home-decor', label: 'Home Decor' },
      { value: 'kitchen', label: 'Kitchen & Dining' },
      { value: 'bedding', label: 'Bedding & Bath' },
      { value: 'tools', label: 'Tools & DIY' }
    ]
  },
  jobs: {
    name: 'Jobs',
    subcategories: [
      { value: 'full-time', label: 'Full-time Jobs' },
      { value: 'part-time', label: 'Part-time Jobs' },
      { value: 'remote', label: 'Work from Home' },
      { value: 'internships', label: 'Internships' },
      { value: 'freelance', label: 'Freelance' }
    ]
  },
  services: {
    name: 'Services',
    subcategories: [
      { value: 'education', label: 'Education & Classes' },
      { value: 'transport', label: 'Drivers & Taxi' },
      { value: 'beauty', label: 'Health & Beauty' },
      { value: 'repair', label: 'Home & Office Repair' },
      { value: 'moving', label: 'Moving & Storage' }
    ]
  }
};

export const getMainCategories = () => {
  return Object.keys(categories).map(key => ({
    value: key,
    label: categories[key].name
  }));
};

export const getSubcategories = (mainCategory) => {
  if (!mainCategory || !categories[mainCategory]) return [];
  return categories[mainCategory].subcategories;
}; 