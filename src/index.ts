import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import cors from 'cors'
import express, { json } from 'express'
import http from 'http'
import dotenv from 'dotenv'
import mongoose from 'mongoose'

import schema from './graphql'

import * as DBModels from './models'
import AuthMiddleware, { MyRequest } from './middleware/auth'

dotenv.config()

const PORT = process.env.PORT as string

const app = express()

// Middlewares to the express app
app.use(cors())
app.use(json())
app.use(AuthMiddleware)

// Create a new Http server
const httpServer = http.createServer(app)

// Create Instance of Apollo Server
const server = new ApolloServer({
  schema,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
})

// const traceId = uuidv4()
const startApp = async () => {
  try {
    await server.start()

    app.use(
      `/graphql`,
      expressMiddleware(server, {
        context: async ({ req }) => {
          const { isAuth, user } = req as MyRequest

          return {
            req,
            isAuth,
            user,
            ...DBModels,
          }
        },
      })
    )

    await new Promise<void>(resolve =>
      mongoose
        .connect(process.env.MONGO_DB_PATH as string, {
          dbName: 'library',
        })
        .then(() => {
          httpServer.listen({ port: PORT }, resolve)
        })
    )

    console.log(`Apollo Server Started on port ${PORT}`)
  } catch (err) {
    console.log(`Server not started`, err)
  }
}

export default startApp
