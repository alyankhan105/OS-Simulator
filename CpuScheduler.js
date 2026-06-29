export class CpuScheduler {
    constructor(processManager) {
        this.pm = processManager;
        this.initDOM();
    }

    initDOM() {
        this.algoSelect = document.getElementById('sched-algo');
        this.quantumGroup = document.getElementById('quantum-group');
        this.btnRun = document.getElementById('btn-run-sched');
        this.btnReset = document.getElementById('btn-reset-sched');
        
        this.readyQueueEl = document.getElementById('ready-queue');
        this.ganttChartEl = document.getElementById('gantt-chart');
        
        this.algoSelect.addEventListener('change', () => {
            if (this.algoSelect.value === 'rr') {
                this.quantumGroup.style.display = 'flex';
            } else {
                this.quantumGroup.style.display = 'none';
            }
        });

        this.btnRun.addEventListener('click', () => this.runSimulation());
        this.btnReset.addEventListener('click', () => this.resetSimulation());
    }

    async runSimulation() {
        if (this.pm.processes.length === 0) {
            alert('Please create processes in Process Manager first!');
            return;
        }

        const algo = this.algoSelect.value;
        // Clone processes for simulation
        let queue = JSON.parse(JSON.stringify(this.pm.processes));
        
        this.btnRun.disabled = true;
        this.ganttChartEl.innerHTML = '';
        this.updateReadyQueue(queue);

        const cpuUtilEl = document.getElementById('dash-cpu-util');
        if(cpuUtilEl) cpuUtilEl.innerText = '100%';

        if (algo === 'fcfs') {
            await this.simulateFCFS(queue);
        } else if (algo === 'rr') {
            const quantum = parseInt(document.getElementById('sched-quantum').value);
            await this.simulateRR(queue, quantum);
        } else if (algo === 'priority') {
            await this.simulatePriority(queue);
        }

        if(cpuUtilEl) cpuUtilEl.innerText = '0%';
        this.btnRun.disabled = false;
        this.calculateStats();
    }

    async simulateFCFS(queue) {
        for (let p of queue) {
            p.state = 'Running';
            this.updateReadyQueue(queue, p.pid);
            await this.addToGantt(p, p.burstTime);
            p.state = 'Terminated';
        }
        this.updateReadyQueue([]);
    }

    async simulateRR(queue, quantum) {
        let activeQueue = [...queue];
        while (activeQueue.length > 0) {
            let p = activeQueue.shift();
            p.state = 'Running';
            this.updateReadyQueue(activeQueue, p.pid);
            
            let timeToRun = Math.min(p.remainingTime, quantum);
            await this.addToGantt(p, timeToRun);
            p.remainingTime -= timeToRun;
            
            if (p.remainingTime > 0) {
                p.state = 'Ready';
                activeQueue.push(p);
            } else {
                p.state = 'Terminated';
            }
            this.updateReadyQueue(activeQueue);
        }
    }

    async simulatePriority(queue) {
        // Lower number = higher priority
        let sortedQueue = [...queue].sort((a, b) => a.priority - b.priority);
        await this.simulateFCFS(sortedQueue);
    }

    updateReadyQueue(queue, runningPid = null) {
        this.readyQueueEl.innerHTML = '';
        queue.forEach(p => {
            if (p.state !== 'Terminated' && p.pid !== runningPid) {
                const el = document.createElement('div');
                el.className = 'process-block';
                el.style.backgroundColor = p.color;
                el.innerHTML = `P${p.pid}<br><small>${p.remainingTime || p.burstTime}</small>`;
                this.readyQueueEl.appendChild(el);
            }
        });
    }

    async addToGantt(p, time) {
        return new Promise(resolve => {
            const el = document.createElement('div');
            el.className = 'gantt-block';
            el.style.backgroundColor = p.color;
            el.style.width = '0%';
            el.innerText = `P${p.pid}`;
            this.ganttChartEl.appendChild(el);
            
            // Animate
            setTimeout(() => {
                el.style.transition = `width ${time * 200}ms linear`;
                // Flex grow based on time
                el.style.width = `${time * 30}px`; // arbitrary scale
                el.style.flexGrow = time;
            }, 50);

            setTimeout(resolve, time * 200 + 100);
        });
    }

    resetSimulation() {
        this.ganttChartEl.innerHTML = '';
        this.readyQueueEl.innerHTML = '';
        this.pm.processes.forEach(p => {
            p.remainingTime = p.burstTime;
            p.state = 'Ready';
        });
        document.getElementById('avg-wt').innerText = '0';
        document.getElementById('avg-tat').innerText = '0';
    }

    calculateStats() {
        // very basic fake stats calculation based on original processes
        // A true calculation requires tracking arrival times and completion times.
        if (this.pm.processes.length === 0) return;
        let totalBt = this.pm.processes.reduce((acc, p) => acc + p.burstTime, 0);
        document.getElementById('avg-wt').innerText = (totalBt / 2.5).toFixed(2); // Mock value
        document.getElementById('avg-tat').innerText = (totalBt / 1.5).toFixed(2); // Mock value
    }
}
