import {
  LayoutDashboard,
  Package,
  Shapes,
  Shield,
  ShoppingBag,
  Tag,
  Truck,
  UserRound,
} from "lucide-react";

// for dashboard
export const navLinks = [
  {
    url: "/admin",
    icon: <LayoutDashboard />,
    label: "Dashboard",
  },
  {
    url: "/admin/collections",
    icon: <Shapes />,
    label: "Collections",
  },
  {
    url: "/admin/products",
    icon: <Tag />,
    label: "Products",
  },
  {
    url: "/admin/order",
    icon: <ShoppingBag />,
    label: "Order",
  },
  {
    url: "/admin/customers",
    icon: <UserRound />,
    label: "Customer",
  },
];

// for website
export const navbarLinks = [
  {
    url: "/",
    label: "Home",
  },
  {
    url: "/products",
    label: "Products",
  },
  {
    url: "/collections",
    label: "Collections",
  },
  {
    url: "/contact",
    label: "Contact-Us",
  },
];

// services links
export const servicesLinks = [
  {
    icon: <Truck />,
    label: "Free Shipping Method",
    details:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Animi est quibusdam vitae reprehenderit harum nisi ad sit dolorem quos excepturi.",
  },
  {
    icon: <Shield />,
    label: "Secure Payment System",
    details:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Animi est quibusdam vitae reprehenderit harum nisi ad sit dolorem quos excepturi.",
  },
  {
    icon: <Package />,
    label: "Cash On Delivery",
    details:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Animi est quibusdam vitae reprehenderit harum nisi ad sit dolorem quos excepturi.",
  },
];

// footer links
export const footerImportantLinks = [
  {
    url: "/about",
    label: "About Us",
  },
  {
    url: "/contact",
    label: "Contact Us",
  },
];

export const footerGeneralLinks = [
  {
    url: "/privacy-policy",
    label: "Privacy-Policy",
  },
  {
    url: "/shipping-policy",
    label: "Returns and Shipping Policy",
  },
];

export const footerSocialLinks = [
  {
    url: "/about",
    label: "About Us",
  },
  {
    url: "/contact",
    label: "Contact Us",
  },
];
