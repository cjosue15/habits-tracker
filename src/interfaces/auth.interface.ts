export interface ProfileGoogle {
  sub: string;
  name: string;
  email: string;
  email_verified: boolean;
  picture?: string;
}

export interface CustomUser {
  id: string;
  email: string;
  name: string;
  provider: string;
  isEmailVerified: boolean;
  image?: string | null;
  tokens: Tokens;
}

export interface CustomSession extends CustomJWT {
  user: CustomUser;
}

export interface CustomJWT {
  tokens: Tokens;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}
