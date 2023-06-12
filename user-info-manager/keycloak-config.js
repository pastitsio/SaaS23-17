const session = require('express-session');
const Keycloak = require('keycloak-connect');

let keycloak;
const initKeycloak = () => {
    if (keycloak) {
        return keycloak;
    } else {
        console.log('Creating KeyCloak instance...');
        const memoryStore = new session.MemoryStore();

        keycloak = new Keycloak({
            // Configure session
            store: memoryStore,
            secret: process.env.SECRET,
            resave: false,
            saveUninitialized: true,
        });
        return keycloak;
    }
}

module.exports = { initKeycloak };