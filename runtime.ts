// tslint:disable
/**
 * Raiden API
 * https://raiden-network.readthedocs.io/en/stable/rest_api.html
 *
 * The version of the OpenAPI document: 1.0.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { Observable, of } from 'rxjs';
import { ajax, AjaxResponse } from 'rxjs/ajax';
import { map, concatMap } from 'rxjs/operators';

export const BASE_PATH = 'http://127.0.0.1:5001/api/v1'.replace(/\/+$/, '');

export interface ConfigurationParameters {
  basePath?: string; // override base path
  middleware?: Middleware[]; // middleware to apply before/after rxjs requests
  username?: string; // parameter for basic security
  password?: string; // parameter for basic security
  apiKey?: string | ((name: string) => string); // parameter for apiKey security
  accessToken?: string | ((name: string, scopes?: string[]) => string); // parameter for oauth2 security
}

export class Configuration {
  constructor(private configuration: ConfigurationParameters = {}) {}

  get basePath(): string {
    return this.configuration.basePath || BASE_PATH;
  }

  get middleware(): Middleware[] {
    return this.configuration.middleware || [];
  }

  get username(): string | undefined {
    return this.configuration.username;
  }

  get password(): string | undefined {
    return this.configuration.password;
  }

  get apiKey(): ((name: string) => string) | undefined {
    const apiKey = this.configuration.apiKey;
    if (apiKey) {
      return typeof apiKey === 'function' ? apiKey : () => apiKey;
    }
    return undefined;
  }

  get accessToken(): ((name: string, scopes?: string[]) => string) | undefined {
    const accessToken = this.configuration.accessToken;
    if (accessToken) {
      return typeof accessToken === 'function'
        ? accessToken
        : () => accessToken;
    }
    return undefined;
  }
}

/**
 * This is the base class for all generated API classes.
 */
export class BaseAPI {
  private middleware: Middleware[] = [];

  constructor(protected configuration = new Configuration()) {
    this.middleware = configuration.middleware;
  }

  withMiddleware = <T extends BaseAPI>(middlewares: Middleware[]) => {
    const next = this.clone<T>();
    next.middleware = next.middleware.concat(middlewares);
    return next;
  };

  withPreMiddleware = <T extends BaseAPI>(
    preMiddlewares: Array<Middleware['pre']>,
  ) => this.withMiddleware<T>(preMiddlewares.map((pre) => ({ pre })));

  withPostMiddleware = <T extends BaseAPI>(
    postMiddlewares: Array<Middleware['post']>,
  ) => this.withMiddleware<T>(postMiddlewares.map((post) => ({ post })));

  protected request = <T>(context: RequestOpts): Observable<T> =>
    this.rxjsRequest(this.createRequestArgs(context)).pipe(
      map((res) => {
        if (res.status >= 200 && res.status < 300) {
          return res.response as T;
        }
        throw res;
      }),
    );

  private createRequestArgs = (context: RequestOpts): RequestArgs => {
    let url = this.configuration.basePath + context.path;
    if (
      context.query !== undefined &&
      Object.keys(context.query).length !== 0
    ) {
      // only add the queryString to the URL if there are query parameters.
      // this is done to avoid urls ending with a '?' character which buggy webservers
      // do not handle correctly sometimes.
      url += '?' + queryString(context.query);
    }
    const body =
      context.body instanceof FormData
        ? context.body
        : JSON.stringify(context.body);
    const options = {
      method: context.method,
      headers: context.headers,
      body,
    };
    return { url, options };
  };

  private rxjsRequest = (params: RequestContext): Observable<AjaxResponse> => {
    const preMiddlewares = this.middleware.filter((item) => item.pre);
    const postMiddlewares = this.middleware.filter((item) => item.post);

    return of(params).pipe(
      map((args) => {
        if (preMiddlewares) {
          preMiddlewares.forEach((mw) => (args = mw.pre!({ ...args })));
        }
        return args;
      }),
      concatMap((args) =>
        ajax({ url: args.url, ...args.options }).pipe(
          map((response) => {
            if (postMiddlewares) {
              postMiddlewares.forEach(
                (mw) => (response = mw.post!({ ...params, response })),
              );
            }
            return response;
          }),
        ),
      ),
    );
  };

  /**
   * Create a shallow clone of `this` by constructing a new instance
   * and then shallow cloning data members.
   */
  private clone = <T extends BaseAPI>(): T =>
    Object.assign(Object.create(Object.getPrototypeOf(this)), this);
}

// export for not being a breaking change
export class RequiredError extends Error {
  name: 'RequiredError' = 'RequiredError';
}

export const COLLECTION_FORMATS = {
  csv: ',',
  ssv: ' ',
  tsv: '\t',
  pipes: '|',
};

export type Json = any;
export type HttpMethod =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'PATCH'
  | 'DELETE'
  | 'OPTIONS';
export type HttpHeaders = { [key: string]: string };
export type HttpQuery = {
  [key: string]:
    | string
    | number
    | null
    | boolean
    | Array<string | number | null | boolean>;
};
export type HttpBody = Json | FormData;
export type ModelPropertyNaming =
  | 'camelCase'
  | 'snake_case'
  | 'PascalCase'
  | 'original';

export interface RequestArgs {
  url: string;
  options: RequestInit;
}

export interface RequestOpts {
  path: string;
  method: HttpMethod;
  headers: HttpHeaders;
  query?: HttpQuery;
  body?: HttpBody;
}

const queryString = (params: HttpQuery): string =>
  Object.keys(params)
    .map((key) => {
      const value = params[key];
      if (value instanceof Array) {
        return value
          .map(
            (val) =>
              `${encodeURIComponent(key)}=${encodeURIComponent(String(val))}`,
          )
          .join('&');
      }
      return `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`;
    })
    .join('&');

// alias fallback for not being a breaking change
export const querystring = queryString;

export const throwIfRequired = (
  params: { [key: string]: any },
  key: string,
  nickname: string,
) => {
  if (!params || params[key] === null || params[key] === undefined) {
    throw new RequiredError(
      `Required parameter ${key} was null or undefined when calling ${nickname}.`,
    );
  }
};

export interface RequestContext extends RequestArgs {}
export interface ResponseContext extends RequestArgs {
  response: AjaxResponse;
}

export interface Middleware {
  pre?(context: RequestContext): RequestArgs;
  post?(context: ResponseContext): AjaxResponse;
}
