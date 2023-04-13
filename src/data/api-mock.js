export const plans = [
  {
    id: 1,
    title: "Standard",
    price: "100",
    currencySign: "$",
    description: ["Complete cloud data warehouse", "Secure data sharing"],
  },
  {
    id: 2,
    title: "Premium",
    price: "180",
    currencySign: "$",
    description: [
      "Multi-cluster warehouse",
      "Premium 24x365 support",
      "Search optimization service",
    ],
  },
  {
    id: 3,
    title: "Enterprise",
    price: null,
    priceDescription: "Contact Us",
    description: [
      "PCI compliance",
      "HIPAA support",
      "AWS PrivateLink",
      "Azure PrivateLink",
      "Database failover and failback",
    ],
  },
];

export const countries = ["USA", "Canada", "Germany", "Poland", "China", "Japan"]
  .sort()
  .map((item) => ({ value: item, label: item }));

export const states = ["CA", "TE", "WA"]
  .sort()
  .map((item) => ({ value: item, label: item }));
