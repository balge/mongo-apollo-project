import gql from 'graphql-tag'

export default gql`
  type User {
    id: ID!
    name: String!
    password: String!
    email: String!
  }

  input CreateUserInput {
    name: String!
    password: String!
    email: String!
  }

  input UpdateUserInput {
    id: String!
    name: String!
    email: String!
  }

  extend type Query {
    users: [User]
    user(id: String!): User @isAuth
  }

  extend type Mutation {
    createUser(input: CreateUserInput!): User
    updateUser(input: UpdateUserInput!): User @isAuth
    deleteUser(id: String!): User @isAuth
  }
`
