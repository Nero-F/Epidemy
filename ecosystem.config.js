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
      host : '34.107.103.52',
      ref  : 'origin/master',
      repo : 'git@github.com:Nero-F/Epidemy.git',
      path : '/var/www/Epidemy',
      'pre-deploy-local': '',
      'post-deploy' : 'npm install --production && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
