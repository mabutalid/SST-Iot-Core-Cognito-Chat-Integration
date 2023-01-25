import fetcher from "../utils/fetcher";
import { ACCESS_TOKEN_EXPIRY_ALLOWANCE, API_URL } from "../constants";

export type TokenApiResult = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
};

export type RefreshAccessTokenResult = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  refreshesIn: number;
  tokenType: string;
};

export interface ITokenUtils {
  refreshAccessToken: (
    refreshToken?: string | null
  ) => Promise<RefreshAccessTokenResult | null>;
}

export const useTokenUtils = (): ITokenUtils => new TokenUtils();

class TokenUtils implements ITokenUtils {
  public async refreshAccessToken(
    refreshToken?: string | null
  ): Promise<RefreshAccessTokenResult | null> {
    if (refreshToken) {
      let body = `grant_type=refresh_token&refresh_token=${refreshToken}`;

      const res = (await fetcher(`${API_URL}/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        body,
      })) as TokenApiResult;

      let refreshesIn = res.expires_in - ACCESS_TOKEN_EXPIRY_ALLOWANCE;

      return {
        accessToken: res.access_token,
        expiresIn: res.expires_in,
        refreshesIn: refreshesIn < 0 ? 0 : refreshesIn,
        refreshToken: res.refresh_token,
        tokenType: res.token_type,
      };
    }

    return null;
  }
}
