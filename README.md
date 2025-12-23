# 📋 ClarityBoard

**ClarityBoard** is a modern, lightweight, and elegant task management web application designed to help you organize your workflow with clarity and focus. Built with vanilla JavaScript and powered by IndexedDB, it offers a seamless offline-first experience with no backend dependencies.

## 🌟 Introduction

ClarityBoard provides an intuitive Kanban-style board interface that allows you to manage multiple projects, categorize tasks by importance, and track your progress through customizable workflows. The application features a sleek, responsive design with dark/light theme support and full internationalization (i18n) capabilities.

### Core Concept

The central idea behind ClarityBoard is to provide **clarity** in task management through:
- **Visual Organization**: Kanban-style columns (Backlog, Selected, In Progress, Done)
- **Smart Prioritization**: Dynamic scoring system based on urgency and category importance
- **Category-Based Workflow**: Organize tasks with custom categories and color coding
- **Project Isolation**: Manage multiple projects independently with dedicated workspaces

### Technologies Used

- **Frontend**: Vanilla HTML5, CSS3, and JavaScript (ES6+)
- **Storage**: IndexedDB for client-side data persistence
- **Architecture**: Modular ES6 modules with MVC-inspired patterns
- **Styling**: Custom CSS with CSS Variables for theming
- **Internationalization**: Custom i18n implementation (English and Portuguese)
- **Data Exchange**: JSON-based import/export functionality

## 📚 Table of Contents

- [Features](#-features)
  - [Project Management](#project-management)
  - [Task Management](#task-management)
  - [Category System](#category-system)
  - [Scoring & Prioritization](#scoring--prioritization)
  - [User Interface](#user-interface)
  - [Internationalization](#internationalization)
  - [Import/Export](#importexport)
- [Installation](#-installation)
- [Usage Guide](#-usage-guide)
- [Project Structure](#-project-structure)
- [Database Schema](#-database-schema)
- [Configuration](#-configuration)
- [Browser Support](#-browser-support)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### Project Management

- **Create Multiple Projects**: Organize your work into separate, isolated projects
- **Custom Project Icons**: Choose from a variety of emoji icons to personalize your projects
- **Project Settings**: Edit project name, icon, and other settings at any time
- **Project Deletion**: Safely delete projects with confirmation to prevent accidental data loss
- **Last Project Memory**: Automatically loads your most recently viewed project on startup
- **Project Switching**: Seamlessly switch between projects using the dropdown selector

### Task Management

- **Create Tasks**: Add tasks with comprehensive details including:
  - Task name and description
  - Category assignment
  - Schedule date and deadline
  - Urgency level (Low, Medium, High)
  - Status (Backlog, Selected, In Progress, Done)
- **Edit Tasks**: Modify any task property through an intuitive modal interface
- **Drag & Drop**: Easily move tasks between columns to update their status
- **Task Deletion**: Remove tasks individually or clear entire columns
- **Visual Priority Indicators**: Color-coded urgency dots (green, yellow, red)
- **Task Filtering**: Organize tasks by status columns on the board

### Category System

- **Custom Categories**: Create unlimited categories to organize your tasks
- **Category Importance**: Assign importance values (0-10) to each category
- **Color Coding**: Select from a rich color palette for visual differentiation
- **Category Management Modal**: Dedicated interface to add, edit, and delete categories
- **Category Dropdown**: Auto-complete category selection with visual color indicators
- **Create-on-Type**: Quickly create new categories directly from the task modal
- **Category Deletion Protection**: Confirmation dialog prevents accidental deletions

### Scoring & Prioritization

- **Dynamic Score Calculation**: Tasks are automatically scored using the formula:
  ```
  Score = (Urgency × Urgency Weight) + (Category Importance × Category Weight)
  ```
- **Configurable Weights**: Adjust urgency and category weights (0-10) in settings
- **Automatic Sorting**: Tasks are automatically ordered by score within each column
- **Live Preview**: See score changes in real-time as you adjust weights
- **Smart Task Ordering**: Higher-scored tasks appear at the top for better focus

### User Interface

- **Kanban Board Layout**: Four-column board (Backlog, Selected, In Progress, Done)
- **Responsive Design**: Fully mobile-responsive with dedicated mobile navigation drawer
- **Dark/Light Themes**: Toggle between themes with smooth animated transitions
- **Theme Persistence**: Your theme preference is saved across sessions
- **System Theme Detection**: Automatically detects and applies your OS theme preference
- **Floating Action Button (FAB)**: Quick access to create new tasks
- **Modal-Based Workflows**: Clean, focused interfaces for all major actions
- **Board Navigation**: Navigate between sections with intuitive controls
- **Loading States**: Smooth loading animations for better UX
- **Empty States**: Helpful messages guide users when no data exists

### Internationalization

- **Multi-Language Support**: Built-in English (US) and Portuguese (BR) translations
- **Language Switching**: Change language in settings with instant application
- **Extensible i18n System**: Easy to add new languages through translation files
- **Dynamic Content Updates**: All UI text updates without page reload

### Import/Export

- **JSON Export**: Export entire projects (tasks, categories, settings) to JSON files
- **JSON Import**: Import previously exported projects
- **Project Portability**: Share projects or backup your data locally
- **Safe Import**: Imports create new project instances without overwriting existing data

## 🚀 Installation

### Option 1: Use the Live Application (Recommended)

The easiest way to use ClarityBoard is to access the live version hosted on GitHub Pages:

**🌐 [https://maxadobr.github.io/clarityboard](https://maxadobr.github.io/clarityboard)**

No installation required! Simply open the link in your browser and start using ClarityBoard immediately. All your data is stored locally in your browser using IndexedDB.

### Option 2: Run Locally

If you prefer to run ClarityBoard locally or want to contribute to development:

```bash
# Clone the repository
git clone https://github.com/maxadobr/clarityboard.git

# Navigate to the project directory
cd clarityboard

# Open in browser
# Option 1: Double-click index.html
# Option 2: Use a local server (recommended)
python -m http.server 8000
# or
npx serve
```

Then navigate to `http://localhost:8000` in your browser.

## 📖 Usage Guide

### Getting Started

1. **First Launch**: Upon opening ClarityBoard, you'll see a welcome modal
2. **Create Project**: Click "Create New Project" or import an existing one
3. **Add Categories**: Open the Category Manager to create task categories
4. **Create Tasks**: Use the FAB button (+) to add your first task
5. **Organize**: Drag tasks between columns as you work on them

### Managing Tasks

- **Create**: Click the FAB (+) button or "Add Task" in any column
- **Edit**: Click on any task card to modify its details
- **Move**: Drag tasks between columns or use the status dropdown
- **Delete**: Open a task and click the delete button

### Customizing Your Workflow

1. **Open Settings**: Click the Settings button in the header
2. **Adjust Weights**: Modify urgency and category importance weights
3. **Change Language**: Select your preferred language
4. **Edit Project**: Update project name and icon

### Exporting Your Data

1. Select a project from the dropdown
2. Click "Export Project"
3. Save the JSON file to your local system

### Importing Projects

1. Click "Import Project"
2. Select a previously exported JSON file
3. The project will be added to your workspace

## 📂 Project Structure

```
clarityboard/
├── index.html                      # Main HTML entry point
├── README.md                       # This file
├── src/
│   ├── assets/
│   │   ├── clarity-board-logo.svg  # Application logo
│   │   └── favicon/                # Favicon assets
│   ├── css/
│   │   ├── styles.css              # Global styles and theme variables
│   │   ├── board.css               # Board and column styles
│   │   ├── modal.css               # Modal component styles
│   │   └── start-screen.css        # Welcome screen styles
│   └── js/
│       ├── app.js                  # Application entry point and initialization
│       ├── navigation.js           # Board navigation controls
│       ├── components/
│       │   ├── board.js            # Main board controller
│       │   ├── column.js           # Column component
│       │   ├── taskCard.js         # Task card component
│       │   ├── taskModal.js        # Task creation/edit modal
│       │   ├── categoryManager.js  # Category management modal
│       │   ├── projectModal.js     # Project creation modal
│       │   └── settingsManager.js  # Settings management
│       ├── database/
│       │   ├── database.js         # IndexedDB connection and base operations
│       │   ├── db.js               # Database singleton instance
│       │   ├── projects.js         # Project CRUD operations
│       │   ├── tasks.js            # Task CRUD operations
│       │   ├── categories.js       # Category CRUD operations
│       │   ├── categories_numeric.js # Numeric category operations (future)
│       │   └── migrations.js       # Database schema migrations
│       ├── i18n/
│       │   ├── i18n.js             # Internationalization controller
│       │   └── translations.js     # Translation dictionaries
│       └── utils/
│           ├── constants.js        # Application constants
│           ├── helpers.js          # Utility functions
│           └── importExport.js     # Import/export functionality
```

## 🗄️ Database Schema

ClarityBoard uses IndexedDB with the following structure:

### Object Stores

#### `projects`
- **Key Path**: `id` (auto-increment)
- **Indexes**: `name`, `type`
- **Fields**:
  - `id`: Project unique identifier
  - `name`: Project name
  - `emoji`: Project icon emoji
  - `type`: Category type (`'non-numeric'` or `'numeric'`)

#### `tasks`
- **Key Path**: `id` (auto-increment)
- **Indexes**: `projectId`, `status`, `FK_categories_id`, `FK_categories_numeric_id`
- **Fields**:
  - `id`: Task unique identifier
  - `projectId`: Reference to parent project
  - `name`: Task title
  - `description`: Task details
  - `category`: Category name
  - `schedule`: Scheduled date
  - `deadline`: Deadline date
  - `urgency`: Urgency level (`'low'`, `'medium'`, `'high'`)
  - `status`: Current status (`'backlog'`, `'selected'`, `'progress'`, `'done'`)
  - `FK_categories_id`: Category reference (non-numeric)
  - `createdAt`: Creation timestamp

#### `categories`
- **Key Path**: `id` (auto-increment)
- **Indexes**: `projectId`, `name`, `task`
- **Fields**:
  - `id`: Category unique identifier
  - `projectId`: Reference to parent project
  - `name`: Category name
  - `importance`: Importance value (0-10)
  - `color`: Hex color code

#### `categories_numeric`
- **Key Path**: `id` (auto-increment)
- **Indexes**: `projectId`, `name`, `task`
- **Status**: Reserved for future numeric category implementation

## ⚙️ Configuration

### Theme Variables

ClarityBoard uses CSS custom properties for theming. You can customize colors by editing `src/css/styles.css`:

```css
[data-theme="light"] {
  --bg-primary: #f8f9fa;
  --bg-secondary: #ffffff;
  --text-primary: #212529;
  /* ... more variables */
}

[data-theme="dark"] {
  --bg-primary: #1a1d23;
  --bg-secondary: #25272e;
  --text-primary: #e9ecef;
  /* ... more variables */
}
```

### Default Settings

Settings are stored in `localStorage` with the following defaults:

```javascript
{
  language: 'en-US',
  weights: {
    urgency: 1,
    categories: 1
  }
}
```

## 🌐 Browser Support

ClarityBoard requires a modern browser with:
- **IndexedDB API** support
- **ES6+ JavaScript** (Modules, Classes, Async/Await)
- **CSS Custom Properties** (CSS Variables)
- **Drag and Drop API**

**Recommended Browsers:**
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs by opening an issue
- Suggest new features or enhancements
- Submit pull requests with improvements

### Development Guidelines

1. Maintain the modular ES6 structure
2. Follow the existing code style and naming conventions
3. Add comments for complex logic
4. Update translations for new UI text
5. Test across different browsers

## 📄 License

This project is licensed under the MIT License. You are free to use, modify, and distribute this software as per the license terms.

---

## 👨‍💻 About the Developer

**ClarityBoard** was created by **Maxado**, a passionate developer focused on building elegant and functional web applications.

### Connect with Me

[![GitHub](https://img.shields.io/badge/GitHub-maxadobr-181717?style=for-the-badge&logo=github)](https://github.com/maxadobr)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-maxadobr-0A66C2?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/maxadobr/)
[![Portfolio](https://img.shields.io/badge/Portfolio-maxadobr.github.io-4A90E2?style=for-the-badge&logo=google-chrome&logoColor=white)](https://maxadobr.github.io/)

### Explore My Other Projects

Visit my **[portfolio](https://maxadobr.github.io/)** to discover more applications and projects I've built. From web tools to creative experiments, there's always something new to explore!

### Let's Collaborate

Interested in collaborating or have questions about ClarityBoard? Feel free to reach out:
- 💼 View my professional profile on [LinkedIn](https://www.linkedin.com/in/maxadobr/)
- 💻 Check out my code and projects on [GitHub](https://github.com/maxadobr)
- 🌐 Explore my portfolio at [maxadobr.github.io](https://maxadobr.github.io/)

---

<p align="center">
  <strong>ClarityBoard</strong> © 2025 | Made with ❤️ by <a href="https://github.com/maxadobr">Maxado</a>
</p>