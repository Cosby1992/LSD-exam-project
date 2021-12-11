const config = {
  app: {
    port: 3200
  },
  mongodb: {
    host: 'localhost',
    port: '27017',
    userdbname: 'user-database',
    fakecphdbname: 'fake-cphbusiness'
  },
  jwt: {
      secret: '256-bit-secret-key'
  },
  codegeneration: {
    characters: [
      'a','b','c','d','f','g','h','i','j','k',
      'l','m','n','o','p','q','r','s','t','u',
      'v','w','x','y','z','0','1','2','3','4',
      '5','6','7','8','9' 
    ],
    min_ttl: 5,
    max_ttl: 1800
  }
};
 
module.exports = config;