export class SyncLab {
    constructor() {
        this.bufferSize = 5;
        this.buffer = [];
        this.mutex = 1;
        this.full = 0;
        this.empty = this.bufferSize;

        // Readers Writers Semaphores
        this.readCount = 0;
        this.rwMutex = 1;
        this.rwWrt = 1;
        this.activeReaders = 0;
        this.waitingReaders = 0;
        this.waitingWriters = 0;
        this.activeWriters = 0;

        this.initDOM();
    }

    initDOM() {
        this.btnProd = document.getElementById('btn-prod');
        this.btnCons = document.getElementById('btn-cons');
        this.bufferEl = document.getElementById('sync-buffer');

        this.semMutex = document.getElementById('sem-mutex');
        this.semFull = document.getElementById('sem-full');
        this.semEmpty = document.getElementById('sem-empty');

        this.btnProd.addEventListener('click', () => this.produce());
        this.btnCons.addEventListener('click', () => this.consume());

        this.renderBuffer();

        // Readers-Writers DOM
        this.btnRead = document.getElementById('btn-read');
        this.btnWrite = document.getElementById('btn-write');
        if (this.btnRead) {
            this.btnRead.addEventListener('click', () => this.startRead());
            this.btnWrite.addEventListener('click', () => this.startWrite());
        }
    }

    async produce() {
        if (this.empty === 0) {
            alert('Buffer is Full! Producer must wait.');
            return;
        }

        // Wait(empty)
        this.empty--;
        // Wait(mutex)
        this.mutex = 0;
        this.updateSems();

        // Critical Section
        this.btnProd.disabled = true;
        const item = Math.floor(Math.random() * 100);
        this.buffer.push(item);

        await this.delay(500); // Simulate work

        this.renderBuffer();

        // Signal(mutex)
        this.mutex = 1;
        // Signal(full)
        this.full++;
        this.updateSems();
        this.btnProd.disabled = false;
    }

    async consume() {
        if (this.full === 0) {
            alert('Buffer is Empty! Consumer must wait.');
            return;
        }

        // Wait(full)
        this.full--;
        // Wait(mutex)
        this.mutex = 0;
        this.updateSems();

        // Critical Section
        this.btnCons.disabled = true;
        this.buffer.shift();

        await this.delay(500); // Simulate work

        this.renderBuffer();

        // Signal(mutex)
        this.mutex = 1;
        // Signal(empty)
        this.empty++;
        this.updateSems();
        this.btnCons.disabled = false;
    }

    renderBuffer() {
        this.bufferEl.innerHTML = '';
        for (let i = 0; i < this.bufferSize; i++) {
            const slot = document.createElement('div');
            if (i < this.buffer.length) {
                slot.className = 'slot filled';
                slot.innerText = this.buffer[i];
            } else {
                slot.className = 'slot empty';
            }
            this.bufferEl.appendChild(slot);
        }
    }

    updateSems() {
        this.semMutex.innerText = this.mutex;
        this.semFull.innerText = this.full;
        this.semEmpty.innerText = this.empty;
    }

    delay(ms) {
        return new Promise(res => setTimeout(res, ms));
    }

    // --- Readers/Writers Logic ---
    async waitRW(semName) {
        while (this[semName] <= 0) {
            await this.delay(50); // non-blocking sleep loop
        }
        this[semName]--;
        this.updateRWSems();
    }

    signalRW(semName) {
        this[semName]++;
        this.updateRWSems();
    }

    updateRWSems() {
        const docRwMutex = document.getElementById('rw-mutex');
        const docRwWrt = document.getElementById('rw-wrt');
        const docReadCount = document.getElementById('sem-readcount');
        const docWait = document.getElementById('readers-waiting');
        const docWWait = document.getElementById('writers-waiting');

        if (docRwMutex) docRwMutex.innerText = this.rwMutex;
        if (docRwWrt) docRwWrt.innerText = this.rwWrt;
        if (docReadCount) docReadCount.innerText = this.activeReaders;
        if (docWait) docWait.innerText = this.waitingReaders;
        if (docWWait) docWWait.innerText = this.waitingWriters;
    }

    async startRead() {
        this.waitingReaders++;
        this.updateRWSems();

        await this.waitRW('rwMutex');
        this.readCount++;
        this.activeReaders++;
        this.waitingReaders--;
        if (this.readCount === 1) {
            await this.waitRW('rwWrt'); // First reader grabs the write lock
        }
        this.signalRW('rwMutex');

        // Critical Section (Reading)
        const resource = document.getElementById('rw-resource');
        resource.innerText = `Reading... (${this.activeReaders} Active)`;
        resource.style.borderColor = "var(--success-color)";
        resource.style.color = "var(--success-color)";

        await this.delay(2000); // Predictable read length

        // Release locks
        await this.waitRW('rwMutex');
        this.readCount--;
        this.activeReaders--;
        if (this.readCount === 0) {
            resource.innerText = "Idle";
            resource.style.borderColor = "var(--border-color)";
            resource.style.color = "var(--accent-color)";
            this.signalRW('rwWrt'); // Last reader releases the write lock
        } else {
            resource.innerText = `Reading... (${this.activeReaders} Active)`;
        }
        this.signalRW('rwMutex');
    }

    async startWrite() {
        this.waitingWriters++;
        this.updateRWSems();

        await this.waitRW('rwWrt');
        this.waitingWriters--;
        this.activeWriters++;
        this.updateRWSems();

        // Critical Section (Writing)
        const resource = document.getElementById('rw-resource');
        resource.innerText = "Writing... (Exclusive Lock)";
        resource.style.borderColor = "var(--danger-color)";
        resource.style.color = "var(--danger-color)";

        await this.delay(2000); // Simulate write burst

        this.activeWriters--;
        if (this.activeReaders === 0 && this.activeWriters === 0) {
            resource.innerText = "Idle";
            resource.style.borderColor = "var(--border-color)";
            resource.style.color = "var(--accent-color)";
        }

        this.signalRW('rwWrt');
    }
}
