export function isUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

export async function resolveIdentifierToUserId(identifier: string): Promise<string | null> {
  if (isUUID(identifier)) {
    return identifier;
  }
  
  try {
    const response = await fetch(`/api/users/resolve/${encodeURIComponent(identifier)}`);
    if (response.ok) {
      const data = await response.json();
      return data.userId || null;
    }
  } catch (error) {
    console.error('Failed to resolve identifier:', error);
  }
  
  return null;
}
