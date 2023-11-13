import gql from 'graphql-tag'

export default gql`
  directive @isAuth on FIELD_DEFINITION

  input PageParam {
    first: Int
    offset: Int
  }

  type Query {
    _: String
  }

  type Mutation {
    _: String
  }

  type Subscription {
    _: String
  }
`
