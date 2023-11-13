import { GraphQLError } from 'graphql'
import { IBook } from '../../models/book'

export const book = {
  Query: {
    books: {
      resolve: async (
        _: any,
        args: Record<string, any>,
        context: { Book: any }
      ) => {
        try {
          const list = await context.Book.find()
          if (list != null && list.length > 0) {
            return list.map((u: IBook) => {
              return u.transform()
            })
          }
        } catch (error) {
          console.error('> getAllBooks error: ', error)
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
  },
  Mutation: {
    createBook: {
      resolve: async (
        _: any,
        args: Record<string, any>,
        context: { Book: any }
      ) => {
        const createdBook = (await context.Book.create(args.input)).transform()
        return createdBook
      },
    },
  },
}
