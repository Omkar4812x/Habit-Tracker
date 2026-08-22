// --- Core Business Logic (Modular & Testable) ---

function sanitizeInput(str) {
    if (!str) return '';
    return String(str)
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .trim();
}

function createHabit(name, category = 'Health') {
    const cleanName = sanitizeInput(name);
    if (!cleanName) return null;
    return {
        id: 'habit_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        name: cleanName,
        category: category || 'Health',
        streak: 0,
        completedToday: false,
        bestStreak: 0,
        createdAt: new Date().toISOString()
    };
}

function toggleHabitCompletion(habit) {
    if (!habit) return null;
    const updated = { ...habit };
    if (!updated.completedToday) {
        updated.completedToday = true;
        updated.streak += 1;
        if (updated.streak > updated.bestStreak) {
            updated.bestStreak = updated.streak;
        }
    } else {
        updated.completedToday = false;
        updated.streak = Math.max(0, updated.streak - 1);
    }
    return updated;
}

function calculateStats(habits) {
    if (!Array.isArray(habits) || habits.length === 0) {
        return { total: 0, completed: 0, bestStreak: 0, rate: 0 };
    }
    const total = habits.length;
    const completed = habits.filter(h => h.completedToday).length;
    const bestStreak = habits.reduce((max, h) => Math.max(max, h.bestStreak || 0), 0);
    const rate = Math.round((completed / total) * 100);
    return { total, completed, bestStreak, rate };
}

function filterHabits(habits, filter = 'all') {
    if (!Array.isArray(habits)) return [];
    if (filter === 'active') return habits.filter(h => !h.completedToday);
    if (filter === 'completed') return habits.filter(h => h.completedToday);
    return habits;
}

// --- Browser DOM Engine (Safely Scoped) ---

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    let habits = [];
    let currentFilter = 'all';

    const STORAGE_KEY = 'habit_tracker_pro_habits';

    function loadHabits() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            habits = data ? JSON.parse(data) : getInitialDefaultHabits();
        } catch (e) {
            habits = getInitialDefaultHabits();
        }
    }

    function saveHabits() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
        } catch (e) {}
    }

    function getInitialDefaultHabits() {
        return [
            { id: 'h1', name: 'Morning Meditation (10 mins)', category: 'Mindset', streak: 5, completedToday: true, bestStreak: 7 },
            { id: 'h2', name: 'Drink 2.5L Water', category: 'Health', streak: 12, completedToday: false, bestStreak: 12 },
            { id: 'h3', name: 'Read 20 pages of a book', category: 'Productivity', streak: 3, completedToday: false, bestStreak: 5 }
        ];
    }

    function renderDateBadge() {
        const badge = document.getElementById('current-date-badge');
        if (badge) {
            const options = { weekday: 'short', month: 'short', day: 'numeric' };
            badge.textContent = new Date().toLocaleDateString('en-US', options);
        }
    }

    function updateDashboard() {
        const stats = calculateStats(habits);
        document.getElementById('stat-total').textContent = stats.total;
        document.getElementById('stat-completed').textContent = stats.completed;
        document.getElementById('stat-best-streak').textContent = `${stats.bestStreak} days`;
        document.getElementById('stat-rate').textContent = `${stats.rate}%`;
    }

    function renderHabits() {
        const listContainer = document.getElementById('habit-list');
        const emptyState = document.getElementById('empty-state');
        if (!listContainer) return;

        const filtered = filterHabits(habits, currentFilter);
        listContainer.innerHTML = '';

        if (filtered.length === 0) {
            emptyState.classList.remove('hidden');
        } else {
            emptyState.classList.add('hidden');
            filtered.forEach(habit => {
                const card = document.createElement('div');
                card.className = `habit-card ${habit.completedToday ? 'completed' : ''}`;
                card.dataset.id = habit.id;

                card.innerHTML = `
                    <div class="habit-header">
                        <span class="habit-title">${habit.name}</span>
                        <span class="habit-category-pill">${habit.category}</span>
                    </div>
                    <div class="habit-footer">
                        <div class="streak-counter">
                            <span>🔥 ${habit.streak} day streak</span>
                        </div>
                        <div style="display: flex; gap: 0.5rem; align-items: center;">
                            <button class="btn-delete" title="Delete Habit">🗑️</button>
                            <button class="check-toggle-btn" title="Toggle Completion">✓</button>
                        </div>
                    </div>
                `;

                // Event Listeners
                card.querySelector('.check-toggle-btn').addEventListener('click', () => {
                    const idx = habits.findIndex(h => h.id === habit.id);
                    if (idx !== -1) {
                        habits[idx] = toggleHabitCompletion(habits[idx]);
                        saveHabits();
                        renderHabits();
                        updateDashboard();
                    }
                });

                card.querySelector('.btn-delete').addEventListener('click', () => {
                    habits = habits.filter(h => h.id !== habit.id);
                    saveHabits();
                    renderHabits();
                    updateDashboard();
                });

                listContainer.appendChild(card);
            });
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        loadHabits();
        renderDateBadge();
        updateDashboard();
        renderHabits();

        // Form Submit
        const form = document.getElementById('add-habit-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const nameInput = document.getElementById('habit-name-input');
                const catInput = document.getElementById('habit-category-select');

                const newHabit = createHabit(nameInput.value, catInput.value);
                if (newHabit) {
                    habits.unshift(newHabit);
                    saveHabits();
                    nameInput.value = '';
                    renderHabits();
                    updateDashboard();
                }
            });
        }

        // Filter Tabs
        const filterBtns = document.querySelectorAll('.tab-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentFilter = btn.dataset.filter;
                renderHabits();
            });
        });

        // Reset Day
        const resetBtn = document.getElementById('btn-reset-day');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                habits = habits.map(h => ({ ...h, completedToday: false }));
                saveHabits();
                renderHabits();
                updateDashboard();
            });
        }
    });
}

// Export for Node.js test runner
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        sanitizeInput,
        createHabit,
        toggleHabitCompletion,
        calculateStats,
        filterHabits
    };
}
