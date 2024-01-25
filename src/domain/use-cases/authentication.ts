export interface Authentication {
  auth: (authParams: AuthParams) => Promise<AuthResult>;
}

export type AuthParams = {
  username: string;
  password: string;
}

export type AuthResult = {
  accessToken: string;
}
