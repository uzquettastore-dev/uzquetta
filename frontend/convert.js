const fs = require('fs');
const path = require('path');

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx') || fullPath.endsWith('.css')) {
            const buffer = fs.readFileSync(fullPath);
            let str = "";

            // Check if it's utf-16le by looking for BOM or null bytes
            if (buffer[0] === 0xff && buffer[1] === 0xfe) {
                str = buffer.toString('utf16le');
                // Remove BOM
                str = str.replace(/^\uFEFF/, '');
                fs.writeFileSync(fullPath, str, 'utf8');
                console.log('Converted to UTF-8:', fullPath);
            } else if (buffer.indexOf(0) !== -1 && buffer.indexOf(0) < 10) {
                str = buffer.toString('utf16le');
                fs.writeFileSync(fullPath, str, 'utf8');
                console.log('Converted to UTF-8 (no BOM):', fullPath);
            }
        }
    }
}

processDir(path.join(__dirname, 'src'));
