const fs = require('fs');

try {
  fs.accessSync('./tmp/', fs.F_OK);
} catch (e) {
  fs.mkdirSync('./tmp/', '0777');
}
