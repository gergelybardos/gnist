import { Demos } from './config.js';

const publicDemos = Object.values(Demos).filter(demo => demo.public);
const url = new URL(window.location.href);
const selectedDemo = publicDemos.find(demo => demo.id === url.searchParams.get('demo')) ?? publicDemos[0];
const demoList = document.getElementById('demo-list');

for (const demo of publicDemos) {
    const button = document.createElement('button');

    button.textContent = demo.name;
    button.classList.toggle('active', demo.id === selectedDemo.id);
    button.addEventListener('click', () => {
        url.searchParams.set('demo', demo.id);
        window.location.href = url.href;
    });

    demoList.append(button);
}

if (url.searchParams.get('demo') !== selectedDemo.id) {
    url.searchParams.set('demo', selectedDemo.id);
    window.history.replaceState(null, '', url.href);
}
