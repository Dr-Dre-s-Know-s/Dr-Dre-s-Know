const mongoose = require("mongoose");
const createError = require("http-errors");

const BattleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  artistId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profile",
    required: true,
  },
  opponentId: { type: mongoose.Schema.Types.ObjectId, ref: "Profile" }, // Optional opponent in duel
  audioURL: { type: String },
  verses: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "Profile" },
      verseText: String,
    },
  ],
  votes: {
    type: [
      {
        voterId: { type: mongoose.Schema.Types.ObjectId, ref: "Profile" },
        voteFor: { type: mongoose.Schema.Types.ObjectId, ref: "Profile" },
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

// Add a pre-save hook to validate that the verses array does not exceed two elements
BattleSchema.pre("save", function (next) {
  if (this.verses.length > 2) {
    return next(createError.BadRequest("The Battle is only between two users"));
  }
  next();
});
module.exports = mongoose.model("Battle", BattleSchema);
