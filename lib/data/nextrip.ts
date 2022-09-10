
async function fetchAPI(endpoint: string) {
  const headers = { 'Content-Type': 'application/json' };
  const url = 'https://svc.metrotransit.org/nextripv2/' + endpoint;

  const res = await fetch(url, {
    method: 'GET',
    headers
  });

  const json = await res.json();
  if (json.errors) {
    console.error(json.errors);
    throw new Error('Failed to fetch API');
  }
  return json;
}

export async function getRoutes() {
  // Create the request endpoint
  const endpoint = 'routes';

  return fetchAPI(endpoint);

}

export async function getDirections(route: string) {
  // Create the request endpoint
  const endpoint = 'directions/' + route;

  return fetchAPI(endpoint);
}

export async function getStops(route: string, direction: number) {
  // Create the request endpoint
  const endpoint = 'stops/' + route + '/' + direction;

  return fetchAPI(endpoint);
}