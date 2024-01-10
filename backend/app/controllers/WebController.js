const WebController = {
    index: async (req, res) => {
        try {
            res.status(200).json({message: "This is the root page of the project"});
        } catch (error) {
            res.status(500).send(error.message);
        }
    }
}

module.exports = WebController;