// Selector labels match production RBAC; values retain existing fixture identities.
export const hallTestIdentities = [
  { value: "organizer", label: "Super admin", zones: null, adminZones: [] },
  {
    value: "admin-tech",
    label: "Admin (organizer) · AI & ML",
    zones: ["ai-ml"],
    adminZones: ["ai-ml"],
  },
  {
    value: "admin-deep",
    label: "Admin (organizer) · Web & Cloud",
    zones: ["web-cloud"],
    adminZones: ["web-cloud"],
  },
  {
    value: "lead-tech",
    label: "Track lead · AI & ML",
    zones: ["ai-ml"],
    adminZones: [],
  },
  {
    value: "lead-deep",
    label: "Track lead · Web & Cloud",
    zones: ["web-cloud"],
    adminZones: [],
  },
  {
    value: "user",
    label: "User · no control access",
    zones: [],
    adminZones: [],
  },
  { value: "public", label: "Signed out", zones: [], adminZones: [] },
];
