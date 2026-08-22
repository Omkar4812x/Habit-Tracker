const test = require('node:test');
const assert = require('node:assert');
const {
    sanitizeInput,
    createHabit,
    toggleHabitCompletion,
    calculateStats,
    filterHabits
} = require('../app.js');

test('sanitizeInput removes dangerous HTML tags and trims whitespace', () => {
    const raw = '  <script>alert("xss")</script> Morning Workout  ';
    const clean = sanitizeInput(raw);
    assert.strictEqual(clean, '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt; Morning Workout');
});

test('createHabit initializes a valid habit object', () => {
    const habit = createHabit('Drink Water', 'Health');
    assert.ok(habit.id.startsWith('habit_'));
    assert.strictEqual(habit.name, 'Drink Water');
    assert.strictEqual(habit.category, 'Health');
    assert.strictEqual(habit.streak, 0);
    assert.strictEqual(habit.completedToday, false);
});

test('createHabit returns null for empty or whitespace-only name', () => {
    assert.strictEqual(createHabit('   '), null);
    assert.strictEqual(createHabit(''), null);
});

test('toggleHabitCompletion increments streak when completing a habit', () => {
    const habit = createHabit('Read Book', 'Mindset');
    const completed = toggleHabitCompletion(habit);
    
    assert.strictEqual(completed.completedToday, true);
    assert.strictEqual(completed.streak, 1);
    assert.strictEqual(completed.bestStreak, 1);
});

test('toggleHabitCompletion decrements streak when unchecking a habit', () => {
    const habit = { id: '1', name: 'Test', category: 'Health', streak: 5, completedToday: true, bestStreak: 5 };
    const unchecked = toggleHabitCompletion(habit);

    assert.strictEqual(unchecked.completedToday, false);
    assert.strictEqual(unchecked.streak, 4);
});

test('calculateStats computes correct summary totals and completion rate', () => {
    const habits = [
        { id: '1', completedToday: true, bestStreak: 10 },
        { id: '2', completedToday: false, bestStreak: 4 },
        { id: '3', completedToday: true, bestStreak: 7 }
    ];
    const stats = calculateStats(habits);

    assert.strictEqual(stats.total, 3);
    assert.strictEqual(stats.completed, 2);
    assert.strictEqual(stats.bestStreak, 10);
    assert.strictEqual(stats.rate, 67);
});

test('filterHabits correctly filters active and completed habits', () => {
    const habits = [
        { id: '1', name: 'Habit A', completedToday: true },
        { id: '2', name: 'Habit B', completedToday: false }
    ];

    assert.strictEqual(filterHabits(habits, 'all').length, 2);
    assert.strictEqual(filterHabits(habits, 'active').length, 1);
    assert.strictEqual(filterHabits(habits, 'active')[0].name, 'Habit B');
    assert.strictEqual(filterHabits(habits, 'completed').length, 1);
    assert.strictEqual(filterHabits(habits, 'completed')[0].name, 'Habit A');
});
