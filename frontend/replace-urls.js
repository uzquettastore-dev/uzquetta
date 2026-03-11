import fs from 'fs';
import path from 'path';

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = dir + '/' + file;
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if (file.endsWith('.jsx') || file.endsWith('.js')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk('C:/Users/ABUZAR/Desktop/UZquettastore/frontend/src');
const API_URL_VAR = "${import.meta.env.VITE_API_URL || 'http://localhost:5000'}";

let updatedCount = 0;
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;
    
    // Replace 'http://localhost:5000/...' with `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/...`
    content = content.replace(/'http:\/\/localhost:5000(.*?)'/g, "`" + API_URL_VAR + "$1`");
    // Replace "http://localhost:5000/..." with `${...}/...`
    content = content.replace(/"http:\/\/localhost:5000(.*?)"/g, "`" + API_URL_VAR + "$1`");
    // Replace `http://localhost:5000/...` with `${...}/...`
    content = content.replace(/`http:\/\/localhost:5000(.*?)`/g, "`" + API_URL_VAR + "$1`");
    
    if (original !== content) {
        fs.writeFileSync(file, content, 'utf8');
        updatedCount++;
        console.log('Updated:', file);
    }
});
console.log(`Total files updated: ${updatedCount}`);
