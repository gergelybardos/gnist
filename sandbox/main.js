import { Sandbox } from './src/Sandbox.js';

const mode = import.meta.env.MODE === 'webgl' ? 'webgl' : 'canvas2d';
const sandbox = new Sandbox(mode);

sandbox.start();
