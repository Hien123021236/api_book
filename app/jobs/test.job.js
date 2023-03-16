const fs = require('fs');
const path = require('path');
const moment = require('moment-timezone');

const {parentPort} = require('worker_threads');

const tmpPath = path.resolve('tmp');

let isCancelled = false;
if (parentPort) {
  parentPort.once('message', (message) => {
    if (message === 'cancel') isCancelled = true;
  });
}

(async () => {
  if (isCancelled) return;
  let count = 0;
  fs
      .readdirSync(tmpPath)
      .filter((file) => {
        const createdAt = moment(fs.statSync(path.join(tmpPath, file)).birthtime);
        const duration = moment.duration(moment().diff(createdAt));
        if (duration.asHours() >= 24) {
          count ++;
          return file;
        };
      })
      .forEach((file) => {
        fs.unlink(path.join(tmpPath, file), function(error) {
          if (parentPort) parentPort.postMessage('done');
          if (--count <= 0) {
            process.exit(0);
          }
        });
      });

  if (count == 0) {
    process.exit(0);
  }
})();
