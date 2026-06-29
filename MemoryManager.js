export class MemoryManager {
    constructor() {
        this.initDOM();
    }

    initDOM() {
        this.btnRun = document.getElementById('btn-run-mem');
        this.btnRand = document.getElementById('btn-rand-mem');
        this.gridEl = document.getElementById('mem-grid');
        this.faultsEl = document.getElementById('tot-page-faults');

        this.btnRun.addEventListener('click', () => this.runSimulation());
        if (this.btnRand) {
            this.btnRand.addEventListener('click', () => this.generateRandomString());
        }
    }

    generateRandomString() {
        const length = Math.floor(Math.random() * 10) + 10; // 10 to 19 numbers
        const arr = [];
        for (let i = 0; i < length; i++) {
            arr.push(Math.floor(Math.random() * 10)); // Pages 0 to 9
        }
        document.getElementById('mem-ref').value = arr.join(',');
    }

    async runSimulation() {
        const algo = document.getElementById('mem-algo').value;
        const framesCount = parseInt(document.getElementById('mem-frames').value);
        const refString = document.getElementById('mem-ref').value.split(',').map(s => s.trim()).filter(s => s !== '');

        if (refString.length === 0) return;

        this.gridEl.innerHTML = '';
        this.btnRun.disabled = true;

        if (algo === 'fifo') {
            await this.simulateFIFO(refString, framesCount);
        } else {
            await this.simulateLRU(refString, framesCount);
        }

        this.btnRun.disabled = false;
    }

    async simulateFIFO(refString, framesCount) {
        let frames = [];
        let faults = 0;

        for (let idx = 0; idx < refString.length; idx++) {
            const page = refString[idx];
            let isFault = false;

            if (!frames.includes(page)) {
                isFault = true;
                faults++;
                if (frames.length < framesCount) {
                    frames.push(page);
                } else {
                    frames.shift(); // FIFO: remove first
                    frames.push(page);
                }
            }

            this.renderStep(page, frames, framesCount, isFault);
            this.faultsEl.innerText = faults;
            const dashFaults = document.getElementById('dash-page-faults');
            if (dashFaults) dashFaults.innerText = faults;
            await this.delay(400);
        }
    }

    async simulateLRU(refString, framesCount) {
        let frames = [];
        let rU = []; // Array to track least recently used
        let faults = 0;

        for (let idx = 0; idx < refString.length; idx++) {
            const page = refString[idx];
            let isFault = false;

            if (!frames.includes(page)) {
                isFault = true;
                faults++;
                if (frames.length < framesCount) {
                    frames.push(page);
                    rU.push(page);
                } else {
                    // LRU: find least recently used
                    const lruPage = rU[0];
                    const frameIdx = frames.indexOf(lruPage);
                    frames[frameIdx] = page;
                    rU.shift(); // remove lru
                    rU.push(page); // add new
                }
            } else {
                // Update rU
                rU = rU.filter(p => p !== page);
                rU.push(page);
            }

            this.renderStep(page, frames, framesCount, isFault);
            this.faultsEl.innerText = faults;
            const dashFaults = document.getElementById('dash-page-faults');
            if (dashFaults) dashFaults.innerText = faults;
            await this.delay(400);
        }
    }

    renderStep(refPage, frames, maxFrames, isFault) {
        const stepDiv = document.createElement('div');
        stepDiv.className = 'mem-step';

        const refLabel = document.createElement('div');
        refLabel.className = 'mem-ref-num';
        refLabel.innerText = refPage;
        stepDiv.appendChild(refLabel);

        for (let i = 0; i < maxFrames; i++) {
            const frameDiv = document.createElement('div');
            frameDiv.className = 'mem-frame';
            if (i < frames.length) {
                frameDiv.innerText = frames[i];
                if (frames[i] === refPage) {
                    frameDiv.classList.add(isFault ? 'fault' : 'hit');
                }
            }
            stepDiv.appendChild(frameDiv);
        }

        const faultLabel = document.createElement('div');
        faultLabel.className = 'fault-indicator';
        faultLabel.innerText = isFault ? 'Fault' : '';
        stepDiv.appendChild(faultLabel);

        this.gridEl.appendChild(stepDiv);
        this.gridEl.scrollLeft = this.gridEl.scrollWidth;
    }

    delay(ms) {
        return new Promise(res => setTimeout(res, ms));
    }
}
