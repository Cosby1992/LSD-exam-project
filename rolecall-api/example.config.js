const config = {
    app: {
      port: 3000
    },
    db: {
      host: 'localhost',
      port: '27017',
      name: 'user-database'
    },
    jwt: {
        secret: '256-bit-secret-key'
    }
};
   
module.exports = config;