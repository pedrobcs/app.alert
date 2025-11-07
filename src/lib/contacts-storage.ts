/**
 * Client-side contacts storage using localStorage
 * No backend required
 */

export interface StoredContact {
  id: string;
  name: string;
  phone: string;
  method: 'sms' | 'whatsapp' | 'both';
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'safealert_contacts';

/**
 * Get all contacts from localStorage
 */
export function getContacts(): StoredContact[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored) as StoredContact[];
  } catch (error) {
    console.error('Failed to load contacts:', error);
    return [];
  }
}

/**
 * Save contact to localStorage
 */
export function saveContact(
  contact: Omit<StoredContact, 'id' | 'createdAt' | 'updatedAt'>
): StoredContact {
  const contacts = getContacts();
  
  const newContact: StoredContact = {
    ...contact,
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  contacts.push(newContact);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
  
  return newContact;
}

/**
 * Update existing contact
 */
export function updateContact(
  id: string,
  updates: Partial<Omit<StoredContact, 'id' | 'createdAt' | 'updatedAt'>>
): StoredContact | null {
  const contacts = getContacts();
  const index = contacts.findIndex(c => c.id === id);
  
  if (index === -1) return null;
  
  contacts[index] = {
    ...contacts[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
  return contacts[index];
}

/**
 * Delete contact
 */
export function deleteContact(id: string): boolean {
  const contacts = getContacts();
  const filtered = contacts.filter(c => c.id !== id);
  
  if (filtered.length === contacts.length) return false;
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return true;
}

/**
 * Get contact by ID
 */
export function getContactById(id: string): StoredContact | null {
  const contacts = getContacts();
  return contacts.find(c => c.id === id) || null;
}

/**
 * Get primary contacts (for quick access)
 */
export function getPrimaryContacts(): StoredContact[] {
  return getContacts().filter(c => c.isPrimary);
}

/**
 * Set contact as primary
 */
export function setPrimaryContact(id: string, isPrimary: boolean): boolean {
  return !!updateContact(id, { isPrimary });
}

/**
 * Import contacts from JSON
 */
export function importContacts(contacts: Partial<StoredContact>[]): number {
  let imported = 0;
  
  contacts.forEach(contact => {
    if (contact.name && contact.phone) {
      saveContact({
        name: contact.name,
        phone: contact.phone,
        method: contact.method || 'both',
        isPrimary: contact.isPrimary || false,
      });
      imported++;
    }
  });
  
  return imported;
}

/**
 * Export contacts to JSON
 */
export function exportContacts(): string {
  const contacts = getContacts();
  return JSON.stringify(contacts, null, 2);
}

/**
 * Clear all contacts
 */
export function clearAllContacts(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Generate unique ID
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Validate phone number format
 */
export function isValidPhone(phone: string): boolean {
  // Basic validation - at least 10 digits
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 10;
}

/**
 * Format phone number for display
 */
export function formatPhoneDisplay(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  
  // US format: (123) 456-7890
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  
  // International format: +1 (123) 456-7890
  if (digits.length === 11 && digits[0] === '1') {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  
  // International format with country code
  if (digits.length > 11) {
    return `+${digits}`;
  }
  
  return phone;
}

/**
 * Get storage usage info
 */
export function getStorageInfo(): {
  contacts: number;
  primary: number;
  storageSize: number;
} {
  const contacts = getContacts();
  const primary = contacts.filter(c => c.isPrimary).length;
  const storageSize = new Blob([JSON.stringify(contacts)]).size;
  
  return {
    contacts: contacts.length,
    primary,
    storageSize,
  };
}
