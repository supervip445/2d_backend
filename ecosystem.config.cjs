/**
 * PM2 ecosystem config for 2d3d_backend
 * Run from project root: pm2 start ecosystem.config.cjs
 * If errored, check: pm2 logs 2d3d-backend --lines 100
 */

const path = require('path');

module.exports = {
  apps: [
    {
      name: '2d3d-backend',
      script: './src/index.ts',
      cwd: path.join(__dirname),
      interpreter: 'node',
      interpreter_args: '-r ts-node/register',
      exec_mode: 'fork',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      merge_logs: true,
      time: true,
    },
  ],
};
