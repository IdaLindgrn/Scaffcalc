# Scaffcalc - Full Stack Developer - Use Case

Welcome to my Scaffcalc Full Stack Developer use case repository! This project is a demonstration of a web application built with React and a mocked API server, showcasing my enhancements and customizations.

## Overview of Changes

### 1. Improved House Mesh

- **Simplified Mesh**: Removed extra points from the house model.
- **Control Point**: Added a central dot to make moving the house easier.

### 2. Random House Generation

- **Randomized Features**: Added logic to create houses with random shapes, positions, rotations, and heights.
- **Bigger Grid**: Set the grid size to 100x100 meters, matching the given limits.

### 3. Interactive House Updates

- **API Integration**: Implemented a button that, when clicked, fetches new houses from the mocked API. The central control point applies to these new houses too.
- **Movable Houses**: Made all houses movable using pivot points.
- **Better Styling and Collision Handling**: Improved house styling and added basic collision prevention.

### 4. Real-time House State Display

- **State Table**: Added a table to show the current state of all houses.
- **UI Enhancements**: Added buttons (with icons) to open and close the table.
- **Live Updates**: The table updates in real-time as houses are moved.

## Improvements Needed

1. **Collision Logic**: The current logic sometimes lets houses overlap. Needs fine-tuning.
2. **Styling**: The styling could be more organized with variables for consistency.

## Getting Started

1. **Install Dependencies**: Run `yarn` to install everything you need.
2. **Start the Server**: Use `yarn start` to launch the React development server.
3. **Make Changes**: Feel free to tweak the code, and don’t forget to commit your changes.
4. **Keep Moving Forward**: If you get stuck, move on to the next task.
5. **Need Help?**: Reach out to saudin@scaffcalc.com if you need any assistance.
