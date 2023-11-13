import { GraphQLError } from 'graphql'
import { IUser } from '../../models/user'

export const user = {
  Query: {
    users: {
      resolve: async (
        _: any,
        args: Record<string, any>,
        context: { User: any }
      ) => {
        try {
          const list = await context.User.find()
          if (list != null && list.length > 0) {
            return list.map((u: IUser) => {
              return u.transform()
            })
          }
        } catch (error) {
          console.error('> getAllusers error: ', error)
          throw new GraphQLError(
            'You are not authorized to perform this action.',
            {
              extensions: {
                code: '400',
              },
            }
          )
        }
      },
    },
    user: {
      resolve: async (
        _: any,
        args: Record<string, any>,
        context: { User: any }
      ) => {
        try {
          const user = await context.User.findById(args.id)
          if (user != null) {
            return user.transform()
          }
        } catch (error) {
          console.error('> getUser error: ', error)
          throw new GraphQLError('Error retrieving user with id: ' + args.id, {
            extensions: {
              code: '404',
            },
          })
        }
      },
    },
  },
  Mutation: {
    createUser: {
      resolve: async (
        _: any,
        args: Record<string, any>,
        context: { User: any }
      ) => {
        try {
          const createdBook = (
            await context.User.create(args.input)
          ).transform()
          return createdBook
        } catch (error) {
          console.error('> createUser error: ', error)
          throw new GraphQLError(
            'Error saving user with name: ' + args.input.name,
            {
              extensions: {
                code: '400',
              },
            }
          )
        }
      },
    },
  },
}
