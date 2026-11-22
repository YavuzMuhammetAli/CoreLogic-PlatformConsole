export const environment = {
  production: false,
  // Platform (control plane) API base — a separate area from the tenant API ([13 §1]). Same path as production:
  // the refresh cookie is SameSite=Strict and does not work on a separate origin. ng serve forwards via proxy.conf.json.
  platformApiBaseUrl: '/api/platform/v1'
};
