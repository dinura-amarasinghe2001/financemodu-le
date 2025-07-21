/* eslint-disable */
import { FuseNavigationItem } from "@fuse/components/navigation";

export const defaultNavigation: FuseNavigationItem[] = [
  {
    id: "operation-module",
    title: "Operation Module",
    subtitle: "Frequently used features for operations",
    type: "collapsable",
    icon: "heroicons_outline:cog",
    children: [
      {
        id: "dashboard",
        title: "Dashboard",
        type: "basic",
        icon: "heroicons_outline:chart-pie",
        link: "/dashboard",
      },
      {
        id: "gatepass",
        title: "Gatepass",
        type: "basic",
        icon: "heroicons_outline:queue-list",
        link: "/gatepass",
      },
      // {
      //   id: "appointments",
      //   title: "Appointmemts",
      //   type: "basic",
      //   icon: "heroicons_outline:calendar-days",
      //   link: "/appointments",
      // },

      {
        id: "appointments_details",
        title: "Appointmemts",
        type: "basic",
        icon: "heroicons_outline:calendar-days",
        link: "/appointments_details",
      },

      // {
      //   id: "job-cards",
      //   title: "Job Cards",
      //   type: "basic",
      //   icon: "heroicons_outline:at-symbol",
      //   link: "/job-cards",
      // },

      {
        id: "job-cards",
        title: "Job Cards",
        type: "basic",
        icon: "heroicons_outline:at-symbol",
        link: "/job-cards",
      },
      {
        id: "job-cards-workers",
        title: "Job Cards - Workers",
        type: "basic",
        icon: "heroicons_outline:at-symbol",
        link: "/job-work-items",
      },
      {
        id: "estimates",
        title: "Estimates and Invoices",
        subtitle: "Estimates and invoices",
        type: "group",
        icon: "heroicons_outline:home",
        children: [
          {
            id: "estimates",
            title: "Estimates",
            type: "basic",
            icon: "heroicons_outline:truck",
            link: "/estimates",
          },
          {
            id: "pre-estimates",
            title: "Pre-Estimates",
            type: "basic",
            icon: "heroicons_outline:chart-pie",
            link: "/pre-estimates",
          },
          {
            id: "Invoices",
            title: "Invoices",
            type: "basic",
            icon: "heroicons_outline:banknotes",
            link: "/invoices",
          },
        ],
      },

      {
        id: "registries",
        title: "Registries",
        subtitle: "Sets of vehicles and clients",
        type: "group",
        icon: "heroicons_outline:home",
        children: [
          {
            id: "vehicles",
            title: "Vehicles",
            type: "basic",
            icon: "heroicons_outline:truck",
            link: "/vehicles",
          },
          {
            id: "brands",
            title: "Brands",
            type: "basic",
            icon: "directions_car_filled",
            link: "/brands",
          },
          {
            id: "models",
            title: "Models",
            type: "basic",
            icon: "heroicons_outline:puzzle-piece",
            link: "/models",
          },
          {
            id: "owners",
            title: "Owners",
            type: "basic",
            icon: "heroicons_outline:chart-pie",
            link: "/owners",
          },
          {
            id: "treatment-registry",
            title: "Treatment Registry",
            type: "basic",
            icon: "heroicons_outline:chart-pie",
            link: "/treatment-registry",
          },
        ],
      },
    ],
  },

{
  id: "inventory",
  title: "Inventory",
  subtitle: "Frequent actions for managing stock",
  type: "collapsable",
  icon: "inventory",
  children: [
    {
      id: "stock-management",
      title: "Stock Management",
      subtitle: "Manage stock and goods",
      type: "group",
      icon: "heroicons_outline:archive-box",
      children: [
        {
          id: "supplier",
          title: "View Supplier",
          type: "basic",
          icon: "heroicons_outline:user-group",
          link: "/supplier",
        },
        {
          id: "grn",
          title: "GRN",
          type: "basic",
          icon: "heroicons_outline:inbox-arrow-down",
          link: "/grn",
        },
        {
          id: "inventory",
          title: "Inventory",
          type: "basic",
          icon: "heroicons_outline:archive-box",
          link: "/inventory",
        },
        {
          id: "nextpayment",
          title: "Next Payment",
          type: "basic",
          icon: "heroicons_outline:credit-card",
          link: "/nextpayment",
        },
      ],
    },
    {
      id: "records-management",
      title: "Records & Categories",
      subtitle: "Documents and classifications",
      type: "group",
      icon: "heroicons_outline:clipboard-document-list",
      children: [
        {
          id: "bin-card",
          title: "Bin Card",
          type: "basic",
          icon: "heroicons_outline:clipboard-document-list",
          link: "/bin-card",
        },
        {
          id: "category",
          title: "Category",
          type: "basic",
          icon: "heroicons_outline:tag",
          link: "/category",
        },
      ],
    },
  ],
},


  // {
  //     id: 'ongoing',
  //     title: 'On Going',
  //     type: 'basic',
  //     icon: 'heroicons_outline:chart-pie',
  //     link: '/on-going'
  // },
];
export const compactNavigation: FuseNavigationItem[] = [
  {
    id: "example",
    title: "Example",
    type: "basic",
    icon: "heroicons_outline:chart-pie",
    link: "/example",
  },
];
export const futuristicNavigation: FuseNavigationItem[] = [
  {
    id: "example",
    title: "Example",
    type: "basic",
    icon: "heroicons_outline:chart-pie",
    link: "/example",
  },
];
export const horizontalNavigation: FuseNavigationItem[] = [
  {
    id: "example",
    title: "Example",
    type: "basic",
    icon: "heroicons_outline:chart-pie",
    link: "/example",
  },
];
