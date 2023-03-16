const Bree = require('bree');
// const Graceful = require('@ladjs/graceful');
const path = require('path');

const bree = new Bree({
  root: path.resolve('app', 'jobs'),
  jobs: [
    {
      name: 'test.job',
      cron: '50 23 * * *',
    },
  ],
});

// // handle graceful reloads, pm2 support, and events like SIGHUP, SIGINT, etc.
// const graceful = new Graceful({brees: [bree]});
// graceful.listen();

// // start all jobs (this is the equivalent of reloading a crontab):
// (async () => {
//   await bree.start();
// })();

bree.start();

module.exports = bree;

