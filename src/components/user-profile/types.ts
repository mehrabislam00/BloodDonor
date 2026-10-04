// ── Shared types for User Profile ─────────────────────────────────────────

export type UserProfile = {
  fullName:    string;
  email:       string;
  phone:       string;
  whatsapp:    string;
  area:        string;
  bloodGroup:  string;
  avatarUrl:   string | null;
  dateOfBirth: string;
  gender:      string;
  address:     string;
  lastDonationDate?: string;
  isDonor:     boolean;
  availability: string;
  availableFrom?: string | null;
};

export const MOCK_USER: UserProfile = {
  fullName:   "Mehrab Islam",
  email:      "mehrab@example.com",
  phone:      "",
  whatsapp:   "",
  area:       "Mirpur",
  bloodGroup: "O+",
  avatarUrl:  null,
  dateOfBirth: "",
  gender:      "",
  address:     "",
  isDonor:    true,
  availability: "Available Now",
  availableFrom: null,
};

export const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
export const AREAS        = ["Dhanmondi", "Mirpur", "Uttara", "Gulshan", "Mohammadpur", "Banani", "Motijheel", "Farmgate"];
export const GENDERS      = ["Female", "Male", "Non-binary", "Prefer not to say"];
export const AVAILABILITY  = [
  "Available Now",
  "Available in 15 Days",
  "Available in 1 Month",
  "Available in 2 Months",
  "Available in 3 Months",
  "Unavailable",
];

// Profile completion — fields that count toward 100%
export function calcCompletion(u: UserProfile): number {
  const fields: (string | null)[] = [
    u.fullName, u.email, u.phone, u.whatsapp,
    u.area, u.bloodGroup, u.avatarUrl,
  ];
  const filled = fields.filter((f) => f && f.trim() !== "").length;
  return Math.round((filled / fields.length) * 100);
}

export const COMPLETION_ITEMS: {
  key:   keyof UserProfile;
  label: string;
}[] = [
  { key: "avatarUrl",  label: "Profile Picture" },
  { key: "fullName",   label: "Full Name"        },
  { key: "email",      label: "Email Address"    },
  { key: "phone",      label: "Phone Number"     },
  { key: "whatsapp",   label: "WhatsApp Number"  },
  { key: "area",       label: "Area"             },
  { key: "bloodGroup", label: "Blood Group"      },
];