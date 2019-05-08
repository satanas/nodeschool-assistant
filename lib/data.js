const fs = require('fs');

async function read(config) {
  let dataJson = JSON.parse(fs.readFileSync(config.DATA_JSON_PATH, 'utf8'));
  return dataJson;
}

module.exports = {
  read
}
