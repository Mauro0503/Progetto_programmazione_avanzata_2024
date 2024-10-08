"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const csvExportService_1 = __importDefault(require("../ext/csvExportService"));
const pdfExportService_1 = __importDefault(require("../ext/pdfExportService"));
const pdfStatisticheService_1 = __importDefault(require("../ext/pdfStatisticheService"));
const csvStaticticheService_1 = __importDefault(require("../ext/csvStaticticheService"));
const transitoExportRepository_1 = __importDefault(require("../repositories/transitoExportRepository"));
const statisticheRepository_1 = __importDefault(require("../repositories/statisticheRepository"));
const errorFactory_1 = require("../ext/errorFactory");
class TransitiExportController {
    // Rotta per ottenere i transiti in formato CSV o PDF
    exportTransiti(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { targhe, from, to, formato } = req.body;
                const user = req.user;
                console.log('Parametri ricevuti:', { targhe, from, to, formato });
                if (!targhe || !from || !to) {
                    throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.INVALID_INPUT, 'Targhe, from e to sono richiesti');
                }
                // Ottenere i transiti dal repository
                const transiti = yield transitoExportRepository_1.default.findTransitiByTargheAndPeriodo(targhe, new Date(from), new Date(to), user.id, user.ruolo);
                if (transiti.length === 0) {
                    throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.RESOURCE_NOT_FOUND, 'Nessun transito trovato per i parametri forniti');
                }
                // Generazione del file in base al formato specificato
                if (formato === 'csv') {
                    const csv = yield csvExportService_1.default.generaCsv(transiti);
                    res.header('Content-Type', 'text/csv');
                    res.attachment('transiti.csv');
                    return res.send(csv);
                }
                else if (formato === 'pdf') {
                    const pdf = yield pdfExportService_1.default.generaPdf(transiti);
                    res.header('Content-Type', 'application/pdf');
                    res.attachment('transiti.pdf');
                    return res.send(pdf);
                }
                else {
                    throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.INVALID_INPUT, 'Formato non supportato. Usa "csv" o "pdf".');
                }
            }
            catch (error) {
                console.error('Errore nella rotta exportTransiti:', error);
                next(error);
            }
        });
    }
    getStatistiche(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { from, to, formato } = req.body;
                if (!from || !to) {
                    throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.INVALID_INPUT, 'From e to sono richiesti');
                }
                // Calcolare le statistiche
                const statistiche = yield statisticheRepository_1.default.calcolaStatistiche(new Date(from), new Date(to));
                // Generazione del file in base al formato specificato
                if (formato === 'csv') {
                    const csv = yield csvStaticticheService_1.default.generaCsv(statistiche);
                    res.header('Content-Type', 'text/csv');
                    res.attachment('statistiche.csv');
                    return res.send(csv);
                }
                else if (formato === 'pdf') {
                    const pdf = yield pdfStatisticheService_1.default.generaPdf(statistiche);
                    res.header('Content-Type', 'application/pdf');
                    res.attachment('statistiche.pdf');
                    return res.send(pdf);
                }
                else if (formato === 'json') {
                    return res.json(statistiche);
                }
                else {
                    throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.INVALID_INPUT, 'Formato non supportato. Usa "csv", "pdf" o "json".');
                }
            }
            catch (error) {
                console.error('Errore nella rotta getStatistiche:', error);
                next(error);
            }
        });
    }
    getStatistichePerParcheggio(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { idParcheggio, from, to } = req.body;
                if (!idParcheggio || !from || !to) {
                    throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.INVALID_INPUT, 'idParcheggio, from e to sono richiesti');
                }
                // Calcolare le statistiche per il parcheggio specificato
                const statistiche = yield statisticheRepository_1.default.calcolaStatistichePerParcheggio(idParcheggio, new Date(from), new Date(to));
                return res.json(statistiche);
            }
            catch (error) {
                console.error('Errore nella rotta getStatistichePerParcheggio:', error);
                next(error);
            }
        });
    }
}
exports.default = new TransitiExportController();
