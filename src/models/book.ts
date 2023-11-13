import mongoose from 'mongoose'

/**
 * @description holds book model
 */

/**
 * Book interface
 */
export interface IBook extends mongoose.Document {
  id: string
  name: string
  description: string
  transform: () => IBook
}

/**
 * book schema
 */
const schema: mongoose.SchemaDefinition = {
  name: { type: mongoose.SchemaTypes.String, required: true, unique: true },
  description: { type: mongoose.SchemaTypes.String, required: true },
}

// book collection name
const collectionName: string = 'book'

const bookSchema: mongoose.Schema = new mongoose.Schema(schema)

/**
 * transforms book object,
 * changes _id to id
 */
bookSchema.methods.transform = function () {
  var obj = this.toObject()

  var id = obj._id
  delete obj._id
  obj.id = id

  return obj
}

/**
 * creates book model
 * @param conn database connection
 * @returns book model
 * 官方写的，collectionName book 在数据库会存在一个 复数 books
 * The first argument is the singular name of the collection your model is for. Mongoose automatically looks for the plural, lowercased version of your model name. Thus, for the example above, the model Tank is for the tanks collection in the database.
 */
const BookModel = mongoose.model(collectionName, bookSchema)

export default BookModel
