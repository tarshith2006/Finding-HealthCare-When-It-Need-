import { EmergencyOption } from '../types';

export const EMERGENCY_OPTIONS: EmergencyOption[] = [
  {
    id: 'accident',
    title: 'Accident & Physical Trauma',
    iconName: 'Car',
    description: 'Road accidents, severe fractures, blunt impact, heavy bleeding, or major injuries.',
    requiredServices: ['Emergency Department', 'Trauma Care', 'Orthopedics'],
    recommendedSpecialists: ['Trauma Surgeon', 'Orthopedic Surgeon', 'Emergency Physician'],
    urgentActionNote: 'Call local emergency services immediately if the victim is unresponsive or bleeding heavily. Do not move injured individuals unless in immediate danger.'
  },
  {
    id: 'heart',
    title: 'Heart Emergency',
    iconName: 'HeartPulse',
    description: 'Chest tightness, sudden crushing pain radiating to arm or jaw, shortness of breath.',
    requiredServices: ['Emergency Department', 'Cardiology', 'ICU'],
    recommendedSpecialists: ['Interventional Cardiologist', 'Cardiac ICU Specialist'],
    urgentActionNote: 'Time is muscle. Immediate transfer to a hospital with an active Cath Lab / Cardiology ICU is critical.'
  },
  {
    id: 'stroke',
    title: 'Stroke Symptoms',
    iconName: 'Brain',
    description: 'Sudden facial droop, arm or leg weakness on one side, slurred speech, confusion (FAST).',
    requiredServices: ['Emergency Department', 'Neurology', 'ICU'],
    recommendedSpecialists: ['Neurologist', 'Neurosurgeon', 'Critical Care Specialist'],
    urgentActionNote: 'Note the exact time symptoms started. Stroke treatments (like thrombolytics) must be given within a narrow time window.'
  },
  {
    id: 'pregnancy',
    title: 'Pregnancy Emergency',
    iconName: 'Baby',
    description: 'Sudden severe abdominal pain, premature labor signs, heavy bleeding, reduced fetal movement.',
    requiredServices: ['Emergency Department', 'Gynecology', 'Pediatrics'],
    recommendedSpecialists: ['Obstetrician & Gynecologist', 'Neonatologist'],
    urgentActionNote: 'Keep the patient calm and seated or lying on their left side. Transport quickly to a maternity-equipped facility.'
  },
  {
    id: 'burns',
    title: 'Burn Injury',
    iconName: 'Flame',
    description: 'Thermal, chemical, or electrical burns causing blistering, tissue charring, or large surface coverage.',
    requiredServices: ['Emergency Department', 'Burn Care', 'Trauma Care'],
    recommendedSpecialists: ['Burn Care Specialist', 'Plastic & Reconstructive Surgeon'],
    urgentActionNote: 'Cool burns under clean running room-temperature water for 10-20 minutes. Do not apply ice, butter, or paste.'
  },
  {
    id: 'general',
    title: 'General Medical Emergency',
    iconName: 'ShieldAlert',
    description: 'High unyielding fever with convulsions, sudden collapse, severe allergic reaction, or acute abdominal distress.',
    requiredServices: ['Emergency Department', 'General Medicine'],
    recommendedSpecialists: ['Emergency Medicine Specialist', 'General Physician'],
    urgentActionNote: 'Ensure clear airways. If breathing is restricted or anaphylaxis is suspected, seek the nearest operational emergency department.'
  }
];
