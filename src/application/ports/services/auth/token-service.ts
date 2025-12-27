export interface TokenService {
	verifyAccessToken(token: string): Promise<{ userId: string }>;
}
