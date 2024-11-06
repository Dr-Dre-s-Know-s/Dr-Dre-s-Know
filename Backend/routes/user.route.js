const express = require("express");
const router = express.Router();
const createError = require("http-errors");
const User = require("../Models/User.model");
const Battle = require("../Models/Battle.model");
const { verifyAccessToken } = require("../helpers/jwthelper");
const mongoose = require("mongoose");
const { route } = require("./auth.route");
const Profile = require("../Models/Profile.model");

router.put("/create-battle/:artistId", async (req, res, next) => {
  try {
    const { artistId } = req.params;

    const { title, description, verseText } = req.body;

    const artist = await Profile.findOne({ userId: artistId }).populate(
      "rapPortfolio"
    );
    if (!artist) {
      next(createError.NotFound(`Artist does'nt exist`));
    }
    // Create a new battle document

    const newBattle = new Battle({
      title,
      description,
      artistId: artistId,
      verses: [
        {
          userId: artistId,
          verseText: verseText,
        },
      ],
    });
    await newBattle.save();
    artist.rapPortfolio.push(newBattle._id);
    await artist.save();
    res
      .status(201)
      .json({ message: "New battle created successfully", newBattle });
  } catch (err) {
    next(createError.InternalServerError("Failed to create battle"));
  }
});

//when opponent challege a battle for one-one
router.post("/challenge-battle/:battleId", async (req, res, next) => {
  try {
    const { battleId } = req.params;
    const { opponentId, verseText } = req.body;

    // Validate battleId and opponentId
    if (
      !mongoose.Types.ObjectId.isValid(battleId) ||
      !mongoose.Types.ObjectId.isValid(opponentId)
    ) {
      next(createError.NotFound("Invalid battleid or opponentId format"));
    }

    // Find the battle
    const battle = await Battle.findById(battleId);
    if (!battle) {
      next(createError.NotFound("Battle not found"));
    }

    // Check if the opponent has already challenged this battle
    if (battle.verses.some((verse) => verse.userId.toString() === opponentId)) {
      next(createError.Conflict("User has already challenged this battle"));
    }

    // Add the opponent's verse to the battle
    battle.verses.push({
      userId: opponentId,
      verseText: verseText,
    });

    // Update the battle with the new verse
    await battle.save();

    // Update the opponent's rapPortfolio in the User schema
    const opponent = await Profile.findOne({ userId: opponentId });
    if (opponent) {
      opponent.rapPortfolio.push(battle);
      await opponent.save();
    }

    // Optionally, add the battle to the artist's rapPortfolio if not already present
    const artist = await Profile.findOne({ userId: battle.artistId });
    if (
      artist &&
      !artist.rapPortfolio.some((id) => id.toString() === battle._id.toString())
    ) {
      artist.rapPortfolio.push(battle);
      await artist.save();
    }

    res.status(200).json({ message: "Challenge added successfully", battle });
  } catch (error) {
    next(createError.InternalServerError("Failed to add opponent to battle"));
  }
});

router.post("/battle-vote/:battleId", async (req, res, next) => {
  try {
    const { battleId } = req.params;
    const { voterId, voteFor } = req.body; // `voteFor` should be either `artistId` or `opponentId`

    // Validate IDs
    if (
      !mongoose.Types.ObjectId.isValid(battleId) ||
      !mongoose.Types.ObjectId.isValid(voterId) ||
      !mongoose.Types.ObjectId.isValid(voteFor)
    ) {
      next(createError.BadRequest("Invalid Id format"));
    }

    // Find the battle
    const battle = await Battle.findById(battleId);

    if (!battle) {
      next(createError.NotFound("Battle not found"));
    }

    // Check if the voter has already voted
    if (
      battle.votes.some(
        (vote) => vote.voterId.toString() === voterId.toString()
      )
    ) {
      next(createError.BadRequest("User had already voted in this battle"));
    }

    // Add the vote to the battle
    battle.votes.push({
      voterId: voterId,
      voteFor: voteFor,
    });
    const artistId = battle.verses[0]?.userId.toString();
    const opponentId = battle.verses[1]?.userId.toString();

    // Update the vote count
    if (voteFor === artistId) {
      battle.voteCounts.artist += 1;
    } else if (voteFor === opponentId) {
      battle.voteCounts.opponent += 1;
    } else {
      next(createError.BadRequest("Invalid voteFor Id"));
    }

    // Save the updated battle document
    await battle.save();

    res.status(200).json({ message: "Vote added successfully", battle });
  } catch (error) {
    next(createError.InternalServerError("Failed to cast vote"));
  }
});

module.exports = router;
