const jwt = require("jsonwebtoken");
const { User } = require("../models");

module.exports= async (req, res, next) => {
    const autorization = req.headers.authorization;

    if (!autorization) return res.sendStatus(401);
    const [typeToken, token] = autorization.split(/\s+/);
    if (typeToken !== "Bearer") return res.sendStatus(401);

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findByPk(payload.userID);
        next();
    } catch (error) {
        return res.sendStatus(401);
    } 
};

