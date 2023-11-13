import { defaultFieldResolver, GraphQLError, GraphQLSchema } from 'graphql'
import { getDirective, MapperKind, mapSchema } from '@graphql-tools/utils'

export function authDirective(
  directiveName: string
): (schema: GraphQLSchema) => GraphQLSchema {
  return schema =>
    mapSchema(schema, {
      [MapperKind.OBJECT_FIELD]: fieldConfig => {
        const upperDirective = getDirective(
          schema,
          fieldConfig,
          directiveName
        )?.[0]
        if (upperDirective) {
          const { resolve = defaultFieldResolver } = fieldConfig
          return {
            ...fieldConfig,
            resolve: async function (source, args, context, info) {
              const { isAuth } = context
              if (isAuth) {
                const result = await resolve(source, args, context, info)
                return result
              } else {
                throw new GraphQLError(
                  'You must be the authenticated user to get this information.',
                  {
                    extensions: {
                      code: '403',
                    },
                  }
                )
              }
            },
          }
        }
      },
    })
}
