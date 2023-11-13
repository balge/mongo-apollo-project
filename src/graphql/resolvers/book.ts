import { GraphQLError } from 'graphql'
import { IBook } from '../../models/book'
import { PageParam } from '../../types'

export const book = {
  Query: {
    books: {
      resolve: async (
        _: any,
        { page }: { page: PageParam },
        { Book }: { Book: any }
      ) => {
        try {
          const total = await Book.countDocuments()
          const list = await Book.find().skip(page.offset).limit(page.first)
          const hasNextPage = page.offset + page.first < total
          return {
            edges: list.map((it: IBook) => ({
              node: it.transform(),
            })),
            pageInfo: {
              total,
              hasNextPage,
            },
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
        console.log(args, 'args')
        try {
          const createdBook = (
            await context.Book.create(args.input)
          ).transform()
          return createdBook
        } catch (error) {
          console.error('> createBook error: ', error)
          throw new GraphQLError(
            'Error saving book with name: ' + args.input.name,
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
