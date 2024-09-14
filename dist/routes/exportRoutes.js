"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authenticationMiddleware_1 = require("../middleware/authenticationMiddleware");
const transitiExportController_1 = __importDefault(require("../controllers/transitiExportController"));
const errorHandler_1 = require("../middleware/errorHandler");
const router = (0, express_1.Router)();
// Rotta autenticata per ottenere i transiti in formato CSV
router.get('/transiti/export', authenticationMiddleware_1.authenticationMiddleware, transitiExportController_1.default.exportTransiti);
router.use(errorHandler_1.errorHandler);
exports.default = router;
