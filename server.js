const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./src/schema.js');


const app = express();
app.use('/api', graphqlHTTP({
  schema,
  graphiql: true, // set to false if you don't want graphiql enabled
}));

const PORT = process.env.PORT || 3000;
app.listen(PORT);
console.log(`GraphQL API server running at localhost:${PORT}`);
