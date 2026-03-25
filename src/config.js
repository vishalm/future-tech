// In production (deployed), API is on the same origin.
// In development, API is on localhost:3002.
const isDev = import.meta.env.DEV;

export const API_URL = isDev ? 'http://localhost:3002' : '';
export const WS_URL = isDev ? 'ws://localhost:3002' : `wss://${window.location.host}`;
