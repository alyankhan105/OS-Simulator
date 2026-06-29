export class Process {
    constructor(pid, priority, burstTime, memSize) {
        this.pid = pid;
        this.priority = priority;
        this.burstTime = burstTime;
        this.remainingTime = burstTime;
        this.memSize = memSize;
        this.state = 'Ready'; // New, Ready, Running, Waiting, Terminated

        // Use a pleasing array of colors
        const colors = ['#ef4444', '#f97316', '#f59e0b', '#84cc16', '#10b981', '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6', '#d946ef', '#f43f5e'];
        this.color = colors[pid % colors.length];
    }
}

export class ProcessManager {
    constructor() {
        this.processes = [];
        this.nextPid = 1;
        this.initDOM();
        this.updateTable();
    }

    initDOM() {
        this.tableBody = document.querySelector('#process-table tbody');
        document.getElementById('btn-create-proc').addEventListener('click', () => this.createCustomProcess());
        document.getElementById('btn-random-proc').addEventListener('click', () => this.createRandomProcess());
        document.getElementById('btn-kill-proc').addEventListener('click', () => this.killLastProcess());
    }

    createCustomProcess() {
        const priority = parseInt(document.getElementById('proc-priority').value) || 5;
        const burstTime = parseInt(document.getElementById('proc-burst').value) || 5;
        const memSize = parseInt(document.getElementById('proc-memory').value) || 256;

        const proc = new Process(this.nextPid++, priority, burstTime, memSize);
        this.processes.push(proc);
        this.updateTable();
        this.updateDashboard();
    }

    createRandomProcess() {
        const priority = Math.floor(Math.random() * 10) + 1;
        const burstTime = Math.floor(Math.random() * 15) + 2;
        const memSize = Math.floor(Math.random() * 1024) + 64; // in KB

        const proc = new Process(this.nextPid++, priority, burstTime, memSize);
        this.processes.push(proc);
        this.updateTable();
        this.updateDashboard();
    }

    killLastProcess() {
        if (this.processes.length > 0) {
            this.processes.pop();
            this.nextPid--;
            if (this.nextPid < 1) this.nextPid = 1;
            this.updateTable();
            this.updateDashboard();
        }
    }

    updateTable() {
        this.tableBody.innerHTML = '';
        this.processes.forEach(p => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>P${p.pid}</td>
                <td><span style="color:${p.color}; font-weight:bold;">${p.state}</span></td>
                <td>${p.priority}</td>
                <td>${p.burstTime}</td>
                <td>${p.memSize}</td>
                <td><button class="btn danger" style="padding: 5px 10px; font-size: 12px;" onclick="window.killProcess(${p.pid})">Kill</button></td>
            `;
            this.tableBody.appendChild(tr);
        });

        // Expose function for inline onclick
        window.killProcess = (pid) => {
            this.processes = this.processes.filter(p => p.pid !== pid);
            this.updateTable();
            this.updateDashboard();
        };
    }

    updateDashboard() {
        document.getElementById('dash-total-proc').innerText = this.processes.length;

        // Total theoretically memory bounds = 16MB (16384 KB)
        let totalMem = this.processes.reduce((acc, p) => acc + p.memSize, 0);
        let memPercentage = Math.min((totalMem / 16384) * 100, 100).toFixed(1);
        let memEl = document.getElementById('dash-mem-usage');
        if (memEl) memEl.innerText = memPercentage + '%';
    }
}
