export function GetMockFirebaseAuthData(numberStr = '01', options?: any) {
  if (options) {
    return {
      email: `jest${numberStr}@evolab.io`,
      password: 'jest123456',
      displayName: `Jester Lee ${numberStr}`,
      photoURL:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2574&q=80',
      emailVerified: false,
      disabled: false,
      ...options,
    };
  } else {
    return {
      email: `jest${numberStr}@evolab.io`,
      password: 'jest123456',
      displayName: `Jester Lee ${numberStr}`,
      photoURL:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2574&q=80',
      emailVerified: false,
      disabled: false,
    };
  }
}

export function GetMockAuthData(numberStr = '01', options?: any) {
  if (options) {
    return {
      email: `jest${numberStr}@evolab.io`,
      password: 'jest123456',
      displayName: `Jester Lee ${numberStr}`,
      firstName: 'Jester',
      lastName: 'Lee',
      ...options,
    };
  } else {
    return {
      email: `jest${numberStr}@evolab.io`,
      password: 'jest123456',
      displayName: `Jester Lee ${numberStr}`,
      firstName: 'Jester',
      lastName: 'Lee',
    };
  }
}
