const bcrypt = require('bcryptjs');

async function test() {
    try {
        console.log('Testing bcryptjs...');
        const salt = await bcrypt.genSalt(10);
        console.log('Salt generated:', salt);
        const hash = await bcrypt.hash('testpassword', salt);
        console.log('Hash generated:', hash);
        const match = await bcrypt.compare('testpassword', hash);
        console.log('Compare works:', match);
    } catch (err) {
        console.error('bcryptjs test failed:', err);
    }
}

test();
