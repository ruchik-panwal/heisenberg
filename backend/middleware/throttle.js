export function monitorThrottling(response) {
  const throttling = response.headers?.["x-throttling-control"];
  if (throttling) {
    console.log(`[PubChem Throttle Status]: ${throttling}`);
  }
}