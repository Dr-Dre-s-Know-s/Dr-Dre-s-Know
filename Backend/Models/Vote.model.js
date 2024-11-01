const mongoose = require("mongoose");
const VoteSchema = new mongoose.Schema({
  battleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Battle",
    required: true,
  },
  voterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  vote: { type: Number, required: true }, // 1 or -1 for upvote/downvote
});
module.exports = mongoose.model("Vote", VoteSchema);
