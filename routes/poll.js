const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Vote = require('../models/Vote');

// Load environment variables
require('dotenv').config();

const Pusher = require('pusher');

// Initialize Pusher with environment variables
const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: process.env.PUSHER_CLUSTER,
    useTLS: true
});

router.get('/', (req, res) => {
    Vote.find().then(votes => res.json({ success: true, votes: votes }));
});

router.post('/', (req, res) => {
    const newVote = {
        os: req.body.os,
        points: 1
    };

    new Vote(newVote).save().then(vote => {
        // Trigger Pusher event when vote is saved
        pusher.trigger("os-poll", "os-vote", {
            points: parseInt(vote.points),
            os: vote.os
        });

        return res.json({ success: true, message: 'Thank you for voting' });
    });
});

module.exports = router;
