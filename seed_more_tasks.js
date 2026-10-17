const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.sqlite');

const newTasks = [
    { title: 'YouTube Video 2', description: 'Watch premium video', reward: 15, type: 'youtube' },
    { title: 'Facebook Post 2', description: 'Like and share', reward: 50, type: 'facebook' },
    { title: 'Telegram Group 2', description: 'Join VIP channel', reward: 5, type: 'telegram' },
    { title: 'TikTok Clip 2', description: 'Engage with ad', reward: 2, type: 'tiktok' },
    { title: 'YouTube Video 3', description: 'Watch and subscribe', reward: 15, type: 'youtube' },
    { title: 'Facebook Page Like', description: 'Like sponsor page', reward: 50, type: 'facebook' },
    { title: 'TikTok Duet', description: 'Watch duet video', reward: 2, type: 'tiktok' },
    { title: 'YouTube Short', description: 'Watch short clip', reward: 15, type: 'youtube' },
    { title: 'Telegram Bot', description: 'Start bot', reward: 5, type: 'telegram' },
    { title: 'Facebook Story', description: 'View story', reward: 50, type: 'facebook' },
    { title: 'TikTok Challenge', description: 'Watch challenge', reward: 2, type: 'tiktok' },
    { title: 'YouTube Ad', description: 'Watch sponsor ad', reward: 15, type: 'youtube' }
];

db.serialize(() => {
    const stmt = db.prepare('INSERT INTO tasks (title, description, reward, type) VALUES (?, ?, ?, ?)');
    newTasks.forEach(t => {
        stmt.run(t.title, t.description, t.reward, t.type);
    });
    stmt.finalize(() => {
        console.log('Successfully inserted 12 more tasks into the database!');
        db.close();
    });
});
