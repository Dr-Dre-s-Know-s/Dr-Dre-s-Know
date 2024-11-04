const mongoose = require("mongoose");
const BattleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  artistId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  opponentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Optional opponent in duel
  audioURL: { type: String },
  verses: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      verseText: String,
    },
  ],
  votes: {
    type: [
      {
        voterId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        voteFor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],
    default: [], // Ensure the default value is an empty array
  },
  voteCounts: {
    artist: { type: Number, default: 0 },
    opponent: { type: Number, default: 0 },
  },
  createdDate: { type: Date, default: Date.now },
});
module.exports = mongoose.model("Battle", BattleSchema);
