export function getValidPayload(type) {
  const lowercaseType = type.toLowerCase();
  switch (lowercaseType) {
    case 'create user':
      return {
        email: 'e@ma.il',
        password: 'password'
      };
    case 'malformed':
      return '{"name": "john", {';
    case 'non-json':
      return '<?xml version="1.0" encoding="UTF-8" ?><email>dan@danyll.com</email>'
    case 'empty': 
    default:
      return undefined;
  }
}

export function convertStringToArray(string) {
  return string
    .split(',')
    .map(s => s.trim())
    .filter(s => s !== '');
}
