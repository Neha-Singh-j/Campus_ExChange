// Campus configuration. This deployment serves ONE campus, chosen with VITE_CAMPUS_ID
// (default "gla"); it must match CAMPUS_ID in the backend .env.
//
// To run Campus Exchange for another university, add an entry below, set VITE_CAMPUS_ID,
// and set CAMPUS_ID + ALLOWED_EMAIL_DOMAINS in the backend.
//
// NOTE: the meetup spots are generic placeholders - replace them with the real, safe,
// well-lit places on your campus.

export const CAMPUSES = [
  {
    id: 'gla',
    name: 'GLA University',
    short: 'GLA',
    city: 'Mathura, Uttar Pradesh',
    region: 'India',
    domain: 'gla.ac.in',
    currency: '₹',
    label: 'GLA University • Main Campus',
    meetupSpots: [
      'Central Library entrance',
      'Main Gate security desk',
      'Admin block lobby',
      'Canteen / food court',
      'Hostel gate',
    ],
  },
];

export const DEFAULT_CAMPUS_ID = import.meta.env?.VITE_CAMPUS_ID || 'gla';
