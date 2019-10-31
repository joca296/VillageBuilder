export interface User {
  uid: string;
  email: string;
  photoURL?: string;
  displayName?: string;
  villages?: Array<string>;
}
