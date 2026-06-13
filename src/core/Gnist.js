/**
 * @class
 */
export class Gnist {
    #canvas;
    #ctx;

    constructor(canvas, context) {
        this.#canvas = canvas;
        this.#ctx = context;
    }

    start() {
        this.renderPlaceholder();
    }

    resize() {
        this.renderPlaceholder();
    }

    renderPlaceholder() {
        const width = this.#canvas.width;
        const height = this.#canvas.height;

        this.#ctx.fillStyle = '#000';
        this.#ctx.fillRect(0, 0, width, height);
        this.#ctx.fillStyle = '#FFF';
        this.#ctx.font = '16px monospace';
        this.#ctx.textAlign = 'center';
        this.#ctx.textBaseline = 'middle';

        this.#ctx.fillText('Gnist Engine Ready', width / 2, height / 2);
    }
}
