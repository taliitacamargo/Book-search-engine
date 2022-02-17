const express = require('express');
const path = require('path');
const db = require('./config/connection');
// const routes = require('./routes');
const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./schemas');
const { authMiddleware } = require('./utils/auth');

const app = express();
const PORT = process.env.PORT || 3001;
let server = null;

// console.log(resolvers.Mutation);

async function startServer() {
  try {
    server = await new ApolloServer({
      typeDefs,
      resolvers,
      context: authMiddleware,
    });
    await server.start()
    await server.applyMiddleware({ app })
  }
  catch(err) {
    console.log(err);
  }
}

startServer();



app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});
// app.use(routes);

db.once('open', () => {
  console.log(server.config.resolvers.Mutation)
  app.listen(PORT, () => console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`));
});
