const axios = require('axios');

const BACKEND_URL = 'http://localhost:5000';
const FRONTEND_URL = 'http://localhost:5173';

const colors = {
    reset: "\x1b[0m",
    green: "\x1b[32m",
    red: "\x1b[31m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m"
};

const checkService = async (name, url) => {
    try {
        await axios.get(url);
        console.log(`${colors.green}✔ ${name} is reachable at ${url}${colors.reset}`);
        return true;
    } catch (error) {
        console.log(`${colors.red}✘ ${name} is NOT reachable at ${url} (${error.message})${colors.reset}`);
        return false;
    }
};

const loginAndCheck = async (role, username, password) => {
    console.log(`\n${colors.blue}Testing Login for ${role}...${colors.reset}`);
    try {
        const response = await axios.post(`${BACKEND_URL}/api/auth/login`, {
            username,
            password
        });

        if (response.status === 200 && response.data.token) {
            console.log(`${colors.green}✔ Login Successful!${colors.reset}`);
            console.log(`   Token received: ${response.data.token.substring(0, 15)}...`);
            console.log(`   Role detected: ${response.data.role}`);

            // Test protected route
            try {
                const config = {
                    headers: { Authorization: `Bearer ${response.data.token}` }
                };

                // Try to fetch dorms (admin/manager) or just verify token works
                let testRoute = '/api/dorms';
                if (role === 'Maintenance') testRoute = '/api/maintenance';

                // We just want to check if the token is accepted (status 200 or 404 is fine, 401 is bad)
                try {
                    await axios.get(`${BACKEND_URL}${testRoute}`, config);
                    console.log(`${colors.green}✔ Protected Route Access (${testRoute}): Authorized${colors.reset}`);
                } catch (err) {
                    if (err.response && err.response.status !== 401) {
                        console.log(`${colors.green}✔ Protected Route Check: Token accepted (Status ${err.response.status})${colors.reset}`);
                    } else {
                        throw err;
                    }
                }

                return true;
            } catch (err) {
                console.log(`${colors.red}✘ Protected Route Access Failed: ${err.message}${colors.reset}`);
                return false;
            }
        }
    } catch (error) {
        console.log(`${colors.red}✘ Login Failed: ${error.response?.data?.message || error.message}${colors.reset}`);
        return false;
    }
};

const runVerification = async () => {
    console.log(`${colors.yellow}=== STARTING SYSTEM VERIFICATION ===${colors.reset}\n`);

    const backendUp = await checkService('Backend', BACKEND_URL);
    // Frontend returns HTML, so axios.get works
    const frontendUp = await checkService('Frontend', FRONTEND_URL);

    if (backendUp) {
        await loginAndCheck('Admin', 'admin', 'password123');
        await loginAndCheck('Maintenance', 'maintenance', 'password123');
        await loginAndCheck('Manager', 'manager', 'password123');
    }

    console.log(`\n${colors.yellow}=== VERIFICATION COMPLETE ===${colors.reset}`);
};

runVerification();
