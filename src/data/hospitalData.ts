import { Hospital, UserLocation, Doctor } from '../types';

export const HOSPITALS_DATA: Hospital[] = [
  {
    id: 1,
    name: 'City Care Multi-Specialty Hospital',
    category: 'Multi-Specialty',
    address: '104 Healthcare Boulevard, Central District',
    locality: 'Central City',
    latitude: 12.9716,
    longitude: 77.5946,
    phone: '+1 (555) 234-5670',
    emergencyPhone: '+1 (555) 911-0101',
    emergencyAvailable: true,
    services: [
      'Emergency Department',
      'Cardiology',
      'Neurology',
      'Trauma Care',
      'General Medicine',
      'ICU'
    ],
    specialists: [
      'Senior Interventional Cardiologist',
      'Consultant Neurologist',
      'Trauma & Critical Care Lead'
    ],
    doctors: [
      {
        id: 'doc-101',
        name: 'Dr. Rajesh V. Nair',
        field: 'Cardiology (Interventional & Coronary Care)',
        qualification: 'MD, DM (Cardiology), FACC',
        experienceYears: 18,
        availabilityStatus: 'On Duty',
        shiftHours: '24/7 Emergency Roster'
      },
      {
        id: 'doc-102',
        name: 'Dr. Ananya Sengupta',
        field: 'Neurology (Stroke & Neurovascular)',
        qualification: 'MD, DM (Neurology)',
        experienceYears: 14,
        availabilityStatus: 'Available Today',
        shiftHours: '08:00 - 20:00'
      },
      {
        id: 'doc-103',
        name: 'Dr. Vikramaditya Rao',
        field: 'Trauma & Critical Care Surgery',
        qualification: 'MS (Gen Surg), MCh (Trauma)',
        experienceYears: 16,
        availabilityStatus: 'In Emergency Bay',
        shiftHours: 'Active Trauma Shift'
      },
      {
        id: 'doc-104',
        name: 'Dr. Meera Nambiar',
        field: 'General Internal Medicine & ICU',
        qualification: 'MD (Internal Medicine), EDIC',
        experienceYears: 12,
        availabilityStatus: 'On Duty',
        shiftHours: 'Day & Triage Shift'
      }
    ],
    bloodAvailability: {
      'O+': 'Available',
      'A+': 'Available',
      'B+': 'Available',
      'AB+': 'Limited',
      'O-': 'Limited',
      'A-': 'Currently Unavailable',
      'B-': 'Available',
      'AB-': 'Contact to Confirm'
    },
    rating: 4.8,
    totalBeds: 450,
    icuAvailable: true,
    isDemoData: true
  },
  {
    id: 2,
    name: 'Metro Trauma & Emergency Medical Center',
    category: 'Emergency & Trauma',
    address: '45 Expressway Junction, North Corridor',
    locality: 'North Metro',
    latitude: 12.9860,
    longitude: 77.5990,
    phone: '+1 (555) 345-6781',
    emergencyPhone: '+1 (555) 911-0102',
    emergencyAvailable: true,
    services: [
      'Emergency Department',
      'Trauma Care',
      'Orthopedics',
      'Burn Care',
      'General Medicine',
      'ICU'
    ],
    specialists: [
      'Chief Trauma Surgeon',
      'Orthopedic Reconstruction Lead',
      'Burn Unit Specialist'
    ],
    doctors: [
      {
        id: 'doc-201',
        name: 'Dr. Siddharth Verma',
        field: 'Emergency & Acute Trauma Surgery',
        qualification: 'MS (General Surgery), FACS',
        experienceYears: 19,
        availabilityStatus: 'In Emergency Bay',
        shiftHours: '24/7 Trauma Desk'
      },
      {
        id: 'doc-202',
        name: 'Dr. Rohan Kulkarni',
        field: 'Orthopedics (Complex Fracture & Joint)',
        qualification: 'MS (Orthopedics), DNB',
        experienceYears: 15,
        availabilityStatus: 'On Duty',
        shiftHours: '09:00 - 21:00'
      },
      {
        id: 'doc-203',
        name: 'Dr. Shalini Deshmukh',
        field: 'Burn Care & Microvascular Surgery',
        qualification: 'MS, MCh (Plastic & Reconstructive)',
        experienceYears: 13,
        availabilityStatus: 'Available Today',
        shiftHours: 'On-Call Specialist'
      },
      {
        id: 'doc-204',
        name: 'Dr. Arvind Swaminathan',
        field: 'Critical Care & Resuscitation Medicine',
        qualification: 'MD (Emergency Medicine), FCCP',
        experienceYears: 11,
        availabilityStatus: 'On Duty',
        shiftHours: 'Night & Resuscitation Desk'
      }
    ],
    bloodAvailability: {
      'O+': 'Available',
      'A+': 'Available',
      'B+': 'Available',
      'AB+': 'Available',
      'O-': 'Available',
      'A-': 'Limited',
      'B-': 'Limited',
      'AB-': 'Currently Unavailable'
    },
    rating: 4.7,
    totalBeds: 380,
    icuAvailable: true,
    isDemoData: true
  },
  {
    id: 3,
    name: 'St. Jude Heart & Vascular Institute',
    category: 'Super-Specialty',
    address: '88 Cardiology Avenue, MedTech Park',
    locality: 'East Park',
    latitude: 12.9550,
    longitude: 77.6200,
    phone: '+1 (555) 456-7892',
    emergencyPhone: '+1 (555) 911-0103',
    emergencyAvailable: true,
    services: [
      'Emergency Department',
      'Cardiology',
      'ICU',
      'General Medicine'
    ],
    specialists: [
      'Cardiothoracic Surgeon',
      'Chief of Cath Lab',
      'Heart Failure Specialist'
    ],
    doctors: [
      {
        id: 'doc-301',
        name: 'Dr. Marcus Vance',
        field: 'Cardiology (Interventional & Angioplasty)',
        qualification: 'MD, FACC, FSCAI',
        experienceYears: 22,
        availabilityStatus: 'On Duty',
        shiftHours: 'Cath Lab Priority Desk'
      },
      {
        id: 'doc-302',
        name: 'Dr. Elena Rostova',
        field: 'Cardiothoracic & Vascular Surgery (CTVS)',
        qualification: 'MD, FACS (Cardiothoracic)',
        experienceYears: 17,
        availabilityStatus: 'In Emergency Bay',
        shiftHours: 'Emergency Surgical Roster'
      },
      {
        id: 'doc-303',
        name: 'Dr. David Chen',
        field: 'Cardiology (Heart Failure & Electrophysiology)',
        qualification: 'MD, FESC',
        experienceYears: 14,
        availabilityStatus: 'Available Today',
        shiftHours: '08:30 - 18:30'
      },
      {
        id: 'doc-304',
        name: 'Dr. Preeti Sundaram',
        field: 'Cardiac Intensive Care & Echocardiography',
        qualification: 'MD (Anesthesia & Critical Care)',
        experienceYears: 12,
        availabilityStatus: 'On Duty',
        shiftHours: 'CCU Rounding Shift'
      }
    ],
    bloodAvailability: {
      'O+': 'Available',
      'A+': 'Available',
      'B+': 'Limited',
      'AB+': 'Currently Unavailable',
      'O-': 'Limited',
      'A-': 'Contact to Confirm',
      'B-': 'Available',
      'AB-': 'Currently Unavailable'
    },
    rating: 4.9,
    totalBeds: 260,
    icuAvailable: true,
    isDemoData: true
  },
  {
    id: 4,
    name: 'Apex Brain & Neurosciences Hospital',
    category: 'Super-Specialty',
    address: '12 Neuro Circle, Innovation District',
    locality: 'Tech Zone',
    latitude: 12.9400,
    longitude: 77.6100,
    phone: '+1 (555) 567-8903',
    emergencyPhone: '+1 (555) 911-0104',
    emergencyAvailable: true,
    services: [
      'Emergency Department',
      'Neurology',
      'ICU',
      'General Medicine'
    ],
    specialists: [
      'Stroke Interventionist',
      'Pediatric Neurologist',
      'Neuro-Intensivist'
    ],
    doctors: [
      {
        id: 'doc-401',
        name: 'Dr. Farhan Akhtar',
        field: 'Neurology (Acute Stroke & Thrombolysis)',
        qualification: 'MD, DM (Neurology), FINR',
        experienceYears: 16,
        availabilityStatus: 'In Emergency Bay',
        shiftHours: 'Code Stroke Response Lead'
      },
      {
        id: 'doc-402',
        name: 'Dr. Natasha Roy',
        field: 'Neurosurgery (Cerebrovascular & Skull Base)',
        qualification: 'MCh (Neurosurgery), IFAANS',
        experienceYears: 18,
        availabilityStatus: 'On Duty',
        shiftHours: 'Neuro-Trauma Desk'
      },
      {
        id: 'doc-403',
        name: 'Dr. K. Radhakrishnan',
        field: 'Neuro-Critical Care & Coma Management',
        qualification: 'MD, DM (Neuro-Intensive Care)',
        experienceYears: 14,
        availabilityStatus: 'Available Today',
        shiftHours: '08:00 - 20:00'
      },
      {
        id: 'doc-404',
        name: 'Dr. Sunita Menon',
        field: 'Pediatric Neurology & Epilepsy Care',
        qualification: 'MD, DCH (Pediatrics), Fellowship in Neuro',
        experienceYears: 11,
        availabilityStatus: 'On Call',
        shiftHours: 'Specialist Consultation Roster'
      }
    ],
    bloodAvailability: {
      'O+': 'Available',
      'A+': 'Limited',
      'B+': 'Available',
      'AB+': 'Contact to Confirm',
      'O-': 'Currently Unavailable',
      'A-': 'Available',
      'B-': 'Limited',
      'AB-': 'Available'
    },
    rating: 4.6,
    totalBeds: 210,
    icuAvailable: true,
    isDemoData: true
  },
  {
    id: 5,
    name: 'Grace Mother & Child Maternity Hospital',
    category: 'Super-Specialty',
    address: '77 Cradle Walk, South Greens',
    locality: 'South Ridge',
    latitude: 12.9300,
    longitude: 77.5800,
    phone: '+1 (555) 678-9014',
    emergencyPhone: '+1 (555) 911-0105',
    emergencyAvailable: true,
    services: [
      'Emergency Department',
      'Gynecology',
      'Pediatrics',
      'ICU'
    ],
    specialists: [
      'High-Risk Obstetrician',
      'Neonatal Intensive Care Specialist',
      'Fetal Medicine Specialist'
    ],
    doctors: [
      {
        id: 'doc-501',
        name: 'Dr. Gayatri Devi',
        field: 'Gynecology & High-Risk Obstetrics',
        qualification: 'MD, DGO, FICOG',
        experienceYears: 21,
        availabilityStatus: 'On Duty',
        shiftHours: 'Labor & Delivery Triage'
      },
      {
        id: 'doc-502',
        name: 'Dr. Arthur Pendelton',
        field: 'Pediatrics (Neonatal Intensive Care NICU)',
        qualification: 'MD (Pediatrics), DM (Neonatology)',
        experienceYears: 15,
        availabilityStatus: 'In Emergency Bay',
        shiftHours: 'NICU Critical Response'
      },
      {
        id: 'doc-503',
        name: 'Dr. Sangeetha Bhatt',
        field: 'Maternal-Fetal Medicine & Perinatology',
        qualification: 'MD, MRCOG (UK)',
        experienceYears: 13,
        availabilityStatus: 'Available Today',
        shiftHours: '09:00 - 19:00'
      },
      {
        id: 'doc-504',
        name: 'Dr. Rahul Saxena',
        field: 'Pediatrics & Pediatric Emergency',
        qualification: 'MD (Pediatrics), IAP Intensive Care',
        experienceYears: 10,
        availabilityStatus: 'On Duty',
        shiftHours: 'Pediatric Emergency Desk'
      }
    ],
    bloodAvailability: {
      'O+': 'Available',
      'A+': 'Available',
      'B+': 'Available',
      'AB+': 'Available',
      'O-': 'Available',
      'A-': 'Available',
      'B-': 'Limited',
      'AB-': 'Limited'
    },
    rating: 4.9,
    totalBeds: 190,
    icuAvailable: true,
    isDemoData: true
  },
  {
    id: 6,
    name: 'Phoenix Burn & Reconstructive Center',
    category: 'Super-Specialty',
    address: '22 Recovery Way, West Industrial Link',
    locality: 'Westside',
    latitude: 12.9650,
    longitude: 77.5500,
    phone: '+1 (555) 789-0125',
    emergencyPhone: '+1 (555) 911-0106',
    emergencyAvailable: true,
    services: [
      'Emergency Department',
      'Burn Care',
      'Trauma Care',
      'ICU'
    ],
    specialists: [
      'Burn Unit Intensivist',
      'Plastic & Microvascular Surgeon',
      'Wound Care Specialist'
    ],
    doctors: [
      {
        id: 'doc-601',
        name: 'Dr. Tariq Al-Mansoor',
        field: 'Burn Care & Plastic Reconstruction',
        qualification: 'MS, MCh (Plastic Surgery), ISBI',
        experienceYears: 20,
        availabilityStatus: 'In Emergency Bay',
        shiftHours: 'Acute Burn Resuscitation Lead'
      },
      {
        id: 'doc-602',
        name: 'Dr. Kavita Krishnan',
        field: 'Critical Care & Inhalation Injury Medicine',
        qualification: 'MD (Anesthesia & Critical Care)',
        experienceYears: 14,
        availabilityStatus: 'On Duty',
        shiftHours: 'Burn ICU Supervision'
      },
      {
        id: 'doc-603',
        name: 'Dr. Neil Robertson',
        field: 'Wound Care & Microvascular Surgery',
        qualification: 'MD, DNB (Plastic Surgery)',
        experienceYears: 12,
        availabilityStatus: 'Available Today',
        shiftHours: '09:00 - 18:00'
      }
    ],
    bloodAvailability: {
      'O+': 'Limited',
      'A+': 'Available',
      'B+': 'Available',
      'AB+': 'Currently Unavailable',
      'O-': 'Contact to Confirm',
      'A-': 'Currently Unavailable',
      'B-': 'Available',
      'AB-': 'Currently Unavailable'
    },
    rating: 4.5,
    totalBeds: 140,
    icuAvailable: true,
    isDemoData: true
  },
  {
    id: 7,
    name: 'District General Public Hospital',
    category: 'Government',
    address: '3 Civic Center Road, Old Quarter',
    locality: 'Old Town',
    latitude: 12.9750,
    longitude: 77.5700,
    phone: '+1 (555) 890-1236',
    emergencyPhone: '+1 (555) 911-0107',
    emergencyAvailable: true,
    services: [
      'Emergency Department',
      'General Medicine',
      'Orthopedics',
      'Pediatrics',
      'ICU'
    ],
    specialists: [
      'General Surgery Consultant',
      'Internal Medicine Physician',
      'Pediatric Emergency Officer'
    ],
    doctors: [
      {
        id: 'doc-701',
        name: 'Dr. Harish Chandra',
        field: 'General Surgery & Emergency Polytrauma',
        qualification: 'MS (General Surgery), FAIS',
        experienceYears: 24,
        availabilityStatus: 'On Duty',
        shiftHours: 'Public Emergency Casualty Head'
      },
      {
        id: 'doc-702',
        name: 'Dr. Anita Joshi',
        field: 'General Internal Medicine & Infectious Diseases',
        qualification: 'MD (Medicine)',
        experienceYears: 17,
        availabilityStatus: 'Available Today',
        shiftHours: '08:00 - 18:00'
      },
      {
        id: 'doc-703',
        name: 'Dr. Suresh Babu',
        field: 'Orthopedics (Fracture & Trauma Clinic)',
        qualification: 'MS (Orthopedics)',
        experienceYears: 15,
        availabilityStatus: 'In Emergency Bay',
        shiftHours: 'Casualty Ortho Roster'
      },
      {
        id: 'doc-704',
        name: 'Dr. Deepa Thomas',
        field: 'Pediatrics & Neonatal Care',
        qualification: 'MD (Pediatrics)',
        experienceYears: 12,
        availabilityStatus: 'On Duty',
        shiftHours: 'Pediatric Casualty Duty'
      }
    ],
    bloodAvailability: {
      'O+': 'Available',
      'A+': 'Available',
      'B+': 'Available',
      'AB+': 'Available',
      'O-': 'Available',
      'A-': 'Available',
      'B-': 'Available',
      'AB-': 'Available'
    },
    rating: 4.2,
    totalBeds: 600,
    icuAvailable: true,
    isDemoData: true
  },
  {
    id: 8,
    name: 'Valley Community Health & Day Clinic',
    category: 'Multi-Specialty',
    address: '15 Meadow Park Drive, Suburb East',
    locality: 'Green Valley',
    latitude: 12.9950,
    longitude: 77.6400,
    phone: '+1 (555) 901-2347',
    emergencyPhone: undefined,
    emergencyAvailable: false, // Intentionally false to demonstrate filtering
    services: [
      'General Medicine',
      'Pediatrics',
      'Orthopedics'
    ],
    specialists: [
      'Family Medicine Physician',
      'Outpatient Pediatrician'
    ],
    doctors: [
      {
        id: 'doc-801',
        name: 'Dr. Christine Morris',
        field: 'General Medicine & Family Practice',
        qualification: 'MD (Family Medicine)',
        experienceYears: 16,
        availabilityStatus: 'Available Today',
        shiftHours: 'Day Clinic (09:00 - 17:00)'
      },
      {
        id: 'doc-802',
        name: 'Dr. Robert Kim',
        field: 'Pediatrics (Outpatient & Immunization)',
        qualification: 'MD (Pediatrics)',
        experienceYears: 12,
        availabilityStatus: 'Available Today',
        shiftHours: 'Day Clinic (09:00 - 16:30)'
      },
      {
        id: 'doc-803',
        name: 'Dr. Amit Parekh',
        field: 'Orthopedics (Outpatient Joint & Spine)',
        qualification: 'MBBS, D.Ortho',
        experienceYears: 9,
        availabilityStatus: 'On Call',
        shiftHours: 'Weekly Clinic Consultation'
      }
    ],
    bloodAvailability: {
      'O+': 'Currently Unavailable',
      'A+': 'Limited',
      'B+': 'Currently Unavailable',
      'AB+': 'Currently Unavailable',
      'O-': 'Currently Unavailable',
      'A-': 'Currently Unavailable',
      'B-': 'Currently Unavailable',
      'AB-': 'Currently Unavailable'
    },
    rating: 4.3,
    totalBeds: 40,
    icuAvailable: false,
    isDemoData: true
  },
  {
    id: 9,
    name: 'Pinnacle Bone & Joint Orthopedic Center',
    category: 'Super-Specialty',
    address: '60 Spine Ridge Road, Health Corridor',
    locality: 'Midtown',
    latitude: 12.9600,
    longitude: 77.5850,
    phone: '+1 (555) 012-3458',
    emergencyPhone: '+1 (555) 911-0109',
    emergencyAvailable: true,
    services: [
      'Emergency Department',
      'Orthopedics',
      'Trauma Care',
      'General Medicine'
    ],
    specialists: [
      'Orthopedic Trauma Surgeon',
      'Spine Specialist',
      'Sports Injury Specialist'
    ],
    doctors: [
      {
        id: 'doc-901',
        name: 'Dr. Vijay Raghavan',
        field: 'Orthopedics (Trauma & Joint Reconstruction)',
        qualification: 'MS (Orthopedics), MCh, FRCS',
        experienceYears: 23,
        availabilityStatus: 'In Emergency Bay',
        shiftHours: 'Emergency Ortho Surgery Desk'
      },
      {
        id: 'doc-902',
        name: 'Dr. Sandeep K. Hegde',
        field: 'Orthopedics (Spine Surgery & Spinal Trauma)',
        qualification: 'MS (Ortho), FNB (Spine Surgery)',
        experienceYears: 16,
        availabilityStatus: 'On Duty',
        shiftHours: 'Spine Trauma Protocol Lead'
      },
      {
        id: 'doc-903',
        name: 'Dr. Rachel Adams',
        field: 'Orthopedics (Sports Medicine & Arthroscopy)',
        qualification: 'MD (Sports Medicine), Fellowship Arthroscopy',
        experienceYears: 11,
        availabilityStatus: 'Available Today',
        shiftHours: '08:30 - 17:30'
      }
    ],
    bloodAvailability: {
      'O+': 'Available',
      'A+': 'Available',
      'B+': 'Limited',
      'AB+': 'Limited',
      'O-': 'Contact to Confirm',
      'A-': 'Limited',
      'B-': 'Available',
      'AB-': 'Currently Unavailable'
    },
    rating: 4.7,
    totalBeds: 180,
    icuAvailable: true,
    isDemoData: true
  },
  {
    id: 10,
    name: 'Mercy Integrated Urgent Care Center',
    category: 'Multi-Specialty',
    address: '92 Riverside Avenue, Harbor District',
    locality: 'Harbor City',
    latitude: 12.9800,
    longitude: 77.6300,
    phone: '+1 (555) 123-4569',
    emergencyPhone: '+1 (555) 911-0110',
    emergencyAvailable: true,
    services: [
      'Emergency Department',
      'General Medicine',
      'Cardiology',
      'Pediatrics'
    ],
    specialists: [
      'Urgent Care Specialist',
      'Cardiologist on Call',
      'General Physician'
    ],
    doctors: [
      {
        id: 'doc-1001',
        name: 'Dr. Kenneth O\'Connor',
        field: 'General Medicine & Urgent Care Triage',
        qualification: 'MD (Emergency Medicine)',
        experienceYears: 15,
        availabilityStatus: 'On Duty',
        shiftHours: 'Urgent Care Walk-In Lead'
      },
      {
        id: 'doc-1002',
        name: 'Dr. Divya Ranganathan',
        field: 'Cardiology (Acute Chest Pain & ECG Assessment)',
        qualification: 'MD, DM (Cardiology)',
        experienceYears: 13,
        availabilityStatus: 'On Duty',
        shiftHours: 'Observation & Telemetry Shift'
      },
      {
        id: 'doc-1003',
        name: 'Dr. Samuel Ward',
        field: 'General Medicine & Ambulatory Care',
        qualification: 'MD (Internal Medicine)',
        experienceYears: 11,
        availabilityStatus: 'Available Today',
        shiftHours: '09:00 - 19:00'
      }
    ],
    bloodAvailability: {
      'O+': 'Available',
      'A+': 'Limited',
      'B+': 'Available',
      'AB+': 'Available',
      'O-': 'Limited',
      'A-': 'Currently Unavailable',
      'B-': 'Limited',
      'AB-': 'Contact to Confirm'
    },
    rating: 4.4,
    totalBeds: 150,
    icuAvailable: true,
    isDemoData: true
  }
];

const LOCAL_OFFSET_PATTERNS = [
  { dLat: 0.0085, dLon: 0.0075, areaSuffix: 'Central' },
  { dLat: 0.0160, dLon: -0.0060, areaSuffix: 'North Corridor' },
  { dLat: -0.0120, dLon: 0.0210, areaSuffix: 'East District' },
  { dLat: -0.0220, dLon: -0.0140, areaSuffix: 'South Belt' },
  { dLat: 0.0060, dLon: -0.0310, areaSuffix: 'Westside' },
  { dLat: -0.0340, dLon: 0.0120, areaSuffix: 'South Central' },
  { dLat: 0.0380, dLon: 0.0160, areaSuffix: 'North Expressway' },
  { dLat: -0.0450, dLon: 0.0320, areaSuffix: 'South-East' },
  { dLat: 0.0520, dLon: 0.0420, areaSuffix: 'Technology Park' },
  { dLat: 0.0480, dLon: -0.0580, areaSuffix: 'West Ridge' }
];

/**
 * Returns hospitals dynamically localized around the user's active coordinates.
 * When the user is at their real GPS location or a searched city, facilities are anchored
 * within realistic proximity (1.2 to 8.8 km) with localized addresses so driving ETAs and navigation routes work accurately.
 */
export function getHospitalsForLocation(userLocation: UserLocation | null): Hospital[] {
  if (!userLocation || typeof userLocation.latitude !== 'number' || typeof userLocation.longitude !== 'number') {
    return HOSPITALS_DATA;
  }

  const { latitude, longitude, label, city } = userLocation;

  // Check if coordinates match the default central Bangalore prototype zone (within ~16km)
  const isDefaultBangalore =
    Math.abs(latitude - 12.9716) < 0.15 &&
    Math.abs(longitude - 77.5946) < 0.15;

  if (isDefaultBangalore) {
    return HOSPITALS_DATA;
  }

  const locationTag = city || label?.split(',')[0]?.trim() || 'Regional';

  return HOSPITALS_DATA.map((hospital, index) => {
    const pattern = LOCAL_OFFSET_PATTERNS[index % LOCAL_OFFSET_PATTERNS.length];

    const latCos = Math.max(0.2, Math.cos((latitude * Math.PI) / 180));
    const targetLat = latitude + pattern.dLat;
    const targetLon = longitude + pattern.dLon / latCos;

    return {
      ...hospital,
      latitude: Math.round(targetLat * 10000) / 10000,
      longitude: Math.round(targetLon * 10000) / 10000,
      locality: `${pattern.areaSuffix}, ${locationTag}`,
      address: `${hospital.address.split(',')[0]}, ${pattern.areaSuffix}, ${locationTag}`
    };
  });
}

