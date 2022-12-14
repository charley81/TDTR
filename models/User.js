import mongoose from 'mongoose'
const { Schema } = mongoose
import validator from 'validator'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const UserSchema = new Schema({
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
    minLength: 6,
    select: false
  },
  location: {
    type: String,
    maxLength: 20,
    trim: true,
    default: 'your city'
  }
  // https://mongoosejs.com/docs/validation.html#custom-validators
})

// hash the password.. run this before saving in DB
UserSchema.pre('save', async function () {
  //  this.modifiedPaths() returns an array of values that are different from the ones in the database... used during update user. if nothing updated, returns empty array

  // check if modifying password and if not return... this stops error getting when updating user and not passing password to this user.save func
  if (!this.isModified('password')) return

  const salt = await bcrypt.genSalt(10)
  // this sets the password value to a hashed password
  this.password = await bcrypt.hash(this.password, salt)
})

// Custom method added to userSchema... use this on the created user in frontend to create a jwt
UserSchema.methods.createJWT = function () {
  return jwt.sign({ userId: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME
  })
}

// compare user password with password for this user in DB
UserSchema.methods.comparePassword = async function (userPassword) {
  const isMatch = await bcrypt.compare(userPassword, this.password)
  return isMatch
}

export default mongoose.model('User', UserSchema)
