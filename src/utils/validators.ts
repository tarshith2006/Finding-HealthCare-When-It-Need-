import { BloodGroup, EmergencyCategory, ServiceName } from '../types';

export function validateEmergencySelection(type: string): { isValid: boolean; message?: string } {
  if (!type || type.trim() === '') {
    return { isValid: false, message: 'Please select an emergency type.' };
  }
  const validTypes: EmergencyCategory[] = [
    'accident',
    'heart',
    'stroke',
    'pregnancy',
    'burns',
    'general'
  ];
  if (!validTypes.includes(type as EmergencyCategory)) {
    return { isValid: false, message: 'Invalid emergency category selected.' };
  }
  return { isValid: true };
}

export function validateBloodGroup(group: string): { isValid: boolean; message?: string } {
  if (!group || group.trim() === '') {
    return { isValid: false, message: 'Please select a blood group.' };
  }
  const validGroups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
  if (!validGroups.includes(group as BloodGroup)) {
    return { isValid: false, message: 'Please choose a valid blood group.' };
  }
  return { isValid: true };
}

export function validateService(service: string): { isValid: boolean; message?: string } {
  if (!service || service.trim() === '') {
    return { isValid: false, message: 'Please select a required service.' };
  }
  return { isValid: true };
}

export function sanitizeSearchQuery(query: string): string {
  if (!query) return '';
  return query.replace(/[<>'"\\/]/g, '').trim().slice(0, 80);
}
