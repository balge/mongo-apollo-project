import gql from 'graphql-tag'

export default gql`
  input CreateBookInput {
    name: String!
    description: String!
  }

  input UpdateBookInput {
    id: String!
    name: String
    description: String
  }

  type PageInfo {
    total: Int
    hasNextPage: Boolean
  }

  type BookConnection {
    edges: [BookConnectionEdge]
    pageInfo: PageInfo
  }

  type BookConnectionEdge {
    node: Book
  }

  type Book {
    id: ID!
    name: String!
    description: String!
  }

  extend type Query {
    books(page: PageParam): BookConnection
    book(id: String!): Book
  }

  extend type Mutation {
    """
    创建图书
    """
    createBook(input: CreateBookInput!): Book @isAuth
    """
    更新图书
    """
    updateBook(input: UpdateBookInput!): Book @isAuth
    """
    删除图书
    """
    deleteBook(id: String!): Book @isAuth
  }
`
