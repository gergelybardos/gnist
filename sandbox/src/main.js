import { Sandbox } from './Sandbox.js';
import { RenderModes, Demos } from './config.js';

const mode = import.meta.env.MODE;
const isRenderMode = Object.values(RenderModes).includes(mode);
const renderMode = isRenderMode ? mode : RenderModes.WEBGL2;

const demoIdFromMode = isRenderMode ? null : mode;
const demos = Object.values(Demos);
const publicDemos = demos.filter(demo => demo.public);
const requestedDemo = new URLSearchParams(window.location.search).get('demo');

const selectedDemo = demos.find(demo => demo.id === demoIdFromMode)
    ?? publicDemos.find(demo => demo.id === requestedDemo)
    ?? publicDemos[0];

const sandbox = new Sandbox(
    selectedDemo.forceRenderMode ?? renderMode,
    selectedDemo.id
);

sandbox.start();

document.title = `${selectedDemo.name} - Gnist Showcase`;
