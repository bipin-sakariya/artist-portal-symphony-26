
import { Artist } from "@/lib/dashboard-data";

export interface ExtendedArtist extends Artist {
  socialLinks?: {
    instagram: string;
    twitter: string;
    facebook: string;
    website: string;
  };
}

export interface ArtistTags {
  id: string;
  name: string;
  nameAr: string;
}

export interface PricingEntry {
  eventType: string;
  country: string;
  price: number;
}

export interface PricingMatrix {
  default: number;
  eventTypes: Record<string, number>;
  countries: Record<string, number>;
  specific: Record<string, Record<string, number>>;
}

export const eventTypes = [
  { id: "wedding", label: "Wedding", labelAr: "زفاف" },
  { id: "corporate", label: "Corporate", labelAr: "شركات" },
  { id: "concert", label: "Concert", labelAr: "حفل" },
  { id: "festival", label: "Festival", labelAr: "مهرجان" },
  { id: "private", label: "Private Party", labelAr: "حفلة خاصة" }
];

export const countries = [
  { id: "sa", label: "Saudi Arabia", labelAr: "المملكة العربية السعودية" },
  { id: "ae", label: "UAE", labelAr: "الإمارات العربية المتحدة" },
  { id: "kw", label: "Kuwait", labelAr: "الكويت" },
  { id: "bh", label: "Bahrain", labelAr: "البحرين" },
  { id: "qa", label: "Qatar", labelAr: "قطر" },
  { id: "om", label: "Oman", labelAr: "عمان" },
  { id: "eg", label: "Egypt", labelAr: "مصر" },
  { id: "lb", label: "Lebanon", labelAr: "لبنان" },
  { id: "jo", label: "Jordan", labelAr: "الأردن" }
];

export const genres = [
  { id: "jazz_fusion", label: "Jazz Fusion", labelAr: "جاز فيوجن" },
  { id: "arabic_pop", label: "Arabic Pop", labelAr: "بوب عربي" },
  { id: "oud_master", label: "Oud Master", labelAr: "أستاذ العود" },
  { id: "electronic", label: "Electronic", labelAr: "إلكترونية" },
  { id: "folk_band", label: "Folk Band", labelAr: "فرقة فولك" },
  { id: "classical", label: "Classical", labelAr: "كلاسيكية" },
  { id: "hiphop", label: "Hip Hop", labelAr: "هيب هوب" }
];
