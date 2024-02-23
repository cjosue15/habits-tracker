export interface ProfileGoogle {
  sub: string;
  name: string;
  email: string;
  email_verified: boolean;
  picture?: string;
}

export interface SessionUser {
  user: {
    id: string;
    email: string;
    name: string;
    provider: string;
    isEmailVerified: boolean;
  };
}
