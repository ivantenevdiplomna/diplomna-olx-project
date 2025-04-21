export const categories = {
  mobile: {
    name: 'Mobile Phones',
    subcategories: [
      { value: 'smartphone', label: 'Smartphones' },
      { value: 'feature-phone', label: 'Feature Phones' },
      { value: 'tablet', label: 'Tablets' },
      { value: 'accessories', label: 'Accessories' }
    ]
  },
  vehicles: {
    name: 'Vehicles',
    subcategories: [
      { value: 'car', label: 'Cars' },
      { value: 'bike', label: 'Bikes' },
      { value: 'scooter', label: 'Scooters' },
      { value: 'commercial', label: 'Commercial Vehicles' },
      { value: 'spare-parts', label: 'Spare Parts' }
    ]
  },
  property: {
    name: 'Property',
    subcategories: [
      { value: 'house', label: 'Houses' },
      { value: 'apartment', label: 'Apartments' },
      { value: 'land', label: 'Land' },
      { value: 'commercial', label: 'Commercial Property' }
    ]
  },
  electronics: {
    name: 'Electronics',
    subcategories: [
      { value: 'laptop', label: 'Laptops' },
      { value: 'desktop', label: 'Desktops' },
      { value: 'camera', label: 'Cameras' },
      { value: 'tv', label: 'TVs' },
      { value: 'audio', label: 'Audio Devices' }
    ]
  },
  fashion: {
    name: 'Fashion',
    subcategories: [
      { value: 'men', label: "Men's Fashion" },
      { value: 'women', label: "Women's Fashion" },
      { value: 'kids', label: "Kids' Fashion" },
      { value: 'accessories', label: 'Accessories' }
    ]
  },
  home: {
    name: 'Home & Living',
    subcategories: [
      'Furniture',
      'Home Decor & Garden',
      'Kitchen & Dining',
      'Bedding & Bath',
      'Tools & DIY',
      'Other Home Items'
    ]
  },
  jobs: {
    name: 'Jobs',
    subcategories: [
      'Full-time Jobs',
      'Part-time Jobs',
      'Work from Home',
      'Internships',
      'Freelance',
      'Other Jobs'
    ]
  },
  services: {
    name: 'Services',
    subcategories: [
      'Education & Classes',
      'Drivers & Taxi',
      'Health & Beauty',
      'Home & Office Repair',
      'Moving & Storage',
      'Other Services'
    ]
  },
  furniture: {
    name: 'Furniture',
    subcategories: [
      { value: 'sofa', label: 'Sofas' },
      { value: 'bed', label: 'Beds' },
      { value: 'dining', label: 'Dining Sets' },
      { value: 'office', label: 'Office Furniture' }
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
  return categories[mainCategory].subcategories.map(subcategory => ({
    value: subcategory.value,
    label: subcategory.label
  }));
}; 