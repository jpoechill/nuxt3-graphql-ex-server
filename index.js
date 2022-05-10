const { ApolloServer, gql } = require('apollo-server');

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.
  type Todo {
    id: String
    text: String
    completed: Boolean
  }

  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    title: String
    author: String
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    books: [Book]
    todos: [Todo]!
  }

  type Mutation {
    createTodo(text: String!):String
    removeTodo(id: String!):String
  }
`;

const books = [
    {
      title: 'The Awakening',
      author: 'Kate Chopin',
    },
    {
      title: 'City of Glass',
      author: 'Paul Auster',
    },
  ];

const todos = [
  {
    id: 0,
    text: 'Hello from GraphQL',
    completed: false,
  },
  {
    id: 123,
    text: 'Hello from GraphQL',
    completed: false,
  },
];

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
    Query: {
      books: () => books,
      todos: () => todos,
    },
    Mutation: {
      createTodo: (parent, args, context, info) => {
        console.log('inside index.js')

        return todos.push({
          id: Date.now().toString(),
          text: args.text,
          completed: false,
        });
      },
      removeAllTodos: (parent, args, context, info) => {
        todos.length = 0
        return todos.length;
      },
      removeTodo: (parent, args, context, info) => {
        // console.log('123123')
        let list = args.id.split(',').sort((a, b) => a - b)
        for (let t in list) {
          for (let i = 0; i < todos.length; i++) {
            if (todos[i].id == list[t]) {
              todos.splice(i, 1);
            }
          }
        }
        return todos.length;
      }
    }
  };

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});