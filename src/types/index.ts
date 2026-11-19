// This type represents a user object with all the necessary information.
export type User = {
  id: string;
  email: string;
  username: string;
  passwordHash: string;
  salt: string;
  createdAt: string;
};

// This type represents a user object without sensitive information like password hash and salt.
export type PublicUser = Omit<User, 'passwordHash' | 'salt'>;

// This type represents the input required for user registration, including email, username, and password.
export type RegisterInput = {
  email: string;
  username: string;
  password: string;
};

// This type represents the input required for user login, including email and password.
export type CredentialChanges = {
  email?: string;
  username?: string;
  newPassword?: string;
};

// This type represents a category object with an id, name, and creation date.
export type Category = {
  id: string;
  name: string;
  createdAt: string;
};

// This type represents a note object with an id, categoryId, title, body, creation date, optional update date, and x and y coordinates for positioning.
export type Note = {
  id: string;
  categoryId: string;
  title?: string;
  body: string;
  createdAt: string;
  updatedAt?: string;
  x: number;
  y: number;
};