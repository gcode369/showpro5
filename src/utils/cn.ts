type ClassValue = string | number | boolean | undefined | null;
type ClassArray = ClassValue[];
type ClassDictionary = Record<string, any>;

export function cn(...inputs: (ClassValue | ClassArray | ClassDictionary)[]): string {
  return inputs
    .flatMap(input => {
      if (!input) return [];
      if (typeof input === 'string') return input.split(' ');
      if (Array.isArray(input)) return input.flatMap(i => cn(i));
      return Object.entries(input)
        .filter(([, value]) => value)
        .map(([key]) => key);
    })
    .filter(Boolean)
    .join(' ');
}