"use strict";var e=require("@apollo/server"),r=require("@apollo/server/express4"),t=require("@apollo/server/plugin/drainHttpServer"),o=require("cors"),n=require("express"),i=require("http"),s=require("dotenv"),a=require("mongoose"),u=require("@graphql-tools/schema"),p=require("graphql-tag"),c=require("graphql"),d=require("@graphql-tools/utils"),l=require("jsonwebtoken"),h=require("uuid"),g=[p`
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
`,p`
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
`,p`
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
`];const m=[{Query:{books:{resolve:async(e,{page:r},{Book:t})=>{try{const e=await t.countDocuments(),o=await t.find().skip(r.offset).limit(r.first),n=r.offset+r.first<e;return{edges:o.map((e=>({node:e.transform()}))),pageInfo:{total:e,hasNextPage:n}}}catch(e){throw console.error("> getAllBooks error: ",e),new c.GraphQLError("You are not authorized to perform this action.",{extensions:{code:"400"}})}}}},Mutation:{createBook:{resolve:async(e,r,t)=>{console.log(r,"args");try{return(await t.Book.create(r.input)).transform()}catch(e){throw console.error("> createBook error: ",e),new c.GraphQLError("Error saving book with name: "+r.input.name,{extensions:{code:"400"}})}}}}},{Query:{users:{resolve:async(e,r,t)=>{try{const e=await t.User.find();if(null!=e&&e.length>0)return e.map((e=>e.transform()))}catch(e){throw console.error("> getAllusers error: ",e),new c.GraphQLError("You are not authorized to perform this action.",{extensions:{code:"400"}})}}},user:{resolve:async(e,r,t)=>{try{const e=await t.User.findById(r.id);if(null!=e)return e.transform()}catch(e){throw console.error("> getUser error: ",e),new c.GraphQLError("Error retrieving user with id: "+r.id,{extensions:{code:"404"}})}}}},Mutation:{createUser:{resolve:async(e,r,t)=>{try{return(await t.User.create(r.input)).transform()}catch(e){throw console.error("> createUser error: ",e),new c.GraphQLError("Error saving user with name: "+r.input.name,{extensions:{code:"400"}})}}}}}];const y=u.makeExecutableSchema({typeDefs:g,resolvers:m});var S,v=(S="isAuth",e=>d.mapSchema(e,{[d.MapperKind.OBJECT_FIELD]:r=>{const t=d.getDirective(e,r,S)?.[0];if(t){const{resolve:e=c.defaultFieldResolver}=r;return{...r,resolve:async function(r,t,o,n){const{isAuth:i}=o;if(i)return await e(r,t,o,n);throw new c.GraphQLError("You must be the authenticated user to get this information.",{extensions:{code:"403"}})}}}}}))(y);const f={name:{type:a.SchemaTypes.String,required:!0,unique:!0},description:{type:a.SchemaTypes.String,required:!0}},w=new a.Schema(f);w.methods.transform=function(){var e=this.toObject(),r=e._id;return delete e._id,e.id=r,e};const k=a.model("book",w),q={name:{type:a.SchemaTypes.String,required:!0,unique:!0},password:{type:a.SchemaTypes.String,required:!0},email:{type:a.SchemaTypes.String,required:!0}},B=new a.Schema(q);B.methods.transform=function(){var e=this.toObject();delete e.password;var r=e._id;return delete e._id,e.id=r,e};const I=a.model("user",B);var U=Object.freeze({__proto__:null,Book:k,User:I});"development"===process.env.NODE_ENV?s.config({path:".env.development"}):"production"===process.env.NODE_ENV&&s.config({path:".env.production"});const A=process.env.PORT,E=n();E.use(o()),E.use(n.json()),E.use((async(e,r,t)=>{r.setHeader("Trace-Id",h.v4());const o=e.get("Authorization");if(!o)return e.isAuth=!1,t();let n;try{n=l.verify(o,process.env.SECRET)}catch(r){return e.isAuth=!1,t()}if(!n)return e.isAuth=!1,t();let i=await I.findById(n.id);return i?(e.isAuth=!0,e.user=i,t()):(e.isAuth=!1,t())}));const x=i.createServer(E),_=new e.ApolloServer({schema:v,plugins:[t.ApolloServerPluginDrainHttpServer({httpServer:x})]});(async()=>{try{await _.start(),E.use("/graphql",r.expressMiddleware(_,{context:async({req:e})=>{const{isAuth:r,user:t}=e;return{req:e,isAuth:r,user:t,...U}}})),await new Promise((e=>a.connect(process.env.MONGO_DB_PATH,{dbName:"library"}).then((()=>{x.listen({port:A},e)})))),console.log(`Apollo Server Started on port ${A}`)}catch(e){console.log("Server not started",e)}})();
//# sourceMappingURL=app.js.map
