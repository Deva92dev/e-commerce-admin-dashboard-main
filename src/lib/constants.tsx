import {
  CreditCard,
  HandCoins,
  LayoutDashboard,
  Package,
  Shapes,
  ShoppingBag,
  Tag,
  UserRound,
} from 'lucide-react';

// for dashboard
export const navLinks = [
  {
    url: '/admin',
    icon: <LayoutDashboard />,
    label: 'Dashboard',
  },
  {
    url: '/admin/collections',
    icon: <Shapes />,
    label: 'Collections',
  },
  {
    url: '/admin/products',
    icon: <Tag />,
    label: 'Products',
  },
  {
    url: '/admin/orders',
    icon: <ShoppingBag />,
    label: 'Orders',
  },
  {
    url: '/admin/customers',
    icon: <UserRound />,
    label: 'Customers',
  },
];

// for website
export const navbarLinks = [
  {
    url: '/',
    label: 'Home',
  },
  {
    url: '/products',
    label: 'Products',
  },
  {
    url: '/contact',
    label: 'Contact-Us',
  },
];

// services links
export const servicesLinks = [
  {
    icon: <Package />,
    label: 'Free Shipping Method',
    details:
      'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Animi est quibusdam vitae reprehenderit harum nisi ad sit dolorem quos excepturi.',
  },
  {
    icon: <CreditCard />,
    label: 'Secure Payment System',
    details:
      'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Animi est quibusdam vitae reprehenderit harum nisi ad sit dolorem quos excepturi.',
  },
  {
    icon: <HandCoins />,
    label: 'Cash On Delivery',
    details:
      'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Animi est quibusdam vitae reprehenderit harum nisi ad sit dolorem quos excepturi.',
  },
];

// footer links
export const footerImportantLinks = [
  {
    url: '/about',
    label: 'About Us',
  },
  {
    url: '/contact',
    label: 'Contact Us',
  },
  {
    url: '/track-order',
    label: 'Track Your Order',
  },
];

export const footerGeneralLinks = [
  {
    url: '/privacy-policy',
    label: 'Privacy-Policy',
  },
  {
    url: '/returns',
    label: 'Returns and Shipping Policy',
  },
  {
    url: '/terms-conditions',
    label: 'Terms & Conditions',
  },
];

export const footerSocialLinks = [
  {
    url: '/about',
    label: 'About Us',
  },
  {
    url: '/contact',
    label: 'Contact Us',
  },
  {
    url: '/track-order',
    label: 'Track Your Order',
  },
];
