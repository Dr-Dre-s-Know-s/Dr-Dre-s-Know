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
  verseText: { type: String },
  votes: { type: Number, default: 0 },
  createdDate: { type: Date, default: Date.now },
});
module.exports = mongoose.model("Battle", BattleSchema);
