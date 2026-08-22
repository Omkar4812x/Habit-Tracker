# Habit Tracker Pro

A modern, high-performance web application designed to help users build positive daily habits, track streaks, and visualize their daily progress.

![Habit Tracker Pro Interface](https://img.shields.io/badge/Status-Complete-emerald?style=for-the-badge)
![JavaScript](https://img.shields.io/badge/Language-JavaScript%20ES6%2B-yellow?style=for-the-badge)
![CSS3](https://img.shields.io/badge/Styling-Vanilla%20CSS3%20Custom%20Properties-blue?style=for-the-badge)
![Node Test Runner](https://img.shields.io/badge/Tests-Node.js%20Test%20Runner-green?style=for-the-badge)

---

## 🌟 Key Features

- **Daily Habit Tracking**: Add, complete, reset, and delete daily habits with instant visual feedback.
- **Streak Calculation Engine**: Automatically tracks daily streaks and retains your all-time best streak record.
- **Statistics Dashboard**: Real-time summary cards displaying Total Habits, Completed Today, Best Streak, and Completion Rate (%).
- **Category Filtering**: Organize habits by Health & Fitness, Productivity, Mindset, and Lifestyle.
- **Local Storage Persistence**: Automatically saves habits locally in the browser so your progress is never lost.
- **XSS Input Sanitization**: Built-in sanitization to protect against HTML and script injection attacks.
- **Glassmorphism UI**: Beautiful dark mode interface crafted with CSS custom properties, backdrop blur filters, and micro-animations.

---

## 📁 Repository Structure

```
Habit-Tracker/
├── index.html        # Main HTML layout & application UI
├── styles.css        # CSS3 styling system & Glassmorphism theme
├── app.js            # Core habit state engine & DOM event handlers
├── test/
│   └── app.test.js   # Automated unit test suite (Node.js Test Runner)
└── README.md         # Application documentation
```

---

## 🚀 Getting Started

### Running Locally
No build step or complex dependencies required. Simply open `index.html` in any modern browser:

```bash
# Double click index.html or launch via local HTTP server
npx serve .
```

---

## 🧪 Running Automated Unit Tests

This project includes a comprehensive unit test suite written for the native Node.js Test Runner.

Execute tests with:

```bash
node --test test/app.test.js
```

### Test Coverage Highlights
- ✅ Input sanitization against XSS payloads
- ✅ Habit initialization & unique ID generation
- ✅ Streak increment and decrement mechanics
- ✅ Summary statistics & completion rate calculation
- ✅ Filter tab evaluation (`all`, `active`, `completed`)
