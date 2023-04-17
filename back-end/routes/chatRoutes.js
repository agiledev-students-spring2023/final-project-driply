const express = require("express");

const chatRouter = () => {
    const router = express.Router();

    router.post("/create-room", (req, res) => {

        try {
            const { chatId } = req.body;
            console.log(chatId);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ success: false, message: "Error trying to create chat room" });
        }

        res.json({ message: "created chat room" });
    });

    return router;
}

// export the router
module.exports = chatRouter;