🖥️ OS Simulator

An interactive, browser-based Operating Systems simulator that visualizes core OS concepts in real time. Built with vanilla JavaScript using a modular class-based architecture.


✨ Features

🔄 Process Manager


Create custom processes with configurable priority, burst time, and memory size
Spawn random processes for quick testing
Kill individual processes or the last created one
Live process table showing PID, state, priority, burst time, and memory usage
Dashboard stats: total process count and memory utilization


⚙️ CPU Scheduler


Simulate three classic scheduling algorithms:

FCFS – First Come, First Served
Round Robin – with configurable time quantum
Priority Scheduling – lower number = higher priority



Animated Gantt chart showing execution order
Live ready queue visualization
Calculates average waiting time and turnaround time


🧠 Memory Manager


Simulate page replacement algorithms:

FIFO – First In, First Out
LRU – Least Recently Used



Configurable number of frames and custom reference strings
Random reference string generator
Step-by-step animated visualization with page fault / hit highlighting
Running page fault counter synced to the dashboard


🔒 Synchronization Lab

Producer-Consumer Problem


Buffer with semaphore-based mutual exclusion
Visual buffer slots showing filled/empty state
Live semaphore values: mutex, full, empty


Readers-Writers Problem


Multiple concurrent readers with exclusive writer access
Tracks active readers, waiting readers, and waiting writers
Live semaphore display: rwMutex, rwWrt, readCount



🚀 Getting Started

Prerequisites

A modern browser that supports ES Modules (Chrome, Firefox, Edge, Safari).

Run Locally

bashgit clone https://github.com/alyankhan105/OS-Simulator.git
cd os-simulator

Then serve the files with any static server, for example:

bash# Using Node.js
npx serve .

# Using Python
python -m http.server 8080

Open http://localhost:8080 in your browser.


⚠️ ES Modules require a server — opening index.html directly via file:// will not work.




🗂️ Project Structure

os-simulator/
├── index.html          # Main HTML shell and layout
├── main.js             # Entry point — navigation, theme toggle, module init
├── ProcessManager.js   # Process creation, table rendering, dashboard updates
├── CpuScheduler.js     # FCFS, Round Robin, Priority scheduling + Gantt chart
├── MemoryManager.js    # FIFO & LRU page replacement simulation
└── SyncLab.js          # Producer-Consumer & Readers-Writers synchronization


🛠️ Tech Stack


Vanilla JavaScript (ES Modules) — no frameworks or bundlers
HTML5 / CSS3 — with CSS variables for theming
Font Awesome — icons
Dark / Light theme toggle built in



📸 Screenshots


Add screenshots of each module here




📚 Concepts Demonstrated

ConceptImplementationProcess StatesNew → Ready → Running → TerminatedCPU SchedulingFCFS, Round Robin, PriorityPage ReplacementFIFO, LRUSemaphoresmutex, full, empty, rwMutex, rwWrtCritical SectionsProducer-Consumer, Readers-Writers


🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.
