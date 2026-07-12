import { Sandbox } from './src/Sandbox.js';

const mode = import.meta.env.MODE === 'webgl' ? 'webgl' : 'canvas';
const sandbox = new Sandbox(mode);

sandbox.start();
