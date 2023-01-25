import { Base64 } from "js-base64";

export interface IAuthUtils {
  getAuthHeaders: () => Record<string, string>;
  getStoredRefreshToken: () => string;
  getStoredAccessToken: () => string;
  getStoredAccessTokenExpireTime: () => number;
  setStoredAccessToken: (accessToken: string | null | undefined) => void;
  toBase64: (data: string | Uint8Array) => string;
  fromBase64: (b64: string, outputAsString?: boolean) => Uint8Array | string;
  toBase64Url: (data: string | Uint8Array) => string;
  fromBase64Url: (b64: string, outputAsString?: boolean) => Uint8Array | string;
  generateRandomBytes: (byteSize: number) => Uint8Array;
}

export const useAuthUtils = (): IAuthUtils => new AuthUtils();

class AuthUtils implements IAuthUtils {
  private getLocalStorageItem<T>(key: string): T | undefined {
    const item = localStorage.getItem(key);
    if (typeof item === "undefined" || item === "undefined") {
      return undefined;
    }

    return JSON.parse(item ?? '""') as T;
  }

  private setLocalStorageItem<T>(key: string, data: T): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  public getAuthHeaders() {
    const token: string = this.getLocalStorageItem("idToken") ?? "";

    return {
      authorization: `Bearer ${token}`,
    };
  }

  public getStoredRefreshToken() {
    const token: string = this.getLocalStorageItem("refreshToken") ?? "";
    return token;
  }

  public getStoredAccessToken() {
    const token: string = this.getLocalStorageItem("accessToken") ?? "";
    return token;
  }

  public getStoredAccessTokenExpireTime() {
    const expireTime: number =
      this.getLocalStorageItem("accessTokenExpireTime") ?? 0;
    return expireTime;
  }

  public setStoredAccessToken(accessToken: string | null | undefined) {
    if (accessToken !== undefined) {
      this.setLocalStorageItem("accessToken", accessToken);
    }
  }

  public toBase64(data: string | Uint8Array) {
    if (typeof data === "string") {
      return Base64.encode(data);
    } else {
      return Base64.fromUint8Array(data);
    }
  }

  public toBase64Url(data: string | Uint8Array) {
    if (typeof data === "string") {
      return Base64.encode(data, true);
    }

    return Base64.fromUint8Array(data, true);
  }

  public fromBase64(b64: string, outputAsString?: boolean) {
    if (!outputAsString) {
      return Base64.toUint8Array(b64);
    }

    return Base64.decode(b64);
  }

  public fromBase64Url(b64: string, outputAsString?: boolean) {
    // Use the very same methods from js-base64, since they can
    // automatically recognize and decode base64url encoding
    // as well.

    if (!outputAsString) {
      return Base64.toUint8Array(b64);
    }

    return Base64.decode(b64);
  }

  public generateRandomBytes(byteSize: number) {
    const bytes = new Uint8Array(byteSize);

    // If the current page is under http://localhost or has been served via HTTPS,
    // then the window.crypto object is available and the cryptgraphic random byte
    // generator can be used. Otherwise, windows.crypto is unavailable and the routine
    // falls back to using Math.random() which is not cryptographically random.

    if (window && window.crypto) {
      window.crypto.getRandomValues(bytes);
    } else {
      for (let i = 0; i < byteSize; i++) {
        bytes[i] = Math.floor(Math.random() * 256);
      }
    }

    return bytes;
  }
}
