export interface User {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  status?: string;
  organization?: string;
  authorities?: string[];
  // organizationObject?:
}
