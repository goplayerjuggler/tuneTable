import data from './data.json';
import { greet } from './script.js';

console.log(data);
document.getElementById('app').innerHTML = `
  <h1>${greet('World')}</h1>
  <p>${data.message}</p>
`;