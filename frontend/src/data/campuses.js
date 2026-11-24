// Campus directory + helpers to localize the (Berkeley-written) mock data per campus.
//
// `landmarks` is positionally aligned with BASE_LANDMARKS below:
// [library, union, hall1, hall2, housing, engineering, stadium, science]

export const BASE_LANDMARKS = [
  'Moffitt Library',
  'MLK Student Union',
  'Unit 1',
  'Unit 2',
  'Clark Kerr',
  'Soda Hall',
  'Memorial Stadium',
  'Latimer Hall',
];

const c = (id, name, short, city, region, domain, sso, landmarks, extra = {}) => ({
  id,
  name,
  short,
  city,
  region,
  domain,
  sso,
  landmarks,
  label: `${short} • Main Campus`,
  ...extra,
});

export const CAMPUSES = [
  c('berkeley', 'UC Berkeley', 'UC Berkeley', 'Berkeley, CA', 'California', 'berkeley.edu', 'CalNet', BASE_LANDMARKS),
  c('ucla', 'UCLA', 'UCLA', 'Los Angeles, CA', 'California', 'ucla.edu', 'UCLA Logon',
    ['Powell Library', 'Ackerman Union', 'De Neve Commons', 'Hedrick Hall', 'Sunset Village', 'Boelter Hall', 'Pauley Pavilion', 'Young Hall']),
  c('stanford', 'Stanford University', 'Stanford', 'Stanford, CA', 'California', 'stanford.edu', 'Stanford WebLogin',
    ['Green Library', 'Tresidder Union', 'Wilbur Hall', 'Stern Hall', "Governor's Corner", 'Gates Building', 'Stanford Stadium', 'Mudd Chemistry Building']),
  c('mit', 'Massachusetts Institute of Technology', 'MIT', 'Cambridge, MA', 'Massachusetts', 'mit.edu', 'Touchstone',
    ['Hayden Library', 'Stratton Student Center', 'Maseeh Hall', 'Baker House', 'Simmons Hall', 'Stata Center', 'Briggs Field', 'Building 2']),
  c('harvard', 'Harvard University', 'Harvard', 'Cambridge, MA', 'Massachusetts', 'harvard.edu', 'HarvardKey',
    ['Lamont Library', 'Smith Campus Center', 'Annenberg Hall', 'Weld Hall', 'Quincy House', 'Science Center', 'Harvard Stadium', 'Sever Hall']),
  c('michigan', 'University of Michigan', 'Michigan', 'Ann Arbor, MI', 'Michigan', 'umich.edu', 'U-M Weblogin',
    ['Hatcher Graduate Library', 'Michigan Union', 'South Quad', 'East Quad', 'Mary Markley Hall', 'Beyster Building', 'Michigan Stadium', 'Chemistry Building']),
  c('utaustin', 'University of Texas at Austin', 'UT Austin', 'Austin, TX', 'Texas', 'utexas.edu', 'UT EID',
    ['Perry-Castañeda Library', 'Texas Union', 'Jester Center', 'Kinsolving Hall', 'Moore-Hill Hall', 'Gates Dell Complex', 'Royal-Memorial Stadium', 'Welch Hall']),
  c('tamu', 'Texas A&M University', 'Texas A&M', 'College Station, TX', 'Texas', 'tamu.edu', 'TAMU NetID',
    ['Evans Library', 'Memorial Student Center', 'Hullabaloo Hall', 'Aston Hall', 'Southside Commons', 'Zachry Engineering Center', 'Kyle Field', 'Heldenfels Hall']),
  c('nyu', 'New York University', 'NYU', 'New York, NY', 'New York', 'nyu.edu', 'NYU Login',
    ['Bobst Library', 'Kimmel Center', 'Palladium Hall', 'Founders Hall', 'Third North', 'Courant Institute', 'Coles Sports Center', 'Silver Center']),
  c('columbia', 'Columbia University', 'Columbia', 'New York, NY', 'New York', 'columbia.edu', 'Columbia UNI',
    ['Butler Library', 'Lerner Hall', 'Carman Hall', 'John Jay Hall', 'Hartley Hall', 'Mudd Building', 'Baker Athletics Complex', 'Havemeyer Hall']),
  c('cornell', 'Cornell University', 'Cornell', 'Ithaca, NY', 'New York', 'cornell.edu', 'Cornell NetID',
    ['Olin Library', 'Willard Straight Hall', 'Appel Commons', 'Balch Hall', 'North Campus Residential', 'Duffield Hall', 'Schoellkopf Stadium', 'Baker Laboratory']),
  c('gatech', 'Georgia Institute of Technology', 'Georgia Tech', 'Atlanta, GA', 'Georgia', 'gatech.edu', 'GT Login',
    ['Price Gilbert Library', 'Student Center', 'North Avenue Apartments', 'Woodruff Dorms', 'Glenn Hall', 'Klaus Advanced Computing Building', 'Bobby Dodd Stadium', 'Boggs Building']),
  c('uw', 'University of Washington', 'UW Seattle', 'Seattle, WA', 'Washington', 'uw.edu', 'UW NetID',
    ['Suzzallo Library', 'Husky Union Building', 'Alder Hall', 'McMahon Hall', 'Terry Hall', 'Paul G. Allen Center', 'Husky Stadium', 'Bagley Hall']),
  c('uiuc', 'University of Illinois Urbana-Champaign', 'UIUC', 'Urbana, IL', 'Illinois', 'illinois.edu', 'Illinois NetID',
    ['Grainger Library', 'Illini Union', 'Ikenberry Commons', 'Allen Hall', 'Busey-Evans Hall', 'Siebel Center', 'Memorial Stadium', 'Noyes Laboratory']),
  c('uchicago', 'University of Chicago', 'UChicago', 'Chicago, IL', 'Illinois', 'uchicago.edu', 'CNetID',
    ['Regenstein Library', 'Reynolds Club', 'Max Palevsky Commons', 'Burton-Judson Courts', 'Snell-Hitchcock', 'John Crerar Library', 'Stagg Field', 'Kent Chemical Laboratory']),
  c('purdue', 'Purdue University', 'Purdue', 'West Lafayette, IN', 'Indiana', 'purdue.edu', 'Purdue Career Account',
    ['Hicks Undergraduate Library', 'Purdue Memorial Union', 'Wiley Hall', 'Harrison Hall', 'Earhart Hall', 'Lawson Computer Science Building', 'Ross-Ade Stadium', 'Wetherill Laboratory']),
  c('osu', 'The Ohio State University', 'Ohio State', 'Columbus, OH', 'Ohio', 'osu.edu', 'name.# Login',
    ['Thompson Library', 'Ohio Union', 'Smith-Steeb Hall', 'Morrill Tower', 'Lincoln Tower', 'Dreese Laboratories', 'Ohio Stadium', 'McPherson Chemical Laboratory']),
  c('uf', 'University of Florida', 'UF', 'Gainesville, FL', 'Florida', 'ufl.edu', 'GatorLink',
    ['Marston Science Library', 'Reitz Union', 'Broward Hall', 'Rawlings Hall', 'Beaty Towers', 'Malachowsky Hall', 'Ben Hill Griffin Stadium', 'Leigh Hall']),
  c('duke', 'Duke University', 'Duke', 'Durham, NC', 'North Carolina', 'duke.edu', 'Duke NetID',
    ['Perkins Library', 'Bryan Center', 'Edens Quad', 'Craven Quad', 'Few Quad', 'Fitzpatrick CIEMAS', 'Wallace Wade Stadium', 'French Family Science Center']),
  c('asu', 'Arizona State University', 'ASU', 'Tempe, AZ', 'Arizona', 'asu.edu', 'ASURITE',
    ['Hayden Library', 'Memorial Union', 'Tooker House', 'Manzanita Hall', 'Palo Verde Residence', 'Goldwater Center', 'Sun Devil Stadium', 'Life Sciences Building']),

  // International
  c('utoronto', 'University of Toronto', 'U of T', 'Toronto, ON', 'Canada', 'utoronto.ca', 'UTORid',
    ['Robarts Library', 'Hart House', 'Chestnut Residence', 'New College Residence', 'Graduate House', 'Bahen Centre', 'Varsity Stadium', 'Wallberg Building']),
  c('iitd', 'IIT Delhi', 'IIT Delhi', 'New Delhi', 'India', 'iitd.ac.in', 'IITD Webmail',
    ['Central Library', 'Student Activity Centre', 'Aravali Hostel', 'Nilgiri Hostel', 'Himadri Hostel', 'Bharti Building', 'Sports Complex', 'Department of Chemistry']),
  c('iitb', 'IIT Bombay', 'IIT Bombay', 'Mumbai', 'India', 'iitb.ac.in', 'LDAP Login',
    ['Central Library', 'Student Activity Centre', 'Hostel 1', 'Hostel 5', 'Hostel 12', 'KReSIT Building', 'Gymkhana Grounds', 'Department of Chemistry']),
  c('nus', 'National University of Singapore', 'NUS', 'Singapore', 'Singapore', 'nus.edu.sg', 'NUSNET',
    ['Central Library', 'Stephen Riady Centre', 'Raffles Hall', 'Kent Ridge Hall', 'Prince George’s Park Residences', 'COM1', 'University Sports Centre', 'Science Faculty']),
];

const GENERIC_LANDMARKS = [
  'Main Library',
  'Student Union',
  'North Residence Hall',
  'South Residence Hall',
  'Campus Housing Quad',
  'Engineering Building',
  'Campus Stadium',
  'Science Hall',
];

/** Build a campus object for a name typed by the user that is not in the directory. */
export function makeCustomCampus(rawName) {
  const name = rawName.trim().replace(/\s+/g, ' ');
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'custom';
  return {
    id: `custom-${slug}`,
    name,
    short: name,
    city: 'Custom campus',
    region: 'Added by you',
    domain: 'your-school.edu',
    sso: 'Campus SSO',
    landmarks: GENERIC_LANDMARKS,
    label: `${name} • Main Campus`,
    custom: true,
  };
}

/** Case/diacritic-insensitive match on name, short name, city, region, domain. */
export function matchesCampus(campus, query) {
  const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const q = norm(query).trim();
  if (!q) return true;
  const hay = norm([campus.name, campus.short, campus.city, campus.region, campus.domain].join(' '));
  return q.split(/\s+/).every((token) => hay.includes(token));
}

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Rewrites every string in `data` (listings, wanted requests, ...) so Berkeley-specific
 * names become the equivalent places at `campus`. Schema-agnostic: walks arrays/objects.
 */
export function localizeData(data, campus) {
  if (campus.id === 'berkeley') return data;

  const rules = [
    [/berkeley\.edu/g, campus.domain],
    // Longest landmark names first so "MLK Student Union" wins over "MLK".
    ...BASE_LANDMARKS.map((from, i) => [new RegExp(escapeRe(from), 'g'), campus.landmarks[i]]).sort(
      (a, b) => b[0].source.length - a[0].source.length
    ),
    [/UC Berkeley/g, campus.name],
    [/Berkeley/g, campus.short],
  ];

  const walk = (value) => {
    if (typeof value === 'string') return rules.reduce((s, [re, to]) => s.replace(re, to), value);
    if (Array.isArray(value)) return value.map(walk);
    if (value && typeof value === 'object') {
      return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, walk(v)]));
    }
    return value;
  };

  return walk(data);
}