import { makeExecutableSchema } from '@graphql-tools/schema'
import typeDefs from './typeDefs'
import resolvers from './resolvers'
import { authDirective } from './directives/auth'

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
})

export default authDirective('isAuth')(schema)
