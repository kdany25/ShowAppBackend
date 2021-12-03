export interface JwtPayload {
  userId: string;
  role: string;
}

export enum Status {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  DELETED = 'deleted',
}
