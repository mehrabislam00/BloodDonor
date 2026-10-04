export interface UserData {
  fullName:         string;
  email:            string;
  phone:            string;
  whatsapp:         string;
  bloodGroup:       string;
  area:             string;
  lastDonationDate: string;
  availability:     string;
  availableFrom:    string | null;
  contactEnabled:   boolean;
  photoUrl:         string | null;
}