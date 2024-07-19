export function buildUrlWithParams(baseUrl: string, params: Record<string, any>): string {
  let queryParams = new String();

  for (const key in params) {
    if (params[key] !== undefined && params[key] !== null) {
      if (typeof params[key] === 'object') {
        for (const subKey in params[key]) {
          queryParams += `${key}[${subKey}]=true&`;
        }
      }
    }
  }

  return `${baseUrl}?${queryParams}`;
}
