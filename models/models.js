const mongoose = require("mongoose");

const msgSchema = new mongoose.Schema({
  msg: {
    type: String,
    require: true,
  },
});

const Msg = mongoose.model("messages", msgSchema);
module.exports = Msg;
