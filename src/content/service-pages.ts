import type { ServiceSlug } from "./services";

/**
 * Page copy for the services section, taken from txgksa.com/services (crawled
 * 12 Nov 2026). The wording is the group's own. The one change: where the
 * original says "TXG" as the firm that does the work, it says "Smart Built
 * Technologies" here, because SBT is the production firm that delivers it.
 * Americanised spellings (modeling, millimeter) are left as published.
 */

const SBT = "Smart Built Technologies";

export interface ServiceDoc {
  slug: ServiceSlug;
  /** Name on the breadcrumb and in the "next service" link */
  crumb: string;
  /** H1, one entry per line */
  headline: string[];
  lede: string;
  /** The two small labels under the hero lede */
  tags: [string, string];
  image?: {
    src: string;
    width: number;
    height: number;
    alt: string;
    position?: string;
  };
  /** Page title and description for search */
  seoTitle: string;
  seoDescription: string;

  what: {
    label: string;
    title: string;
    body: string[];
    stats: { big: string; label: string }[];
  };

  why: {
    label: string;
    title: string;
    intro: string;
    items: { title: string; body: string }[];
  };

  deliver: {
    label: string;
    title: string;
    intro: string;
    items: { tag: string; title: string; body: string }[];
  };

  /** Only BIM has questions on the original site */
  faqs?: { id: string; question: string; answer: string }[];

  cta: {
    label: string;
    title: string;
    body: string;
  };
}

/** Asset tagging is a section of the asset management page (#asset-tagging). */
export const assetTagging = {
  label: "Asset Tagging Services",
  title: "Every Asset, Digitally Connected",
  intro:
    "Asset Tagging is the critical first step in the Asset Management workflow — uniquely identifying and labeling every physical asset using QR codes, barcodes, or RFID tags. Each tag links the physical asset to its digital profile, creating a seamless bridge between the built environment and your CAFM/CMMS platform.",
  fitsTitle: "How It Fits Into Asset Management",
  fits: `Before a CAFM/CMMS platform can manage assets, every asset must be identified, surveyed, and tagged. ${SBT}’s Asset Tagging services create the foundational data layer — the digital asset register — that feeds directly into your Asset Management System. This systematic approach ensures accurate lifecycle tracking from installation through maintenance to replacement, giving your facility management team instant access to critical asset information at any point of need.`,
  items: [
    {
      title: "QR Code & Barcode Tagging",
      body: "Deployment of durable, facility-grade QR codes and barcodes that withstand harsh environments, enabling instant access to asset data via mobile scanning devices.",
    },
    {
      title: "RFID Smart Tags",
      body: "Automated, contactless asset tracking using RFID technology — ideal for high-density environments, concealed assets, and real-time inventory management.",
    },
    {
      title: "Digital Asset Register",
      body: "Comprehensive digital registers linked to BIM models, containing complete asset hierarchies, specifications, warranty information, and maintenance schedules.",
    },
  ],
  stats: [
    { big: "QR", label: "Code & Barcode" },
    { big: "RFID", label: "Smart Tagging" },
    { big: "BIM", label: "Model Linked" },
  ],
};

/** The services index: the group's wording for each card. */
export const servicesIndexCopy = {
  title: "Services",
  lede: "Delivering absolute precision through advanced digital construction solutions and rigorous data integration.",
  cards: {
    bim: {
      title: "Building Information Modelling (BIM) in Design",
      body: "End-to-end BIM implementation optimizing design visualization and coordination.",
    },
    "reality-capture": {
      title: "Reality Capture & Scan to BIM",
      body: "Precision LiDAR scanning and point cloud processing to create accurate BIM models from existing conditions.",
    },
    "asset-management": {
      title: "Asset Management System Implementation",
      body: "End-to-end CAFM/CMMS deployment, asset tagging, data migration, and enterprise system integration for operational excellence.",
    },
    cafm: {
      title: "Computer Aided Facility Management (CAFM) Implementation",
      body: "Integrating intelligent facility management solutions for streamlined operations.",
    },
    "digital-twin": {
      title:
        "Digital Twin for Smart Building Implementation & Integration (BMS & IOT devices integrations)",
      body: "Real-time monitoring and analytics through comprehensive Digital Twin solutions.",
    },
    "gis-smart-cities": {
      title: "GIS Integration & Smart Cities",
      body: "Geospatial insights combined with BIM for macro-level urban planning.",
    },
    "immersive-solutions": {
      title: "Immersive Solutions (AR / VR / XR)",
      body: "Augmented, Virtual, and Extended Reality solutions for BIM visualization, training, and stakeholder engagement.",
    },
    "4d-simulation": {
      title: "4D Construction & Logistics Simulation",
      body: "Schedule-linked BIM simulations for construction sequencing, logistics planning, and clash avoidance.",
    },
    "it-services": {
      title: "IT Services & Infrastructure",
      body: "Comprehensive IT solutions, infrastructure management, and technical support for enterprise operations.",
    },
  } satisfies Record<ServiceSlug, { title: string; body: string }>,
};

export const serviceDocs: Record<ServiceSlug, ServiceDoc> = {
  bim: {
    slug: "bim",
    crumb: "BIM in Design",
    headline: ["Building", "Information", "Modelling"],
    lede: `At ${SBT}, we specialize in Building Information Modelling (BIM) to enhance design accuracy, project management, and collaboration. Our BIM services provide the detailed insights needed to execute construction projects seamlessly and efficiently.`,
    tags: ["Digital Representation", "3D Model-Based Process"],
    image: {
      src: "/assets/services/bim.jpg",
      width: 2000,
      height: 1333,
      alt: "Two BIM coordinators reviewing a federated building model on screen",
    },
    seoTitle: "BIM Services, Building Information Modelling",
    seoDescription:
      "ISO 19650-aligned BIM (Building Information Modelling) services: 3D modelling, clash detection, BIM implementation and project lifecycle management, delivered from Chennai.",
    what: {
      label: "What is BIM?",
      title: "What is Building Information Modelling (BIM)?",
      body: [
        "Building Information Modelling (BIM) is a digital representation of the physical and functional characteristics of a project. This intelligent 3D model-based process allows construction professionals to plan, design, construct, and manage buildings and infrastructure with greater accuracy and efficiency.",
      ],
      stats: [
        { big: "3D", label: "Intelligent Models" },
        { big: "ISO", label: "19650 Compliant" },
        { big: "LOD", label: "100 – 500 Ready" },
      ],
    },
    why: {
      label: `Why ${SBT} for BIM`,
      title: "Why Choose Us for BIM Services?",
      intro: `Our BIM solutions are designed to facilitate better communication, reduce project risks, and improve overall productivity. Here's why partnering with ${SBT} for BIM makes a difference:`,
      items: [
        {
          title: "Integrated Project Collaboration",
          body: "Ensure all stakeholders have access to consistent, real-time data for improved coordination.",
        },
        {
          title: "Enhanced Design Accuracy",
          body: "Utilize 3D modeling to visualize project elements and anticipate challenges before construction begins.",
        },
        {
          title: "Streamlined Data Management",
          body: "Centralize all project data for better accessibility and management throughout the project lifecycle.",
        },
        {
          title: "Cost and Time Savings",
          body: "Reduce errors and project delays with predictive analysis and data-driven planning.",
        },
      ],
    },
    deliver: {
      label: "Key Services",
      title: "What we deliver.",
      intro:
        "Every BIM service is built around precision, collaboration, and delivering data that outlasts the project itself.",
      items: [
        {
          tag: "Core BIM",
          title: "3D Modeling and Visualization",
          body: "Create detailed models that support comprehensive project understanding.",
        },
        {
          tag: "Coordination",
          title: "Design Coordination and Clash Detection",
          body: "Identify and resolve potential design conflicts before construction starts.",
        },
        {
          tag: "Enablement",
          title: "BIM Implementation and Training",
          body: "Equip your team with the knowledge and tools needed for effective BIM adoption.",
        },
        {
          tag: "Lifecycle",
          title: "Project Lifecycle Management",
          body: "Support for managing project data from initial design to post-construction.",
        },
      ],
    },
    faqs: [
      {
        id: "what-is-bim",
        question: "What is Building Information Modelling (BIM)?",
        answer:
          "BIM is a digital representation of the physical and functional characteristics of a project. This intelligent 3D model-based process allows construction professionals to plan, design, construct, and manage buildings and infrastructure with greater accuracy and efficiency.",
      },
      {
        id: "bim-services",
        question: `What BIM services does ${SBT} offer?`,
        answer: `${SBT} offers 3D Modeling and Visualization, Design Coordination and Clash Detection, BIM Implementation and Training, and Project Lifecycle Management — all delivered to ISO 19650 standards.`,
      },
      {
        id: "iso-19650",
        question: `Is ${SBT}'s BIM service ISO 19650 compliant?`,
        answer: `Yes. All ${SBT} BIM deliverables are developed in accordance with ISO 19650 — the international standard for managing information over the whole life cycle of a built asset using BIM.`,
      },
      {
        id: "lod",
        question: `What LOD levels does ${SBT} deliver?`,
        answer: `${SBT} delivers BIM models from LOD 100 through LOD 500, covering concept through as-built documentation, tailored to the project phase and client requirements.`,
      },
    ],
    cta: {
      label: "BIM Consultation",
      title: "Experience the power of Building Information Modelling.",
      body: "Unlock new levels of efficiency and precision for your projects. Contact us today to explore how our BIM services can bring innovation and efficiency to your project designs.",
    },
  },

  "reality-capture": {
    slug: "reality-capture",
    crumb: "Reality Capture",
    headline: ["Reality", "Capture &", "Scan to BIM"],
    lede: `${SBT} delivers precision Reality Capture services powered by LiDAR scanning technology, transforming physical environments into accurate digital representations. Our Scan to BIM workflows bridge the gap between existing conditions and intelligent 3D models.`,
    tags: ["Scan to BIM", "Point Cloud to Model"],
    image: {
      src: "/assets/services/reality-capture.jpg",
      width: 2000,
      height: 1333,
      alt: "A surveyor setting up a total station to capture an existing site",
    },
    seoTitle: "Reality Capture & Scan to BIM, LiDAR Scanning Services",
    seoDescription:
      "Precision Reality Capture and Scan to BIM services using advanced LiDAR scanning. Transform physical environments into accurate, intelligent BIM models for construction, renovation, and facility management.",
    what: {
      label: "What is Reality Capture?",
      title: "From Physical World to Digital Precision.",
      body: [
        "Reality Capture is the process of digitizing physical environments using advanced technologies such as LiDAR scanning, photogrammetry, and 3D laser scanning. The resulting point cloud data — comprising millions of precisely measured spatial coordinates — forms the foundation for creating accurate, information-rich BIM models through our Scan to BIM workflow.",
        `This technology is essential for as-built documentation, renovation projects, heritage preservation, and quality assurance during construction. By integrating reality capture data directly into the BIM ecosystem, ${SBT} ensures that every digital model reflects true site conditions with millimeter-level accuracy.`,
      ],
      stats: [
        { big: "LiDAR", label: "Precision Scanning" },
        { big: "BIM", label: "Scan to BIM" },
        { big: "mm", label: "Level Accuracy" },
      ],
    },
    why: {
      label: `Why ${SBT} for Reality Capture`,
      title: "Why Choose Us for Scan to BIM?",
      intro:
        "Our reality capture expertise combines cutting-edge LiDAR technology with deep BIM knowledge, ensuring every scan translates into actionable, model-ready data for your project lifecycle.",
      items: [
        {
          title: "Seamless Scan to BIM Pipeline",
          body: "Our end-to-end workflow transforms raw point cloud data into intelligent, parametric BIM models ready for design coordination, clash detection, and facility management — eliminating data gaps between field and office.",
        },
        {
          title: "Millimeter-Level Accuracy",
          body: "Using state-of-the-art LiDAR scanners and photogrammetry, we capture existing conditions with extraordinary precision, ensuring your BIM models reflect the true physical environment down to the finest detail.",
        },
        {
          title: "Accelerated Project Timelines",
          body: "Reality capture dramatically reduces the time spent on manual surveys and site measurements. Digital point clouds can be processed and converted to BIM models in a fraction of the time traditional methods require.",
        },
        {
          title: "Risk Reduction & Quality Assurance",
          body: "By comparing as-built scan data against design intent, we identify deviations early — preventing costly rework, ensuring construction quality, and maintaining compliance with project specifications.",
        },
      ],
    },
    deliver: {
      label: "Key Services",
      title: "What we capture.",
      intro:
        "From LiDAR scanning to Scan to BIM conversion, every service is designed to deliver precise, actionable digital representations of physical reality.",
      items: [
        {
          tag: "Core Capture",
          title: "LiDAR Scanning",
          body: "High-precision terrestrial and mobile LiDAR scanning to capture complex environments, structures, and MEP systems with millions of accurate data points per second.",
        },
        {
          tag: "Processing",
          title: "Point Cloud Processing",
          body: "Registration, cleaning, and classification of raw scan data into organized, geo-referenced point clouds ready for BIM authoring and design validation.",
        },
        {
          tag: "Scan to BIM",
          title: "Scan to BIM Conversion",
          body: "Transforming point cloud data into fully parametric, intelligent BIM models at LOD 100–500 — the cornerstone of our reality capture offering, enabling seamless integration into your BIM workflow.",
        },
        {
          tag: "Documentation",
          title: "As-Built Documentation",
          body: "Generating precise as-built records from scan data for handover, renovation planning, and facility management — ensuring BIM models accurately reflect constructed conditions.",
        },
        {
          tag: "QA / QC",
          title: "Construction Verification",
          body: "Comparing scan data against design models to detect deviations, verify construction quality, and ensure compliance with specifications before and during handover.",
        },
        {
          tag: "Heritage",
          title: "Heritage & Retrofit Scanning",
          body: "Specialized scanning for heritage preservation, renovation, and retrofit projects where accurate existing condition documentation is critical for sensitive interventions.",
        },
      ],
    },
    cta: {
      label: "Reality Capture",
      title: "Capture reality, build digitally.",
      body: "Transform your existing environments into precise digital models with our Reality Capture and Scan to BIM services. Contact us to discover how LiDAR scanning can accelerate your next project.",
    },
  },

  "asset-management": {
    slug: "asset-management",
    crumb: "Asset Management",
    headline: ["Asset", "Management", "Systems"],
    lede: `${SBT} delivers end-to-end Asset Management System implementation and integration — from CAFM/CMMS platform deployment to asset information management, data migration, and enterprise system integration for operational excellence.`,
    tags: ["CAFM / CMMS", "Enterprise Integration"],
    image: {
      src: "/assets/services/asset-management.png",
      width: 1024,
      height: 682,
      alt: "A technician scanning an asset tag in a server room",
    },
    seoTitle: "Asset Management & Asset Tagging Services",
    seoDescription:
      "End-to-end asset management system implementation including CAFM/CMMS deployment, asset tagging (QR, barcode, RFID), digital asset registers, data migration, enterprise system integration, and reporting analytics.",
    what: {
      label: "What is Asset Management?",
      title: "Intelligent Systems for Asset Lifecycle Excellence.",
      body: [
        `Asset Management System Implementation is the strategic deployment of CAFM and CMMS platforms that centralize asset information, automate maintenance workflows, and provide real-time visibility into asset performance across your entire portfolio. ${SBT} specializes in configuring these systems to work seamlessly with BIM models and Digital Twin environments.`,
        "From initial data migration and system configuration to enterprise integration and reporting analytics, we ensure your asset management platform becomes the single source of truth for all operational asset data — enabling data-driven decisions that reduce costs and extend asset lifecycles.",
      ],
      stats: [
        { big: "CAFM", label: "Platform Ready" },
        { big: "BIM", label: "Data Integrated" },
        { big: "Live", label: "Asset Analytics" },
      ],
    },
    why: {
      label: `Why ${SBT} for Asset Management`,
      title: "Why Choose Us for Asset Management?",
      intro:
        "Our asset management expertise spans CAFM/CMMS platforms, BIM data integration, and enterprise system connectivity — delivering operational readiness from day one of facility handover.",
      items: [
        {
          title: "End-to-End Implementation",
          body: "From requirements gathering and platform selection through configuration, testing, and go-live — we manage the entire CAFM/CMMS implementation lifecycle, ensuring zero disruption to ongoing operations.",
        },
        {
          title: "BIM-to-Operations Bridge",
          body: "We bridge the gap between BIM project data and operational asset management by migrating asset information, COBie data, and spatial references directly from your BIM models into the CAFM/CMMS platform.",
        },
        {
          title: "Seamless System Integration",
          body: "Our integration expertise connects asset management platforms with ERP, IoT sensors, BMS, and Digital Twin environments — creating a unified ecosystem where data flows automatically across all systems.",
        },
        {
          title: "Actionable Reporting & Analytics",
          body: "Custom dashboards, KPI tracking, and predictive maintenance analytics that transform raw asset data into actionable insights — empowering facility managers to make informed, data-driven decisions.",
        },
      ],
    },
    deliver: {
      label: "Key Services",
      title: "What we implement.",
      intro:
        "From CAFM/CMMS deployment to enterprise integration, every service is built to maximize asset performance and operational efficiency.",
      items: [
        {
          tag: "CAFM / CMMS",
          title: "CAFM / CMMS Implementation",
          body: "Full platform deployment including system configuration, workflow setup, user roles, SLA definitions, and preventive maintenance scheduling tailored to your facility operations.",
        },
        {
          tag: "AIM",
          title: "Asset Information Management",
          body: "Structuring, validating, and managing all asset data — specifications, warranties, manuals, and maintenance records — in a centralized, standards-compliant information system.",
        },
        {
          tag: "Migration",
          title: "Data Migration & Cleansing",
          body: "Systematic migration of asset data from legacy systems, spreadsheets, and BIM models — including data validation, deduplication, and enrichment to ensure a clean, reliable asset database.",
        },
        {
          tag: "Integration",
          title: "Enterprise System Integration",
          body: "Connecting your asset management platform with ERP (SAP, Oracle), BMS, IoT sensors, Digital Twin environments, and GIS platforms for a unified operational data ecosystem.",
        },
        {
          tag: "Lifecycle",
          title: "Asset Lifecycle Management",
          body: "End-to-end lifecycle planning from procurement and commissioning through maintenance, condition monitoring, and eventual replacement — optimizing total cost of ownership.",
        },
        {
          tag: "Analytics",
          title: "Reporting & Analytics",
          body: "Custom dashboards, KPI tracking, cost analysis, and predictive maintenance reports that transform asset data into actionable business intelligence for strategic decision-making.",
        },
      ],
    },
    cta: {
      label: "Asset Management",
      title: "Optimize your assets with intelligent systems.",
      body: "Transform how you manage facility assets with our comprehensive CAFM/CMMS implementation and integration services. From asset tagging and data migration to enterprise connectivity.",
    },
  },

  cafm: {
    slug: "cafm",
    crumb: "CAFM Implementation",
    headline: ["Computer Aided", "Facility", "Management"],
    lede: `At ${SBT}, we provide CAFM (Computer Aided Facility Management) solutions that transform the facility operations. Our services are designed to enhance efficiency, streamline operations, and ensure comprehensive oversight of your assets and resources.`,
    tags: ["Integrated System", "Real-Time Data & Analytics"],
    image: {
      src: "/assets/services/asset-management.png",
      width: 1024,
      height: 682,
      alt: "A technician with a handheld device checking an asset register",
      position: "20% 30%",
    },
    seoTitle: "CAFM Implementation, Computer Aided Facility Management",
    seoDescription:
      "CAFM solutions that transform facility operations. Expert Computer Aided Facility Management implementation with centralized data management, asset tracking, real-time monitoring, and scalable solutions.",
    what: {
      label: "What is CAFM?",
      title: "What is CAFM / Computer Aided Facility Management?",
      body: [
        "CAFM refers to the integration of software and technologies that support facilities management by combining real-time data and analytical tools. With CAFM, organizations can effectively manage physical spaces, assets, and services — leading to optimized resource utilization, significant cost savings, and streamlined facility operations for improved productivity.",
      ],
      stats: [
        { big: "Real", label: "Time Monitoring" },
        { big: "Asset", label: "Tracking & Management" },
        { big: "Cost", label: "Optimization" },
      ],
    },
    why: {
      label: `Why ${SBT} for CAFM`,
      title: "Why Choose Us for CAFM Implementation?",
      intro:
        "Our approach to CAFM implementation goes beyond software integration, offering tailored solutions to meet your organization's unique needs, ensuring that all aspects of your facilities management processes are covered. Here's what you gain with our expertise:",
      items: [
        {
          title: "Centralized Data Management",
          body: "Seamlessly organize and access facility data in a single, user-friendly platform.",
        },
        {
          title: "Enhanced Asset Tracking",
          body: "Maintain accurate records of all assets, including their status, location, and maintenance history.",
        },
        {
          title: "Improved Operational Efficiency",
          body: "Streamline day-to-day operations with automated workflows and real-time data insights.",
        },
        {
          title: "Cost and Resource Optimization",
          body: "Identify opportunities to reduce costs and better allocate resources to enhance overall productivity.",
        },
      ],
    },
    deliver: {
      label: "Key Services",
      title: "Our Key CAFM Services.",
      intro:
        "Every CAFM service is built around precision, integration, and delivering solutions that modernize your facility management.",
      items: [
        {
          tag: "Custom",
          title: "Tailored CAFM Solutions",
          body: "Customized implementation plans that align with your facility's goals.",
        },
        {
          tag: "Data",
          title: "Comprehensive Data Integration",
          body: "Ensure all facility-related data is stored and managed in a cohesive system.",
        },
        {
          tag: "Monitoring",
          title: "Real-Time Monitoring and Reporting",
          body: "Access up-to-date information for improved decision-making.",
        },
        {
          tag: "Scalable",
          title: "Scalable Facility Management",
          body: "Solutions that adapt as your organization grows and evolves.",
        },
      ],
    },
    cta: {
      label: "CAFM Implementation",
      title: "Modernize your Facility Management.",
      body: "Implementing CAFM not only modernizes your facility management practices but also ensures that your operations are as efficient and cost-effective as possible. Contact Us Today to learn how our CAFM implementation services can streamline your facility management and boost your operational capabilities.",
    },
  },

  "digital-twin": {
    slug: "digital-twin",
    crumb: "Digital Twin",
    headline: ["Digital Twin", "Smart Building", "Integration"],
    lede: `At ${SBT}, we offer comprehensive Digital Twin solutions designed to integrate seamlessly with modern smart buildings. Our services enable real-time monitoring, predictive maintenance, and enhanced management of built environments through innovative technology.`,
    tags: ["Virtual Representation", "Real-Time Data Mirroring"],
    image: {
      src: "/assets/services/cafm.jpg",
      width: 1024,
      height: 608,
      alt: "A facilities engineer with a tablet showing live building data over a campus",
    },
    seoTitle: "Digital Twin for Smart Building Implementation & Integration",
    seoDescription:
      "Comprehensive Digital Twin solutions for smart buildings, integrating BMS and IoT devices for real-time monitoring, predictive maintenance, and enhanced building management.",
    what: {
      label: "What is a Digital Twin?",
      title: "What is a Digital Twin?",
      body: [
        "A Digital Twin is a virtual representation of a physical asset or system that is continuously updated with real-time data. By mirroring the physical world, Digital Twins provide insights that drive smarter decision-making, streamline processes, and optimize building performance. Digital Twins are pivotal in transforming traditional building management into a proactive, data-driven approach.",
      ],
      stats: [
        { big: "IoT", label: "Device Integration" },
        { big: "BMS", label: "Connectivity" },
        { big: "Live", label: "Real-Time Data" },
      ],
    },
    why: {
      label: `Why ${SBT} for Digital Twin`,
      title: `Why Choose ${SBT} for Digital Twin Implementation?`,
      intro: `Our Digital Twin solutions are tailored to meet the evolving demands of smart building management. With ${SBT}, you gain the advantage of:`,
      items: [
        {
          title: "Real-Time Remote Monitoring",
          body: "Gain the ability to interact with and manage built environments from anywhere with real-time updates.",
        },
        {
          title: "Predictive Maintenance",
          body: "Use data-driven insights to anticipate and address maintenance needs before they become critical issues, reducing downtime and costs.",
        },
        {
          title: "Accelerated Risk Assessment and Production Time",
          body: "Quickly identify and mitigate potential risks, enhancing overall safety and efficiency.",
        },
        {
          title: "Integration with IoT and BMS",
          body: "Ensure seamless connections between your Digital Twin, IoT devices, and Building Management Systems (BMS) for a comprehensive, connected building ecosystem.",
        },
      ],
    },
    deliver: {
      label: "Key Services",
      title: "Our Key Digital Twin Services.",
      intro:
        "Every Digital Twin service is built around real-time intelligence, seamless integration, and driving smarter building management.",
      items: [
        {
          tag: "Smart Building",
          title: "Smart Building Implementation",
          body: "Full-scale integration of Digital Twin technology for better management of building operations.",
        },
        {
          tag: "IoT",
          title: "IoT Device Integration",
          body: "Real-time data connections that enhance the accuracy and functionality of your Digital Twin.",
        },
        {
          tag: "BMS",
          title: "BMS Connectivity",
          body: "Synchronized interactions between the Digital Twin and Building Management Systems for holistic monitoring and control.",
        },
        {
          tag: "Analytics",
          title: "Advanced Predictive Analytics",
          body: "Tools that support proactive building maintenance and risk management strategies.",
        },
      ],
    },
    cta: {
      label: "Digital Twin Solutions",
      title: "Revolutionize Building Management with Digital Twin Technology.",
      body: "Transform the way you manage your smart buildings with Digital Twin technology. Our advanced solutions ensure you stay ahead in building innovation, operational efficiency, and performance optimization. Contact Us Today to discover how our Digital Twin services can optimize your smart building operations and drive greater efficiency.",
    },
  },

  "gis-smart-cities": {
    slug: "gis-smart-cities",
    crumb: "GIS & Smart Cities",
    headline: ["GIS Integration", "& Smart", "Cities"],
    lede: `At ${SBT}, we leverage GIS (Geographic Information System) technology to support the development of smart cities. Our expertise ensures that urban environments are managed more efficiently, promoting sustainable growth and enhanced livability.`,
    tags: ["Spatial Intelligence", "Geographic Data Layers"],
    image: {
      src: "/assets/services/gis-smart-cities.jpg",
      width: 1024,
      height: 551,
      alt: "A city at dusk with glowing data connections between buildings",
    },
    seoTitle: "GIS Integration & Smart Cities, Spatial Data & Urban Intelligence",
    seoDescription:
      "GIS technology to support smart city development. Expert GIS integration services including GIS and BIM integration, centralized data solutions, real-time data accessibility, and advanced surveying capabilities.",
    what: {
      label: "What is GIS?",
      title: "What is GIS?",
      body: [
        "GIS is a powerful system that captures, verifies, and displays spatial data based on Earth's surface. By layering geographic information, GIS enables better analysis, comprehension, and management of urban spaces. It provides real-time access to accurate data, making it a crucial tool for urban planning, construction, and infrastructure management.",
        "When integrated with Building Information Modelling (BIM), GIS creates a powerful spatial-BIM ecosystem that extends building-level intelligence to city-scale decision making. Combined with Digital Twin technology, GIS enables real-time monitoring and predictive analytics across entire urban districts. Its integration with Asset Management platforms ensures geospatial context for every asset, enabling location-aware maintenance, resource allocation, and infrastructure lifecycle planning.",
      ],
      stats: [
        { big: "GIS", label: "Spatial Data Layers" },
        { big: "BIM", label: "Combined Integration" },
        { big: "Twin", label: "Digital Twin Ready" },
        { big: "Live", label: "Real-Time Access" },
      ],
    },
    why: {
      label: `Why ${SBT} for GIS`,
      title: "Why Choose Us for GIS Integration?",
      intro: `GIS integration in smart city projects leads to smarter resource allocation, efficient data management, and optimized planning. At ${SBT}, we offer specialized GIS integration services designed to help construction organizations:`,
      items: [
        {
          title: "Streamline Surveying and Data Management",
          body: "Simplify the collection and organization of vast amounts of spatial data, ensuring all critical information — from topographic surveys to utility mapping — is stored, validated, and managed in a central, version-controlled location accessible to all stakeholders.",
        },
        {
          title: "Enhance Collaboration with GIS and BIM",
          body: "By combining GIS with Building Information Modeling (BIM), construction firms can ensure seamless spatial data sharing, enhanced project visualization across geographic scales, and integrated workflows that connect building-level design with site and city-level context.",
        },
        {
          title: "Access to Real-Time Data",
          body: "Make informed decisions with real-time geospatial updates from IoT sensors, drone surveys, and satellite feeds — improving responsiveness and efficiency in urban planning, infrastructure monitoring, and emergency management scenarios.",
        },
        {
          title: "GIS-BIM-Digital Twin Synergy",
          body: "Unlock the full potential of your digital ecosystem by connecting GIS spatial intelligence with BIM building data and Digital Twin real-time analytics — creating a multi-scale platform that drives smarter asset management, urban planning, and infrastructure lifecycle decisions.",
        },
      ],
    },
    deliver: {
      label: "Key Services",
      title: "Our Key GIS Integration Services.",
      intro:
        "Every GIS service is built around spatial intelligence, real-time data, and driving smarter urban development.",
      items: [
        {
          tag: "GIS & BIM",
          title: "GIS and BIM Integration",
          body: "Combining geospatial intelligence with building-level BIM data to create a unified spatial ecosystem for enhanced visualization, coordination, and decision-making across construction teams and urban planners.",
        },
        {
          tag: "Data",
          title: "Centralized Data Solutions",
          body: "Helping organizations centralize spatial and operational data into a single, accessible platform — enabling cross-departmental collaboration, eliminating data silos, and ensuring all stakeholders work from consistent, location-aware information.",
        },
        {
          tag: "Real-Time",
          title: "Real-Time Data Accessibility",
          body: "Ensuring you have access to up-to-date geospatial information for responsive decision-making, live monitoring of urban systems, and dynamic infrastructure management through cloud-based GIS platforms.",
        },
        {
          tag: "Surveying",
          title: "Advanced Surveying Capabilities",
          body: "Comprehensive support for capturing and verifying spatial data using modern surveying technologies — including LiDAR, drone photogrammetry, and satellite imagery — to aid in efficient planning and site analysis.",
        },
        {
          tag: "Digital Twin",
          title: "Digital Twin & GIS Convergence",
          body: "Merging GIS with Digital Twin technology to create city-scale digital replicas that enable real-time infrastructure monitoring, predictive maintenance across districts, and scenario simulation for urban resilience planning.",
        },
        {
          tag: "Asset Mgmt",
          title: "GIS for Asset Management & FM",
          body: "Integrating geospatial context into asset management and facility management platforms — enabling location-aware maintenance scheduling, spatial resource allocation, and geographic performance analytics across building portfolios.",
        },
      ],
    },
    cta: {
      label: "GIS Integration",
      title: "Experience the future of Urban Development.",
      body: "Experience the future of urban development with our GIS solutions designed for smart city advancement. Our services ensure you stay ahead in planning, construction, and overall city management. Contact Us Today to explore how our GIS integration services can enhance your smart city projects.",
    },
  },

  "immersive-solutions": {
    slug: "immersive-solutions",
    crumb: "Immersive Solutions",
    headline: ["Immersive", "AR / VR /", "XR Solutions"],
    lede: `${SBT} brings construction and facility management into the immersive dimension with Augmented Reality (AR), Virtual Reality (VR), and Extended Reality (XR) solutions — enabling stakeholders to experience, interact with, and validate designs before a single brick is laid.`,
    tags: ["Extended Reality", "AR · VR · XR"],
    image: {
      src: "/assets/misc/hero-architecture.webp",
      width: 2400,
      height: 1432,
      alt: "A 3D model of a room held over architectural drawings",
    },
    seoTitle: "Immersive Solutions, AR, VR & XR for BIM & Construction",
    seoDescription:
      "Augmented Reality (AR), Virtual Reality (VR), and Extended Reality (XR) solutions for BIM visualization, construction, facility management, training, and client presentations.",
    what: {
      label: "What are Immersive Solutions?",
      title: "Experience Design Before Construction.",
      body: [
        "Immersive Solutions leverage Augmented Reality (AR), Virtual Reality (VR), and Extended Reality (XR) technologies to transform how stakeholders interact with BIM models and construction data. AR overlays digital information onto the physical world, VR creates fully immersive virtual environments, and XR combines both for a seamless mixed-reality experience.",
        "These technologies are revolutionizing BIM visualization, construction training, facility management workflows, and client presentations — enabling teams to walk through buildings before they're built, overlay BIM data on construction sites for real-time validation, and simulate maintenance scenarios in virtual environments.",
      ],
      stats: [
        { big: "AR", label: "Augmented Reality" },
        { big: "VR", label: "Virtual Reality" },
        { big: "XR", label: "Extended Reality" },
      ],
    },
    why: {
      label: `Why ${SBT} for Immersive Solutions`,
      title: "Why Choose Us for AR / VR / XR?",
      intro:
        "Our immersive solutions are powered by real BIM data, making every virtual experience an accurate reflection of your actual project — not just an impressive visualization.",
      items: [
        {
          title: "BIM-Native Immersive Experiences",
          body: "Our AR/VR solutions are built directly from your BIM models — not generic 3D assets. Every immersive walkthrough reflects the exact design geometry, material specifications, and spatial relationships in your project.",
        },
        {
          title: "Construction Site Visualization",
          body: "Overlay BIM models onto live construction sites using AR to verify installation accuracy, detect deviations from design intent, and enable real-time quality assurance during the build phase.",
        },
        {
          title: "Training & Safety Simulation",
          body: "Create immersive VR training environments that allow workers to practice complex procedures, navigate hazardous scenarios, and familiarize themselves with facility layouts — all without real-world risk.",
        },
        {
          title: "Client Presentations & Approvals",
          body: "Replace static renderings with interactive VR walkthroughs that let clients experience spaces at full scale, make design decisions with confidence, and provide feedback before construction begins.",
        },
      ],
    },
    deliver: {
      label: "Key Services",
      title: "What we immerse.",
      intro:
        "From VR walkthroughs to AR site overlays, every immersive solution is powered by real BIM data for authentic, actionable experiences.",
      items: [
        {
          tag: "VR",
          title: "VR Design Walkthroughs",
          body: "Immersive virtual reality walkthroughs powered by BIM models, allowing stakeholders to experience and evaluate spaces at full 1:1 scale before construction begins.",
        },
        {
          tag: "AR",
          title: "AR Construction Overlay",
          body: "Augmented reality overlays that project BIM models onto the physical construction site, enabling real-time comparison between design intent and as-built conditions for quality assurance.",
        },
        {
          tag: "XR / FM",
          title: "XR Facility Management",
          body: "Extended reality solutions for facility managers — overlaying asset data, maintenance instructions, and performance metrics onto physical equipment using AR headsets or mobile devices.",
        },
        {
          tag: "Training",
          title: "Safety & Training Simulations",
          body: "Virtual reality training programs that simulate construction scenarios, emergency procedures, and equipment operation — providing risk-free, repeatable training for site personnel.",
        },
        {
          tag: "Visualization",
          title: "Client Visualization & Marketing",
          body: "Photorealistic VR experiences and interactive AR presentations that help clients, investors, and marketing teams visualize completed projects with immersive, emotional impact.",
        },
        {
          tag: "BIM + VR",
          title: "BIM Model Interaction",
          body: "Interactive 3D environments where project teams can navigate, annotate, and collaborate within BIM models using VR headsets — replacing traditional 2D review sessions with spatial understanding.",
        },
      ],
    },
    cta: {
      label: "Immersive Solutions",
      title: "Experience your projects before they're built.",
      body: "Transform stakeholder engagement with our AR, VR, and XR solutions powered by real BIM data. From immersive walkthroughs to AR site overlays, bring your designs to life.",
    },
  },

  "4d-simulation": {
    slug: "4d-simulation",
    crumb: "4D Simulation",
    headline: ["4D Construction", "& Logistics", "Simulation"],
    lede: `${SBT} delivers 4D construction simulation that links BIM models with project schedules, enabling visual construction sequencing, logistics planning, site simulation, and proactive clash avoidance before work begins on site.`,
    tags: ["4D BIM", "Time-Linked Models"],
    image: {
      src: "/assets/services/digital-twin.jpg",
      width: 1024,
      height: 559,
      alt: "A site engineer checking the construction programme against the model on a tablet, with a building rising behind",
    },
    seoTitle: "4D Construction & Logistics Simulation",
    seoDescription:
      "4D construction simulation linking BIM models with project schedules for visual construction sequencing, logistics planning, clash avoidance, and progress monitoring.",
    what: {
      label: "What is 4D Simulation?",
      title: "Visualize Construction Through Time.",
      body: [
        "4D Construction Simulation adds the dimension of time to 3D BIM models, linking every building element to its corresponding construction schedule activity. This creates a dynamic, visual simulation of the entire build sequence — from foundation to finishes — enabling project teams to optimize sequencing, identify scheduling conflicts, and plan logistics before mobilizing to site.",
        "Beyond visualization, 4D simulation serves as a powerful communication tool for stakeholders, contractors, and clients — transforming abstract Gantt charts and critical path schedules into intuitive, animated models that everyone can understand and contribute to.",
      ],
      stats: [
        { big: "4D", label: "Time + 3D Model" },
        { big: "Plan", label: "Logistics Sim" },
        { big: "Zero", label: "Clash Target" },
      ],
    },
    why: {
      label: `Why ${SBT} for 4D Simulation`,
      title: "Why Choose Us for 4D Simulation?",
      intro:
        "Our 4D simulation expertise combines deep construction knowledge with advanced BIM scheduling capabilities — delivering simulations that are practical, buildable, and stakeholder-ready.",
      items: [
        {
          title: "Schedule-Linked BIM Models",
          body: "Every 3D element is linked to its construction activity in the project schedule, creating a dynamic timeline that visually simulates the build sequence — enabling teams to see exactly what gets built, when, and in what order.",
        },
        {
          title: "Logistics & Site Planning",
          body: "Simulate crane placements, material laydown areas, site access routes, and temporary works in the context of the construction sequence — optimizing site logistics and preventing spatial conflicts before they occur.",
        },
        {
          title: "Proactive Clash Avoidance",
          body: "Identify temporal and spatial conflicts where multiple trades or activities overlap in the same location at the same time, enabling proactive resolution that prevents costly delays and rework on site.",
        },
        {
          title: "Stakeholder Communication",
          body: "Transform complex construction schedules into intuitive visual simulations that clients, contractors, and approval authorities can easily understand — accelerating decision-making and approval processes.",
        },
      ],
    },
    deliver: {
      label: "Key Services",
      title: "What we simulate.",
      intro:
        "From construction sequencing to logistics simulation, every service is designed to optimize buildability and minimize on-site surprises.",
      items: [
        {
          tag: "Sequencing",
          title: "Construction Sequencing",
          body: "Visual simulation of the entire construction sequence from foundation to completion, linking every BIM element to its schedule activity for a clear, chronological build animation.",
        },
        {
          tag: "Scheduling",
          title: "Schedule Visualization",
          body: "Transform complex Primavera P6 and Microsoft Project schedules into intuitive 3D animated timelines that make critical path analysis and milestone tracking visually accessible to all stakeholders.",
        },
        {
          tag: "Logistics",
          title: "Logistics Simulation",
          body: "Simulate site logistics including crane operations, material delivery routes, temporary works, scaffolding sequences, and equipment mobilization — optimizing space utilization and safety.",
        },
        {
          tag: "Clash Detection",
          title: "Clash & Conflict Avoidance",
          body: "Identify spatial and temporal clashes where multiple activities compete for the same space at the same time, enabling proactive scheduling adjustments before conflicts manifest on site.",
        },
        {
          tag: "Monitoring",
          title: "Progress Monitoring",
          body: "Compare planned 4D sequences against actual site progress using regular scan data, creating visual earned-value dashboards that immediately highlight schedule deviations.",
        },
        {
          tag: "Phasing",
          title: "Phasing & Zone Planning",
          body: "Divide complex projects into manageable construction phases and work zones, simulating handover sequences and zone-by-zone completion for large-scale developments.",
        },
      ],
    },
    cta: {
      label: "4D Simulation",
      title: "Simulate your build before you build.",
      body: "Eliminate scheduling conflicts and optimize construction logistics with our 4D BIM simulation services. Visualize your entire project timeline linked to the 3D model.",
    },
  },

  "it-services": {
    slug: "it-services",
    crumb: "IT Services",
    headline: ["IT Services"],
    lede: `At ${SBT}, we develop intelligent web applications, enterprise platforms, and mobile solutions that accelerate digital transformation across engineering, construction, and facility management.`,
    // The original reads "TXG IT"; here it carries the production firm's name.
    tags: ["Smart Built IT", "Platform Development"],
    image: {
      src: "/assets/services/it-services.jpg",
      width: 1024,
      height: 574,
      alt: "An engineer using a touch interface of cloud, security and analytics tools",
    },
    seoTitle: "IT Services & App Development, Digital Solutions",
    seoDescription:
      "Intelligent web applications, enterprise platforms, and mobile solutions for digital transformation.",
    what: {
      label: "App & Platform Development",
      title: "Accelerating Digital Transformation.",
      body: [
        `At ${SBT}, we develop intelligent web applications, enterprise platforms, and mobile solutions that accelerate digital transformation across engineering, construction, and facility management.`,
        "Our team delivers scalable software tailored to business workflows, enabling seamless data integration, process automation, real-time monitoring, and operational efficiency through secure and user-centric digital platforms.",
      ],
      stats: [
        { big: "Web", label: "Applications" },
        { big: "Mobile", label: "Solutions" },
        { big: "API", label: "Integration" },
      ],
    },
    // IT services has no "why choose us" block on the original site.
    why: { label: "", title: "", intro: "", items: [] },
    deliver: {
      label: "Our Solutions",
      title: "What we deliver.",
      intro:
        "From digital asset modeling to CAFM implementation support, every solution is built to maximize asset performance and operational efficiency.",
      items: [
        {
          tag: "Modelling",
          title: "Digital Asset Modelling",
          body: "Develop accurate 3D digital representations of physical assets to establish a reliable digital foundation for operations and lifecycle management.",
        },
        {
          tag: "Registers",
          title: "Asset Register Development",
          body: "Create structured and comprehensive asset registers containing critical asset information for effective tracking, reporting, and maintenance.",
        },
        {
          tag: "CAFM",
          title: "CAFM Implementation Support",
          body: "Assist in implementing Computer Aided Facility Management (CAFM) systems to optimize operations, maintenance planning, and asset performance.",
        },
        {
          tag: "Tagging",
          title: "Asset Tagging & Identification",
          body: "Deliver standardized asset tagging solutions using unique identification methods to improve asset traceability and inventory management.",
        },
        {
          tag: "Lifecycle",
          title: "Lifecycle Data Management",
          body: "Maintain accurate asset information throughout the asset lifecycle, supporting maintenance, upgrades, inspections, and replacements.",
        },
        {
          tag: "O&M",
          title: "Operations & Maintenance Enablement",
          body: "Provide integrated digital asset information that empowers facility teams to improve maintenance efficiency, reduce downtime, and enhance operational performance.",
        },
      ],
    },
    cta: {
      label: "Start Your Digital Transformation",
      title: "Ready to build intelligent digital solutions?",
      body: "Let us help you accelerate your digital transformation journey with intelligent web applications, enterprise platforms, and mobile solutions.",
    },
  },
};
