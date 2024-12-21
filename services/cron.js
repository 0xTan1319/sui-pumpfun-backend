
const cron = require('node-cron');
const config = require('../config');

cron.schedule('*/30 * * * * *', async () => {
    // console.log('Running a job at 01:00 at America/Sao_Paulo timezone');
  }, {
    scheduled: true,
    timezone: "America/Sao_Paulo"
});