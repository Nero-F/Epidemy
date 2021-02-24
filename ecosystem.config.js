module.exports = {
  apps : [{
    script: 'src/server.js',
    watch: '.'
  }, {
    script: './service-worker/',
    watch: ['./service-worker']
  }],

  deploy : {
    production : {
      user : 'nero_f',
      host : '152.228.134.62',
      ref  : 'origin/master',
      repo : 'git@github.com:Nero-F/Epidemy.git',
      path : 'home/nero_f',
      'pre-deploy-local': '',
      'post-deploy' : 'npm install --production && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
