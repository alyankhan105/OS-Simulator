import { ProcessManager } from './ProcessManager.js';
import { CpuScheduler } from './CpuScheduler.js';
import { SyncLab } from './SyncLab.js';
import { MemoryManager } from './MemoryManager.js';

document.addEventListener('DOMContentLoaded', () => {
    // Navigation Logic
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.page-section');
    const pageTitle = document.getElementById('page-title');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active from all nav items
            navItems.forEach(nav => nav.classList.remove('active'));
            // Add active to clicked nav item
            item.classList.add('active');

            // Hide all sections
            sections.forEach(sec => sec.classList.remove('active'));
            // Show target section
            const targetId = item.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');

            // Update title
            pageTitle.innerText = item.innerText;

            // Toggle global stats visibility
            const globalStats = document.getElementById('global-stats');
            if (globalStats) {
                globalStats.style.display = (targetId === 'sync-lab') ? 'none' : 'grid';
            }

            // Toggle specific global stat cards
            if (targetId === 'memory-manager') {
                document.getElementById('card-total-proc').style.display = 'none';
                document.getElementById('card-page-faults').style.display = 'flex';
            } else {
                document.getElementById('card-page-faults').style.display = 'none';
                document.getElementById('card-total-proc').style.display = 'flex';
            }
        });
    });

    // Sync Lab Inner Tabs Logic
    const syncTabs = document.querySelectorAll('#sync-lab .tab-btn');
    const syncContents = document.querySelectorAll('#sync-lab .tab-content');

    syncTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            syncTabs.forEach(t => t.classList.remove('active'));
            syncContents.forEach(c => c.classList.remove('active'));

            tab.classList.add('active');
            const target = tab.getAttribute('data-tab');
            document.getElementById('tab-' + target).classList.add('active');
        });
    });

    // Theme Toggle
    const themeBtn = document.getElementById('theme-toggle');
    themeBtn.addEventListener('click', () => {
        const html = document.documentElement;
        const icon = themeBtn.querySelector('i');
        if (html.getAttribute('data-theme') === 'dark') {
            html.removeAttribute('data-theme');
            icon.className = 'fa-solid fa-sun';
        } else {
            html.setAttribute('data-theme', 'dark');
            icon.className = 'fa-solid fa-moon';
        }
    });

    // Initialize Modules
    const processManager = new ProcessManager();
    const cpuScheduler = new CpuScheduler(processManager);
    const syncLab = new SyncLab();
    const memoryManager = new MemoryManager();

    // Initially empty, so first process created is exactly P1

    document.getElementById('dash-cpu-util').innerText = '0%';
    document.getElementById('dash-mem-usage').innerText = '0%';
});
