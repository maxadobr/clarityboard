# 📋 Clarity Board

[Demo Video](https://www.youtube.com/watch?v=https://youtu.be/NiL4kOohAuo)

**Clarity Board** is a modern, lightweight, and elegant task management web application designed to help you organize your workflow with clarity and focus. Built with vanilla JavaScript and powered by IndexedDB, it offers a seamless offline-first experience with no backend dependencies.

---

## 🌟 Introduction

Clarity Board is an intuitive Kanban-style task management application designed with a unique philosophy: **helping you make better decisions, not just managing tasks.** Unlike basic to-do lists or complex enterprise tools, Clarity Board fills the gap by being powerful enough for sophisticated workflows while remaining lightweight and distraction-free.

The application features a sleek, responsive design with dark/light theme support, full internationalization (i18n) capabilities, and a visual "data-at-a-glance" interface that helps you focus on what truly matters. It's more focused on helping you decide **what to do next** than simply tracking what you've done.

### Core Concept

Clarity Board provides **clarity** in task management through:
- **Visual Organization**: Kanban-style columns (Backlog, Selected, In Progress, Done)
- **Smart Prioritization**: Dynamic scoring algorithm based on urgency and category importance
- **Category-Based Workflow**: Organize tasks with custom categories and color coding
- **Project Isolation**: Manage multiple projects independently with dedicated workspaces
- **Offline-First**: Works without internet connectivity or server setup
- **Instant Access**: No account creation required—start using immediately from any browser

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
- [CS50x Final Project](#-cs50x-2025-final-project)
- [Architecture & Design Decisions](#-architecture--design-decisions)
- [File Structure](#️-file-structure-and-architecture)
- [Challenges Faced](#-challenges-faced)
- [What I Learned](#-what-i-learned)
- [Database Schema](#️-database-schema)
- [Configuration](#-configuration)
- [Browser Support](#-browser-support)
- [Contributing](#-contributing)
- [License](#-license)
- [About the Developer](#-about-the-developer)

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
- **Status Actions**: Move tasks between columns using quick action buttons (Move to Selected, In Progress, Done, or back to Backlog)
- **Task Deletion**: Remove tasks individually or clear entire columns
- **Visual Priority Indicators**: Color-coded urgency dots (green, yellow, red)
- **Task Filtering**: Organize tasks by status columns on the board

### Category System

- **Custom Categories**: Create unlimited categories to organize your tasks
- **Category Importance**: Assign importance values (0-10) to each category
- **Color Coding**: Select from a rich color palette for visual differentiation
- **Default Blank Category**: Every project includes a "Blank" (en-US) / "Vazio" (pt-BR) category with importance 0 for optional categorization
- **Optional Categorization**: Tasks can be created without selecting a category (auto-assigns to Blank/Vazio)
- **Category Management Modal**: Dedicated interface to add, edit, and delete categories
- **Category Dropdown**: Auto-complete category selection with visual color indicators
- **Create-on-Type**: Quickly create new categories directly from the task modal
- **Mobile-Friendly Confirmation**: Dedicated button for category creation on mobile devices without Enter key
- **Category Deletion Protection**: Confirmation dialog prevents accidental deletions
- **Multilingual Category Names**: Special categories translate automatically based on language preference

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

The easiest way to use Clarity Board is to access the live version hosted on GitHub Pages:

**🌐 [https://maxadobr.github.io/clarityboard](https://maxadobr.github.io/clarityboard)**

No installation required! Simply open the link in your browser and start using Clarity Board immediately. All your data is stored locally in your browser using IndexedDB.

### Option 2: Run Locally

If you prefer to run Clarity Board locally or want to contribute to development:

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

1. **First Launch**: Upon opening Clarity Board, you'll see a welcome modal
2. **Create Project**: Click "Create New Project" or import an existing one
3. **Add Categories**: Open the Category Manager to create task categories (you can also create them on-the-fly while creating tasks)
4. **Create Tasks**: Use the FAB button (+) in the bottom-right corner or click "Add Task" at the bottom of any column
5. **Adjust Category Importance**: After creating categories, open the Category Manager to set importance values (0-10) to match your priorities
   - **Tip**: Assign higher values (7-10) to what's most important to you right now, and lower values (1-3) to less urgent matters. You can always adjust these later as your priorities shift.
   - **Life Balance**: If you're using Clarity Board for personal goals, consider using [Wheel of Life](https://wheeloflife.io/) to map different areas of your life and identify which ones need more attention for greater satisfaction.
6. **Organize**: Move tasks between columns using the status dropdown or quick action buttons (drag-and-drop is a potential future feature)

### Managing Tasks

- **Create**: Click the FAB (+) button or "Add Task" in any column
- **Edit**: Click on any task card to modify its details
- **Move**: Use the status dropdown in the task modal or click quick action buttons on task cards (drag-and-drop is a potential future feature)
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
## 🎓 CS50x 2025 Final Project

### About This Project

This is **Clarity Board**, my final project for **CS50x 2025**. It's a comprehensive task management web application built to solve a real challenge I faced: effectively organizing multiple projects with varying priorities and workflows in one unified workspace.

### Why I Built This

During this period of my life, I was living in Santos, Brazil, for a consulting job at an automotive parts company while juggling multiple responsibilities: working full-time, starting my Software Engineering degree, taking CS50x, and learning front-end development through a Santander Open Academy scholarship. I struggled significantly with decision-making and filtering the abundance of content coming my way. With broad interests and a love for studying, I had to be careful about prioritizing tasks. I was using to-do lists and managing projects in Jira, but it felt like using a "bazooka to kill a cockroach."

**The timing was intense:** I developed Clarity Board while simultaneously completing CS50x and my first university semester. Both the Software Engineering course at my university and CS50x guided me toward the same philosophy—bringing continuous, well-architected solutions to real problems. This approach aligned perfectly with my automotive industry background: systematic problem-solving, attention to detail, and building for reliability and longevity.

I explored many task management tools searching for the right fit: Google Tasks, Ticktick, Todoist, Emacs Org Mode, Trello, Excel, and several others. While I learned that software alone doesn't determine project success, the right tool can help you navigate better by providing autonomy in your choices and clarity in execution. Most existing solutions were either too simple (basic to-do lists) or too complex (enterprise project management suites). I needed something in between—powerful enough for complex workflows, yet lightweight and focused. The CS50x final project was the perfect opportunity to build exactly what I needed.

### Development Timeline

This project was developed over approximately **two months** (late October to late December 2024), spanning planning, implementation, testing, and documentation. The development followed a natural progression through several phases:

- **Initial Planning**: Database schema design, feature planning, and architectural decisions
- **Core Implementation**: IndexedDB layer, basic Kanban board functionality, and project management
- **Advanced Features**: Dynamic scoring algorithm, category system, and task state management
- **UI/UX Polish**: Responsive design, dark/light themes, internationalization (i18n)
- **Finalization**: Testing, bug fixes, documentation, and deployment

**Note on AI Assistance**: I used AI tools (Claude Code Assistant) moderately throughout this project for code review, bug detection, identifying improvement opportunities, and English text revision (as it's not my native language, though I have good proficiency). However, AI was used heavily for learning new concepts and deepening my understanding of JavaScript, IndexedDB, and web development patterns. Since my primary goal with this project is educational, I intentionally limited AI use for direct code generation, preferring to write most code myself to solidify my learning. I plan to gradually increase AI integration in future versions as I continue developing my skills and adapting to AI-assisted workflows. All architecture decisions, design choices, and final implementation remain entirely my own.

### Project Scope and Complexity

This project meets and exceeds the CS50x final project requirements:
- **Complexity**: Far beyond any individual CS50x problem set
- **Original Problem**: Solves a real task management and prioritization challenge in my own way—this is a tool I've wished existed for a long time
- **Multiple Technologies**: HTML5, CSS3, JavaScript ES6+, IndexedDB, i18n
- **Production Ready**: Deployed and functional at [maxadobr.github.io/clarityboard](https://maxadobr.github.io/clarityboard)

The codebase consists of over 3,000 lines of custom JavaScript, 1,500 lines of CSS, and comprehensive documentation. Every feature was carefully planned, implemented, tested, and refined to create a polished, professional application. This is an evolving project that will continue to grow and improve as I progress in my development journey.


## 🏗️ Architecture & Design Decisions

### IndexedDB for Client-Side Storage

I chose IndexedDB over a traditional backend architecture for several complementary reasons:

**User-Focused Benefits:**
- **Offline-First Philosophy**: All data lives in the browser, making the app fully functional without internet connectivity
- **Instant Setup**: Users can start immediately without creating accounts or configuring servers
- **Complete Privacy**: User data never leaves their device, ensuring total data ownership and privacy

**Technical and Learning Benefits:**
- **Deep Learning**: Working with IndexedDB's asynchronous API deepened my understanding of Promise-based programming and browser storage mechanisms
- **Performance**: Eliminates network latency, providing instant data access and updates

**Future-Oriented Approach:**
- **Intentional Scope**: This client-side approach allowed me to focus on perfecting the core task management logic and user experience without the complexity of server-side infrastructure. While I plan to explore backend integration in future projects as I develop confidence in server-side security and architecture, this implementation serves as a solid foundation that demonstrates the viability of browser-based storage for personal productivity tools.

**Inspiration:**
My first experience with offline-first browser applications was [Excalidraw](https://excalidraw.com/), which opened my eyes to this universe of possibilities. The elegance of having a fully functional application with complete privacy and instant access, all running in the browser without server dependencies, deeply resonated with me. This experience inspired me to explore IndexedDB and build Clarity Board with the same philosophy.

To manage IndexedDB's complexity, I implemented a custom `Database` wrapper class that converts its event-based API into a cleaner Promise-based interface. The schema uses three main object stores (`projects`, `tasks`, and `categories`) with proper indexing for efficient queries.

### Vanilla JavaScript Over Frameworks

I chose to build this project with vanilla JavaScript ES6+ as a foundation-first approach before diving into frameworks like React or Vue. This decision to master the fundamentals first brought several important benefits:
- **Deep Learning**: Building without frameworks forced me to truly understand DOM manipulation, event delegation, and JavaScript's module system
- **Performance**: No framework overhead means faster load times and better performance
- **CS50x Alignment**: Demonstrates mastery of core JavaScript concepts taught in the course
- **Maintainability**: The modular structure (components, database, utils, i18n) keeps code organized despite being framework-free
- **Solid Foundation for Frameworks**: I built this project as preparation for learning React, believing that a strong vanilla JavaScript foundation is crucial before adopting frameworks. This approach allowed me to solidify fundamental concepts while meeting CS50x requirements. Although I may refactor it with React in the future as I continue learning, I am currently satisfied with this vanilla implementation and the deep understanding it provided.

Each component (Board, TaskModal, CategoryManager, etc.) is implemented as an ES6 class with clear separation of concerns.

### Dynamic Task Scoring Algorithm

The task prioritization system is one of the most sophisticated features and the heart of Clarity Board's decision-making philosophy. While simple in its essence, it's powerful in execution. The scoring formula was intentionally designed to be straightforward, making it easy for users to understand how priorities are calculated and adjust weights to their specific needs.

Tasks are automatically scored using a weighted formula implemented in `board.js`:

\\\javascript
Score = (Urgency Value × Urgency Weight) + (Category Importance × Category Weight)
\\\

Where:
- **Urgency Value**: High = 3, Medium = 2, Low = 1
- **Weights**: User-configurable from 0-10 in settings

This transparent calculation allows users to customize what matters most in their workflow. For example:
- A designer might prioritize category importance (client work vs. internal tasks)
- A developer might prioritize urgency (deadlines and bug fixes)
- A student might balance both equally

**Priority Hierarchy:**
The algorithm uses a two-tier sorting system. Tasks with scheduled dates take **absolute priority** over all other tasks, regardless of their score. These scheduled tasks are sorted chronologically in ascending order. Only after all scheduled tasks are positioned do score-based sorting rules apply to the remaining tasks. The board automatically re-sorts whenever tasks are updated or weight settings change, ensuring your most important work is always at the top.

### Internationalization (i18n) System

I implemented a custom internationalization system supporting English and Portuguese because:
- I'm Brazilian and wanted to make the tool accessible to my local community
- It demonstrates understanding of software localization concepts
- The modular design allows easy addition of new languages

All UI text, including dynamically generated content, updates instantly when changing languages without requiring a page reload.

### Responsive Design with Dark Theme

The application features a fully responsive layout that adapts to mobile, tablet, and desktop screens. The dark/light theme implementation uses:
- CSS custom properties for easy theme switching
- Smooth transitions between themes
- System preference detection
- Theme persistence across sessions

## 🗂️ File Structure and Architecture

```
clarityboard/
├── index.html                      # Main HTML entry point
├── README.md                       # This file
├── src/
│   ├── assets/
│   │   ├── clarity-board-logo.svg  # Application logo
│   │   └── favicon/
│   │       └── 256.ico             # Application favicon
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
│       │   ├── categories_numeric.js # Numeric category operations (future feature)
│       │   └── migrations.js       # Database schema migrations
│       ├── i18n/
│       │   ├── i18n.js             # Internationalization controller
│       │   └── translations.js     # Translation dictionaries
│       └── utils/
│           ├── constants.js        # Application constants
│           ├── helpers.js          # Utility functions
│           ├── categoryTranslation.js # Category name translation utilities
│           └── importExport.js     # Import/export functionality
```

**HTML/CSS:**
- `index.html`: Semantic HTML5 structure with modals, forms, and internationalization attributes
- `src/css/styles.css`: Design system with CSS variables, theme definitions, and global styles
- `src/css/board.css`: Kanban board layout, column styles, and card animations
- `src/css/modal.css`: Modal components with backdrop, animations, and form layouts
- `src/css/start-screen.css`: Welcome screen and initial project creation flow

**JavaScript Core:**
- `src/js/app.js`: Application entry point, initialization, global event coordination, and state management
- `src/js/navigation.js`: Board navigation controls for mobile/desktop column switching with horizontal scroll functionality

**JavaScript Components:**
- `src/js/components/board.js`: Main Kanban board controller with task rendering via `createTaskCard()` method, scoring algorithm implementation, priority filtering, sorting, and status management
- `src/js/components/taskModal.js`: Task creation/editing modal with comprehensive form validation, category dropdown with auto-complete, and category creation on-the-fly
- `src/js/components/categoryManager.js`: Category CRUD operations with color picker, importance slider, and deletion confirmation dialogs
- `src/js/components/projectModal.js`: Project creation modal with emoji picker interface and project type selection
- `src/js/components/settingsManager.js`: Settings panel for customizing scoring weights, language preferences, and project configuration

**JavaScript Database:**
- `src/js/database/database.js`: `Database` class - reusable wrapper providing Promise-based CRUD methods (`get`, `add`, `put`, `delete`, `clear`) for all object stores
- `src/js/database/db.js`: Database initialization with `initDB()` function that creates schema (object stores and indexes) and `getDB()` for retrieving the database instance
- `src/js/database/projects.js`: Project-specific database operations including cascade delete for associated tasks and categories
- `src/js/database/tasks.js`: Task-specific database operations (add, get all, update, delete) - simple wrappers around database methods
- `src/js/database/categories.js`: Category management operations for text-based categories with default "Void" category creation
- `src/js/database/categories_numeric.js`: Category operations for numeric categories - partially implemented, reserved for future release with more careful development
- `src/js/database/migrations.js`: Database migration functions including importance value migration and default category addition

**JavaScript Utilities:**
- `src/js/utils/constants.js`: Application-wide constants (error messages, category types, database name and version)
- `src/js/utils/helpers.js`: Utility functions for string validation, date formatting, unique ID generation, and number validation
- `src/js/utils/categoryTranslation.js`: Category name translation utilities for special categories like "Void" → "Blank"/"Vazio"
- `src/js/utils/importExport.js`: JSON import/export functionality with full project data serialization and deserialization

**JavaScript i18n:**
- `src/js/i18n/i18n.js`: Internationalization controller with language switching, dynamic DOM updates, and attribute translation support
- `src/js/i18n/translations.js`: Complete translation dictionaries for English (US) and Portuguese (BR) covering all UI text

## 💪 Challenges Faced

**1. IndexedDB Asynchronous Complexity**

Working with IndexedDB was initially challenging due to its event-based, asynchronous nature. Although completely new to me, the knowledge I gained from CS50x's SQL lectures helped me understand transactions, object stores, and indexes conceptually. Additionally, the async programming fundamentals from the Santander Open Academy front-end course made it easier to work with asynchronous operations. I had to:
- Understand transactions, object stores, and indexes
- Convert event handlers into Promises for cleaner code
- Handle edge cases like database upgrade conflicts
- Implement proper error handling for all operations

**2. Task State Management and Quick Actions**

Implementing smooth task state transitions while maintaining data consistency required:
- Managing task state transitions through action buttons (e.g., Backlog → In Progress)
- Updating the database immediately when status changes
- Re-rendering the board without flickering
- Providing contextual actions based on current task status
- Ensuring tasks move to the correct column after status updates

**3. Responsive Design with Vanilla CSS and JavaScript**

Creating a fully responsive layout using only vanilla CSS and JavaScript was complex and challenging. While frameworks might potentially simplify some of these tasks (though I don't have experience with them yet to compare), working through these challenges deepened my understanding of fundamental web development:
- Mobile navigation drawer with smooth animations
- Adaptive Kanban board (4 columns on desktop, scrollable on mobile)
- Touch-friendly interactions for mobile users
- Ensuring the category confirmation button works when keyboard hides the Enter key
- Managing state and DOM updates manually across different screen sizes

**4. Category System with Auto-Creation**

The category dropdown needed to support:
- Selecting existing categories with color indicators
- Creating new categories on-the-fly by typing and pressing Enter
- Mobile confirmation button as an alternative to Enter key
- Auto-assignment to default "Blank" category when no category is selected
- Preventing duplicate categories
- Deleting categories with confirmation dialogs

**5. Real-Time Score Updates**

Implementing the scoring system required:
- Calculating scores based on dynamic weights from settings
- Re-sorting tasks automatically when scores change
- Updating the UI immediately when weights are adjusted
- Ensuring performance with large numbers of tasks

## 📚 What I Learned

This project significantly expanded my understanding of:
- **Browser APIs**: IndexedDB, localStorage, matchMedia for system theme detection
- **Asynchronous JavaScript**: Promises, async/await, event handling
- **Software Architecture**: Modular design, separation of concerns, dependency management
- **Database Design**: Schema planning, indexing, foreign key relationships
- **UX/UI Design**: User flows, responsive layouts, accessibility considerations
- **Internationalization**: Multi-language support, dynamic content translation
- **Problem Solving**: Debugging complex issues, performance optimization

## ️ Database Schema

Clarity Board uses IndexedDB with the following structure:

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
  - `schedule`: Scheduled date
  - `deadline`: Deadline date
  - `urgency`: Urgency level (`'low'`, `'medium'`, `'high'`)
  - `status`: Current status (`'backlog'`, `'selected'`, `'progress'`, `'done'`)
  - `FK_categories_id`: Category reference for non-numeric projects
  - `FK_categories_numeric_id`: Category reference for numeric projects
  - `numeric`: Numeric value (only used in numeric projects)
  - `created_at`: Creation timestamp
  - `updated_at`: Last update timestamp

#### `categories`
- **Key Path**: `id` (auto-increment)
- **Indexes**: `projectId`, `name`, `task`
- **Fields**:
  - `id`: Category unique identifier
  - `task`: Reference to parent project (stored as project ID)
  - `name`: Category name (constant "Void" for default category, translated in UI)
  - `importance`: Importance value (0-10)
  - `color`: Hex color code
  - `completion`: Completion percentage (e.g., "0%")
- **Special Categories**:
  - Default "Void" category (importance: 0, displays as "Blank"/"Vazio")
  - Automatically created for all projects
  - Auto-assigned to tasks without explicit category selection

#### `categories_numeric`
- **Key Path**: `id` (auto-increment)
- **Indexes**: `projectId`, `name`, `task`
- **Status**: Partially implemented feature reserved for future release - basic structure exists but UI and full integration are being developed carefully for a later version

## ⚙️ Configuration

### Theme Variables

Clarity Board uses CSS custom properties for theming. You can customize colors by editing `src/css/styles.css`:

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

Clarity Board requires a modern browser with:
- **IndexedDB API** support
- **ES6+ JavaScript** (Modules, Classes, Async/Await)
- **CSS Custom Properties** (CSS Variables)

**Tested Environments:**
- Google Chrome 143+
- Mozilla Firefox 146+
- Brave Browser 1.85+
- Chrome for Android 143+

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs by opening an issue
- Suggest new features or enhancements
- Submit pull requests with improvements
- **Hire or Recommend Me**: You can also contribute by hiring me or recommending me! I am currently looking for job opportunities, especially internships to contribute to my career transition. You can check my portfolio at [maxadobr.github.io](https://maxadobr.github.io/).

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

I'm **Maxado**, a Software Engineering student and aspiring Front-End Developer transitioning from a career of **over 9 years** in the automotive industry, backed by strong recommendations from former employers.

My journey is defined by a passion for building solutions and solving real problems. This drive led me to project management in the industry and is now guiding me into technology, where I seek to solve even larger, more relevant challenges aligned with my purpose. I bring a strong foundation in system optimization and complex problem-solving, channeling these skills into creating efficient, user-centered software solutions. Currently pursuing my Bachelor's degree in Software Engineering (2025-2029).

I thoroughly enjoyed crafting the UX/UI for this application and plan to study design principles more deeply after mastering React (my next milestone for employability). I believe this combination will empower me to create solutions that are not only functional but truly engaging and elegant.

### Connect with Me

[![GitHub](https://img.shields.io/badge/GitHub-maxadobr-181717?style=for-the-badge&logo=github)](https://github.com/maxadobr)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-maxadobr-0A66C2?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/maxadobr/)
[![Portfolio](https://img.shields.io/badge/Portfolio-maxadobr.github.io-4A90E2?style=for-the-badge&logo=google-chrome&logoColor=white)](https://maxadobr.github.io/)

### Explore My Other Projects

Visit my **[portfolio](https://maxadobr.github.io/)** to discover more applications and projects. From web tools to creative experiments, there's always something new to explore!

### Let's Collaborate

Interested in collaborating or have questions about Clarity Board? Feel free to reach out:
- 💼 View my professional profile on [LinkedIn](https://www.linkedin.com/in/maxadobr/)
- 💻 Check out my code and projects on [GitHub](https://github.com/maxadobr)
- 🌐 Explore my portfolio at [maxadobr.github.io](https://maxadobr.github.io/)

---

<p align="center">
  <strong>Clarity Board</strong> © 2025 | Designed and Developed by <a href="https://github.com/maxadobr">Maxado</a>
</p>