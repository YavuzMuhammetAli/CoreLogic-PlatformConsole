export const environment = {
  production: false,
  // Platform (control plane) API tabanı — tenant API'sinden ayrı alan ([13 §1]). Üretimle aynı yol:
  // refresh çerezi SameSite=Strict, ayrı origin'de çalışmaz. ng serve proxy.conf.json ile iletir.
  platformApiBaseUrl: '/api/platform/v1'
};
