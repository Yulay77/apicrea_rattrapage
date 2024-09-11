const i18n = require("i18n");

module.exports = async (req, res, next) => {
    const lang = req.headers["accept-language"] || "fr";
    
    req.locale = lang;
    
    i18n.setLocale(lang);
    
    next();
    };
