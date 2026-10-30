export const environment = {
  production: true,
  // Göreli: konsol kendi origin'inde (8443), API aynı origin'den sunulur (backend reposu
  // deploy/nginx/corelogic.conf). Yerel `ng serve` environment.ts'i kullanır.
  platformApiBaseUrl: '/api/platform/v1'
};
