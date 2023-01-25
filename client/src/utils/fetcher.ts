import axios, {
  AxiosProgressEvent,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";

export type FetcherProgressEvent = {
  loaded: number;
  total: number;
};

export type FetcherProgressCallback = (e: FetcherProgressEvent) => void;

export type FetcherOpts = {
  method?: string;
  headers?: Record<string, string>;
  body?: string | FormData;
  onUploadProgress?: FetcherProgressCallback;
  onDownloadProgress?: FetcherProgressCallback;
};

export type FetcherResult = {
  success: boolean;
  statusCode: number;
  statusText: string;
  details: string;
  headers: Record<string, string>;
  data: any | null;
};

export interface IFetcher {
  fetch: (url: string, opts: FetcherOpts) => Promise<FetcherResult>;
}

// export const useFetcher = () : IFetcher => new Fetcher();
export const useFetcher = (): IFetcher => new AxiosFetcher();

class Fetcher implements IFetcher {
  public async fetch(url: string, opts: FetcherOpts): Promise<FetcherResult> {
    try {
      const res = await fetch(url, {
        method: opts.method,
        headers: opts.headers,
        body: opts.body,
      });

      let resData: any | null = null;

      const resContentType = res.headers.get("Content-Type") ?? "";
      if (resContentType.startsWith("application/json")) {
        resData = await res.json();
      } else if (resContentType.startsWith("text/")) {
        resData = await res.text();
      } else if (resContentType) {
        resData = await res.blob();
      }

      let details = "OK";
      if (!res.ok) {
        details = res.statusText;
      }

      const resHeaders: Record<string, string> = {};
      for (let key of res.headers.keys()) {
        resHeaders[key.toLowerCase()] = res.headers.get(key) ?? "";
      }

      const result: FetcherResult = {
        success: res.ok,
        statusCode: res.status,
        statusText: res.statusText,
        details,
        headers: resHeaders,
        data: resData,
      };

      return result;
    } catch (e: any) {
      console.log(`fetcher: Failed fetching ${url}: `, e);
      throw e;
    }
  }
}

const callUploadProgress = (opts: FetcherOpts, e: AxiosProgressEvent) => {
  if (opts.onUploadProgress) {
    opts.onUploadProgress({ loaded: e.loaded, total: e.total ?? 0 });
  }
};

const callDownloadProgress = (opts: FetcherOpts, e: AxiosProgressEvent) => {
  if (opts.onDownloadProgress) {
    opts.onDownloadProgress({ loaded: e.loaded, total: e.total ?? 0 });
  }
};

class AxiosFetcher implements IFetcher {
  public async fetch(url: string, opts: FetcherOpts): Promise<FetcherResult> {
    try {
      const config: AxiosRequestConfig = {
        url,
        method: opts.method,
        headers: opts.headers,
        data: opts.body,
        transformRequest: (data) => data,
        onUploadProgress: (e) => callUploadProgress(opts, e),
        onDownloadProgress: (e) => callDownloadProgress(opts, e),
      };

      let res: AxiosResponse | null = null;
      let axiosErr: any = null;
      let throwsErr = false;

      try {
        res = await axios.request(config);
      } catch (e1: any) {
        throwsErr = true;
        res = e1.response;
        axiosErr = e1;
      }

      if (!res) {
        throw throwsErr
          ? axiosErr
          : new Error(`An empty response was received whiile fetching ${url}`);
      }

      let success = res.status >= 200 && res.status <= 299;
      let resData: any | null = res.data;

      let details = "OK";
      if (!success) {
        details = res.statusText;
      }

      const resHeaders: Record<string, string> = {};
      for (let key of Object.keys(res.headers)) {
        resHeaders[key.toLowerCase()] = res.headers[key] ?? "";
      }

      const result: FetcherResult = {
        success,
        statusCode: res.status,
        statusText: res.statusText,
        details,
        headers: resHeaders,
        data: resData,
      };

      return result;
    } catch (e: any) {
      console.log(`fetcher: Failed fetching ${url}: `, e);
      throw e;
    }
  }
}

export default async function fetcher(
  url: string,
  opts: FetcherOpts,
  returnErrorDetail?: boolean
) {
  const fetcher = useFetcher();

  const res = await fetcher.fetch(url, opts);

  if (!res.success) {
    if (returnErrorDetail) {
      return res.data;
    } else {
      throw new Error("Network response is not ok");
    }
  }

  return res.data;
}
