const fs = require('fs');
const path = require('path');

// Target directory paths for files inside config/
const usersPath = path.join(__dirname, 'users.json');
const logsPath = path.join(__dirname, 'platform_logs.json');

// Helper structure to verify and create files safely if missing
const initFile = (filePath) => {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify([]));
    }
};

initFile(usersPath);
initFile(logsPath);

const db = {
    // Write and save a user record
    saveUser: (userData, callback) => {
        fs.readFile(usersPath, 'utf8', (err, data) => {
            if (err) return callback(err);
            try {
                const users = JSON.parse(data);
                
                // Duplicate confirmation gate check
                const match = users.find(u => u.username === userData.username || u.email === userData.email);
                if (match) return callback(new Error('Username or email conflict.'));
                
                const newUser = {
                    id: users.length + 1,
                    username: userData.username,
                    email: userData.email,
                    tier: userData.tier || 'free',
                    created_at: new Date().toISOString()
                };
                
                users.push(newUser);
                fs.writeFile(usersPath, JSON.stringify(users, null, 2), (writeErr) => {
                    if (writeErr) return callback(writeErr);
                    callback(null, newUser.id);
                });
            } catch (pErr) {
                callback(pErr);
            }
        });
    },

    // Record system operational parameters
    logAction: (actionType, details) => {
        fs.readFile(logsPath, 'utf8', (err, data) => {
            if (err) return;
            try {
                const logs = JSON.parse(data);
                logs.push({
                    id: logs.length + 1,
                    action_type: actionType,
                    details: details,
                    timestamp: new Date().toISOString()
                });
                fs.writeFile(logsPath, JSON.stringify(logs, null, 2), () => {});
            } catch (e) {}
        });
    }
};

console.log('📦 Connected to local JSON persistent data storage system.');
module.exports = db;
