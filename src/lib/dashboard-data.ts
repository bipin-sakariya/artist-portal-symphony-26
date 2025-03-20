
// Mock data for the dashboard

export type Artist = {
  id: string;
  name: string;
  nameAr: string;
  genre: string;
  genreAr: string;
  location: string;
  locationAr: string;
  profileImage: string;
  coverImage: string;
  bio: string;
  bioAr: string;
  approvalStatus: 'approved' | 'pending' | 'rejected';
  youtubeLinks: string[];
  instagramLink?: string;
  spotifyLink?: string;
  soundcloudLink?: string;
  minimumBid: number;
  currency: string;
  joinedAt: string;
  isVerified: boolean;
  isInternational: boolean;
  isPromoted: boolean;
};

export type BookingRequest = {
  id: string;
  artistId: string;
  artistName: string;
  artistNameAr: string;
  customerName: string;
  customerEmail: string;
  eventType: 'private' | 'corporate' | 'festival' | 'ticketed';
  eventDate: string;
  eventLocation: string;
  eventLocationAr: string;
  duration: number;
  capacity: number;
  budget: number;
  currency: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  createdAt: string;
  specialRequirements?: string;
  notes?: string;
};

export type AnalyticsDashboard = {
  totalBookingRequests: number;
  pendingBookingRequests: number;
  confirmedBookingRequests: number;
  rejectedBookingRequests: number;
  totalArtists: number;
  pendingArtistApprovals: number;
  activeUsers: number; // Added activeUsers property
  totalRevenue: number;
  currency: string;
  topArtists: Array<{
    id: string;
    name: string;
    nameAr: string;
    bookings: number;
    revenue: number;
  }>;
  mostRequestedGenres: Array<{
    genre: string;
    genreAr: string;
    count: number;
  }>;
  bookingTrend: Array<{
    date: string;
    count: number;
  }>;
};

export const artists: Artist[] = [
  {
    id: "1",
    name: "Alex Rivera",
    nameAr: "أليكس ريفيرا",
    genre: "Jazz Fusion",
    genreAr: "جاز فيوجن",
    location: "Dubai, UAE",
    locationAr: "دبي، الإمارات",
    profileImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    coverImage: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    bio: "Award-winning jazz saxophonist with over 10 years of performance experience at major venues across the Middle East.",
    bioAr: "عازف ساكسفون جاز حائز على جوائز مع أكثر من 10 سنوات من الخبرة في الأداء في أماكن كبرى في جميع أنحاء الشرق الأوسط.",
    approvalStatus: "approved",
    youtubeLinks: ["https://youtube.com/watch?v=123", "https://youtube.com/watch?v=456"],
    instagramLink: "https://instagram.com/alexrivera",
    spotifyLink: "https://open.spotify.com/artist/123",
    minimumBid: 5000,
    currency: "AED",
    joinedAt: "2023-06-15",
    isVerified: true,
    isInternational: false,
    isPromoted: true
  },
  {
    id: "2",
    name: "Layla Al Noor",
    nameAr: "ليلى النور",
    genre: "Arabic Pop",
    genreAr: "بوب عربي",
    location: "Beirut, Lebanon",
    locationAr: "بيروت، لبنان",
    profileImage: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    coverImage: "https://images.unsplash.com/photo-1501612780327-45045538702b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    bio: "Contemporary Arabic pop vocalist with a modern twist, blending traditional melodies with fresh production.",
    bioAr: "مغنية البوب العربي المعاصر بلمسة حديثة، تمزج الألحان التقليدية مع الإنتاج المنعش.",
    approvalStatus: "approved",
    youtubeLinks: ["https://youtube.com/watch?v=789"],
    instagramLink: "https://instagram.com/laylaalnoor",
    soundcloudLink: "https://soundcloud.com/laylaalnoor",
    minimumBid: 6500,
    currency: "USD",
    joinedAt: "2023-07-22",
    isVerified: true,
    isInternational: false,
    isPromoted: true
  },
  {
    id: "3",
    name: "Sami Hassan",
    nameAr: "سامي حسن",
    genre: "Oud Master",
    genreAr: "أستاذ العود",
    location: "Cairo, Egypt",
    locationAr: "القاهرة، مصر",
    profileImage: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    coverImage: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    bio: "Internationally recognized oud virtuoso with a repertoire spanning classical Arabic maqams and contemporary compositions.",
    bioAr: "عازف عود معروف دوليًا برصيد يمتد من المقامات العربية الكلاسيكية إلى التأليفات المعاصرة.",
    approvalStatus: "pending",
    youtubeLinks: ["https://youtube.com/watch?v=abc"],
    minimumBid: 3000,
    currency: "USD",
    joinedAt: "2023-09-05",
    isVerified: false,
    isInternational: false,
    isPromoted: false
  },
  {
    id: "4",
    name: "DJ Karim",
    nameAr: "دي جي كريم",
    genre: "Electronic",
    genreAr: "إلكترونية",
    location: "Riyadh, Saudi Arabia",
    locationAr: "الرياض، المملكة العربية السعودية",
    profileImage: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    coverImage: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    bio: "Progressive electronic DJ and producer with residencies at top clubs across the GCC, known for energetic sets.",
    bioAr: "دي جي ومنتج إلكتروني تقدمي مع إقامات في أفضل النوادي في دول مجلس التعاون الخليجي، معروف بمجموعاته المفعمة بالحيوية.",
    approvalStatus: "approved",
    youtubeLinks: ["https://youtube.com/watch?v=def"],
    instagramLink: "https://instagram.com/djkarim",
    soundcloudLink: "https://soundcloud.com/djkarim",
    minimumBid: 8000,
    currency: "SAR",
    joinedAt: "2023-05-10",
    isVerified: true,
    isInternational: false,
    isPromoted: true
  },
  {
    id: "5",
    name: "The Desert Echoes",
    nameAr: "أصداء الصحراء",
    genre: "Folk Band",
    genreAr: "فرقة فولك",
    location: "Amman, Jordan",
    locationAr: "عمان، الأردن",
    profileImage: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    coverImage: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6a3?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    bio: "Five-piece ensemble blending traditional Bedouin music with contemporary arrangements, featuring indigenous instruments.",
    bioAr: "مجموعة من خمس قطع تمزج الموسيقى البدوية التقليدية مع الترتيبات المعاصرة، مع آلات محلية.",
    approvalStatus: "rejected",
    youtubeLinks: ["https://youtube.com/watch?v=ghi"],
    instagramLink: "https://instagram.com/desertechoes",
    minimumBid: 4500,
    currency: "JOD",
    joinedAt: "2023-08-17",
    isVerified: false,
    isInternational: false,
    isPromoted: false
  }
];

export const bookingRequests: BookingRequest[] = [
  {
    id: "1",
    artistId: "1",
    artistName: "Alex Rivera",
    artistNameAr: "أليكس ريفيرا",
    customerName: "Mohammed Al Hashimi",
    customerEmail: "mohammed@example.com",
    eventType: "corporate",
    eventDate: "2023-12-15",
    eventLocation: "Jumeirah Beach Hotel, Dubai",
    eventLocationAr: "فندق جميرا بيتش، دبي",
    duration: 2,
    capacity: 200,
    budget: 6000,
    currency: "AED",
    status: "pending",
    createdAt: "2023-11-01",
    specialRequirements: "Need a stage of at least 4x6 meters. Early setup by 3 PM required.",
    notes: "Annual corporate gala dinner"
  },
  {
    id: "2",
    artistId: "2",
    artistName: "Layla Al Noor",
    artistNameAr: "ليلى النور",
    customerName: "Sarah Mansour",
    customerEmail: "sarah@example.com",
    eventType: "private",
    eventDate: "2023-11-25",
    eventLocation: "Private Villa, Beirut",
    eventLocationAr: "فيلا خاصة، بيروت",
    duration: 1.5,
    capacity: 50,
    budget: 7000,
    currency: "USD",
    status: "approved",
    createdAt: "2023-10-15"
  },
  {
    id: "3",
    artistId: "4",
    artistName: "DJ Karim",
    artistNameAr: "دي جي كريم",
    customerName: "Royal Events Company",
    customerEmail: "bookings@royalevents.com",
    eventType: "festival",
    eventDate: "2024-01-20",
    eventLocation: "MDLBeast Festival, Riyadh",
    eventLocationAr: "مهرجان ميدل بيست، الرياض",
    duration: 3,
    capacity: 5000,
    budget: 15000,
    currency: "SAR",
    status: "pending",
    createdAt: "2023-11-05",
    notes: "Opening set for international headliner"
  },
  {
    id: "4",
    artistId: "1",
    artistName: "Alex Rivera",
    artistNameAr: "أليكس ريفيرا",
    customerName: "Zayed University",
    customerEmail: "events@zu.ac.ae",
    eventType: "corporate",
    eventDate: "2023-12-10",
    eventLocation: "Zayed University, Abu Dhabi",
    eventLocationAr: "جامعة زايد، أبو ظبي",
    duration: 1,
    capacity: 150,
    budget: 4500,
    currency: "AED",
    status: "rejected",
    createdAt: "2023-10-28"
  },
  {
    id: "5",
    artistId: "2",
    artistName: "Layla Al Noor",
    artistNameAr: "ليلى النور",
    customerName: "Beirut Spring Festival",
    customerEmail: "info@beirutspring.org",
    eventType: "ticketed",
    eventDate: "2024-03-15",
    eventLocation: "Beirut Waterfront",
    eventLocationAr: "واجهة بيروت البحرية",
    duration: 2,
    capacity: 800,
    budget: 12000,
    currency: "USD",
    status: "pending",
    createdAt: "2023-11-10",
    notes: "Headlining act for festival closing night"
  }
];

export const analyticsDashboard: AnalyticsDashboard = {
  totalBookingRequests: 87,
  pendingBookingRequests: 32,
  confirmedBookingRequests: 48,
  rejectedBookingRequests: 7,
  totalArtists: 24,
  pendingArtistApprovals: 5,
  activeUsers: 156, // Added activeUsers value
  totalRevenue: 358000,
  currency: "USD",
  topArtists: [
    {
      id: "2",
      name: "Layla Al Noor",
      nameAr: "ليلى النور",
      bookings: 12,
      revenue: 78000
    },
    {
      id: "4",
      name: "DJ Karim",
      nameAr: "دي جي كريم",
      bookings: 9,
      revenue: 72000
    },
    {
      id: "1",
      name: "Alex Rivera",
      nameAr: "أليكس ريفيرا",
      bookings: 8,
      revenue: 40000
    }
  ],
  mostRequestedGenres: [
    {
      genre: "Electronic",
      genreAr: "إلكترونية",
      count: 28
    },
    {
      genre: "Arabic Pop",
      genreAr: "بوب عربي",
      count: 22
    },
    {
      genre: "Jazz Fusion",
      genreAr: "جاز فيوجن",
      count: 15
    }
  ],
  bookingTrend: [
    { date: "2023-05", count: 4 },
    { date: "2023-06", count: 7 },
    { date: "2023-07", count: 9 },
    { date: "2023-08", count: 12 },
    { date: "2023-09", count: 18 },
    { date: "2023-10", count: 22 },
    { date: "2023-11", count: 15 }
  ]
};
