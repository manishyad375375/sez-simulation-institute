# Technical Documentation: SEZ Simulation Institute

## 1. Project Overview
**SEZ Simulation Institute** is a multidisciplinary educational platform designed for Class 10 students. It utilizes high-fidelity web technologies (HTML5 Canvas, SVG, React 19) to transform abstract scientific and economic concepts into interactive, data-driven simulations.

### 1.1 Key Objectives
- **Conceptual Mastery**: Moving beyond rote memorization into experimental learning.
- **Real-time Feedback**: Instant visualization of mathematical changes (e.g., Ohms Law, Quadratic Curves).
- **Progressive Engagement**: Tracking student completions through a cloud-synced backend.
- **Administrative Insight**: Providing faculty with cohort-wide performance analytics.

---

## 2. UI/UX Wireframe Guide

### 2.1 Main Application Shell
The application follows a "Persistent Sidebar" pattern with a "Floating Header" for global context.

```text
_______________________________________________________________________________
|  [Sidebar]         |  [Header]                                              |
|  SEZ INSTITUTE     |  [Menu] [Home] [Module Title]          [Sync] [Profile]|
|____________________|________________________________________________________|
|                    |                                                        |
|  [Home Link]       |                                                        |
|  [Admin Link]      |                   [Main Content Area]                  |
|                    |                                                        |
|  SIM LIBRARY:      |               (Library, Simulation, or                 |
|  - Module 1        |                   Admin Dashboard)                     |
|  - Module 2        |                                                        |
|  - ...             |                                                        |
|____________________|                                                        |
|  [Progress Card]   |                                                        |
|____________________|________________________________________________________|
```

### 2.2 Simulation Layout (12-Column Grid)
Most simulations use a split-view approach to balance visualization with data control.

```text
[      8 Columns - Visualizer       ] [     4 Columns - Controls      ]
_______________________________________________________________________
| [ Simulation Canvas / SVG ]       | [ Control Deck ]                |
|                                   | - Slider 1 (e.g. Voltage)       |
|  (Real-time rendering of          | - Slider 2 (e.g. Resistance)    |
|   physical phenomenon)            | - [Action Button: FIRE/RESET]   |
|___________________________________|_________________________________|
| [ Mathematical Derivation ]       | [ Objective Benchmarks ]        |
|  (Live Equation Mapping)           | - Task 1 [✔]                    |
|  (e.g. y = ax² + bx + c)          | - Task 2 [ ]                    |
|___________________________________|_________________________________|
```

---

## 3. Technical Architecture

### 3.1 Tech Stack
- **Frontend**: React 19 (Hooks, Context, useMemo for performance).
- **Styling**: Tailwind CSS (Utility-first, responsive grid system).
- **Database**: Firebase Realtime Database (WebSocket-based sync).
- **Graphics**: 
    - **HTML5 Canvas**: For high-frequency physics (Projectile Motion).
    - **SVG**: For vector-based logic and circuits (Logic Gates, Ohm's Law).
- **Icons**: FontAwesome 6 (Pro-grade iconography).

### 3.2 Data Schema
**Users Table:**
```json
{
  "id": "SEZ-1234",
  "name": "Student Name",
  "rank": "Student",
  "email": "student@example.com",
  "avatar": "fa-user-graduate"
}
```

**Progress Table:**
```json
{
  "userId": {
    "moduleId": {
      "completed": true,
      "score": 100,
      "lastAccessed": "ISO-TIMESTAMP"
    }
  }
}
```

---

## 4. Simulation Modules Detail

| ID | Title | Concept | Tech Used |
|---|---|---|---|
| 01 | Projectile Motion | Quadratic Curves | HTML5 Canvas + Math Engine |
| 02 | Cell Inspector | Biology Anatomy | Interactive SVG + Detail Modals |
| 03 | Equation Balance | Stoichiometry | CSS 3D Transforms + Balancing Logic |
| 04 | Pulley Lab | Mechanical Advantage | SVG Animation + Vector Math |
| 05 | Triangle Maker | Geometry | SVG Path Dragging + Trig Formulas |
| 06 | Circuit Builder | Ohm's Law | SVG Filters + Electron Flow Animation |
| 07 | States of Matter | Particle Dynamics | Canvas Partice System |
| 08 | Solar Scale | Kepler's Laws | Animation Frame Scaling |
| 09 | Binary Logic | Logic Gates | Boolean Logic Mapping + SVG Wiring |
| 10 | Market Dynamics | Supply & Demand | SVG Graph Plotting + Intersection Math |

---

## 5. Implementation Roadmap
1. **Core Shell**: Setup React Router logic and Firebase connectivity.
2. **Identity Layer**: Secure Login/Register with local storage persistence.
3. **Module Engines**: Independent development of the 10 simulation components.
4. **Analytics Pipeline**: Aggregating raw progress data into the Admin Dashboard.
5. **Polishing**: CSS animations, responsive breakpoints, and accessibility (ARIA).
