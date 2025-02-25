"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrivateData = void 0;
const getPrivateData = (req, res) => {
    res.json({ message: "This is a protected route", user: req.user });
};
exports.getPrivateData = getPrivateData;
