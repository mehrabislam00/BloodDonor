export interface Donor {
  id: string;
  initials: string;
  name: string;
  verified: boolean;
  location: string;
  bloodGroup: string;
  available: boolean;
  availability: string;
  availableFrom?: string | null;
  activeTime: string;
  lastActiveAt: number | null;
  lastDonation: string;
  lastDonationAt: number | null;
}
