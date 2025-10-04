const fs = require('fs');
const path = require('path');

const input = path.join(__dirname, '..', 'favicon.png');
const output = path.join(__dirname, '..', 'favicon.ico');

if (!fs.existsSync(input)) {
  console.error('Input file not found:', input);
  process.exit(1);
}

const png = fs.readFileSync(input);
const pngSize = png.length;

// ICONDIR (6 bytes)
const iconDir = Buffer.alloc(6);
iconDir.writeUInt16LE(0, 0); // reserved
iconDir.writeUInt16LE(1, 2); // type (1 = icon)
iconDir.writeUInt16LE(1, 4); // count

// ICONDIRENTRY (16 bytes)
const entry = Buffer.alloc(16);
entry.writeUInt8(0, 0); // width (0 = 256)
entry.writeUInt8(0, 1); // height (0 = 256)
entry.writeUInt8(0, 2); // colorCount
entry.writeUInt8(0, 3); // reserved
entry.writeUInt16LE(0, 4); // planes
entry.writeUInt16LE(32, 6); // bitCount
entry.writeUInt32LE(pngSize, 8); // bytesInRes
entry.writeUInt32LE(iconDir.length + entry.length, 12); // imageOffset

const ico = Buffer.concat([iconDir, entry, png]);
fs.writeFileSync(output, ico);
console.log('Created', output, '(', pngSize, 'bytes PNG embedded )');
