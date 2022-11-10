import mongoose from 'mongoose'
const { Schema } = mongoose
import validator from 'validator'
import bcrypt from 'bcryptjs'

const userSchema = new Schema({
  firstName: {
    type: String,
    required: [true, 'please provide a name'],
    minLength: 3,
    maxLength: 20,
    trim: true
  },
  lastName: {
    type: String,
    maxLength: 20,
    trim: true,
    default: 'last name'
  },
  email: {
    type: String,
    required: [true, 'please provide an email'],
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: 'please provide a valid email'
    }
  },
  password: {
    type: String,
    required: [true, 'please provide a password'],
    minLength: 6
  },
  location: {
    type: String,
    maxLength: 20,
    trim: true,
    default: 'your city'
  }
  // https://mongoosejs.com/docs/validation.html#custom-validators
})

// hash the password
userSchema.pre('save', async function () {
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

export default mongoose.model('User', userSchema)
