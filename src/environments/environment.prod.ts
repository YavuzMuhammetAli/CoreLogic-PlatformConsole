export const environment = {
  production: true,
  // Relative: the console is on its own origin (8443), the API is served from the same origin (backend repo
  // deploy/nginx/corelogic.conf). Local `ng serve` uses environment.ts.
  platformApiBaseUrl: '/api/platform/v1'
};
