import { Hospital } from '../types';

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
