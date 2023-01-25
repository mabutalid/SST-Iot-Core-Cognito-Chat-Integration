import { useAuthUtils } from "@/utils/auth";

export interface IAccessTokenStorage {
  getAccessToken: () => string;
  setAccessToken: (val: string) => void;
  clearAccessToken: () => void;
}

const authUtils = useAuthUtils();

// Implement the token memory storage in localStorage
const LocalAccessTokenStorage: IAccessTokenStorage = {
  getAccessToken: () => authUtils.getStoredAccessToken(),
  setAccessToken: (val: string) => {
    authUtils.setStoredAccessToken(val);
  },
  clearAccessToken: () => {
    authUtils.setStoredAccessToken(null);
  },
};

export const useAccessTokenStorage = (): IAccessTokenStorage =>
  LocalAccessTokenStorage;

export const useAuthorizedHeader = () => {
  const accessToken = authUtils.getStoredAccessToken();

  return {
    accept: "application/json",
    "Content-Type": "application/json",
    authorization: `Bearer ${accessToken}`,
  };
};
