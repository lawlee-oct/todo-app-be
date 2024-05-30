const mongoose = require("mongoose");

const authSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: Number,
    },
    birthday: String,
    gender: String,
    avatar: String,
  },
  { timestamps: true }
);

authSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

var AuthModel = mongoose.model("auth", authSchema);

module.exports = { AuthModel };
