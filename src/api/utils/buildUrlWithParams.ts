// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function buildUrlWithParams(baseUrl: string, params: Record<string, any>): string {
  const queryParams = new URLSearchParams();

  for (const key in params) {
    if (params[key] !== undefined && params[key] !== null) {
      if (typeof params[key] === 'object') {
        for (const subKey in params[key]) {
          queryParams.append(`${key}[${subKey}]`, String(params[key][subKey]));
        }
      } else {
        queryParams.append(key, String(params[key]));
      }
    }
  }

  return `${baseUrl}?${queryParams.toString()}`;
}
