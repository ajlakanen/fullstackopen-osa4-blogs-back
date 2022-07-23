const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  // name: {
  //   type: String,
  //   minlength: 3,
  //   required: true,
  // },
  // number: {
  //   type: String,
  //   minlength: 3,
  //   validate: {
  //     validator: function (v) {
  //       return /^(\d{2}-\d{6,})|(\d{3}-\d{5,})$/.test(v);
  //     },
  //     message: (props) => `${props.value} is not a valid phone number`,
  //   },
  //   required: [true, "phone number required"],
  // },
  title: { type: String, required: true },
  author: String,
  url: { type: String, required: true },
  likes: { type: Number, default: 0 },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

blogSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Blog", blogSchema);
