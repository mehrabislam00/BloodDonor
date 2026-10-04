export interface Donor {
  id: string;
  initials: string;
  name: string;
  profileImage?: string | null;
  verified: boolean;
  location: string;
  bloodGroup: string;
  available: boolean;
  availability: string;
  availableFrom?: string | null;
  lastActiveAt: number | null;
  lastDonationDate: string | null;
}
