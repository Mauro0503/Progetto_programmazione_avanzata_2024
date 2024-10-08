import Varco from '../models/varco';
import parcheggioDao from './parcheggioDao';
import { ErrorGenerator, ApplicationErrorTypes } from '../ext/errorFactory';
import { VarcoAttributes, VarcoCreationAttributes } from '../models/varco';
import { DaoI } from './DaoI';
import { Transaction } from 'sequelize';
import { CustomHttpError } from '../ext/errorFactory';

/**
 * Classe VarcoDao che implementa l'interfaccia DaoI per Varco.
 *
 * Fornisce metodi per gestire le operazioni CRUD relative ai varchi nel database.
 */
class VarcoDao implements DaoI<VarcoAttributes, number> {
  /**
   * Crea un nuovo varco.
   *
   * @param {VarcoCreationAttributes} varcoData Dati per la creazione del nuovo varco.
   * @param {Transaction} [transaction] Transazione Sequelize opzionale per garantire l'atomicità.
   * @returns {Promise<Varco>} Promise che restituisce il varco appena creato.
   */
  async create(
    varcoData: VarcoCreationAttributes,
    transaction?: Transaction
  ): Promise<Varco> {
    try {
      // Verifica che il parcheggio esista
      const parcheggio = await parcheggioDao.findById(varcoData.id_parcheggio);
      if (!parcheggio) {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.RESOURCE_NOT_FOUND,
          `Parcheggio con ID ${varcoData.id_parcheggio} non trovato`
        );
      }
      const nuovoVarco = await Varco.create(varcoData, { transaction });
      return nuovoVarco;
    } catch (error) {
      if (error instanceof CustomHttpError) {
        // Rilancia l'errore se è un errore gestito
        throw error;
      } else {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.SERVER_ERROR,
          'Errore nella creazione del varco'
        );
      }
    }
  }

  /**
   * Recupera tutti i varchi.
   *
   * @returns {Promise<Varco[]>} Promise che restituisce un array di varchi.
   */
  async findAll(): Promise<Varco[]> {
    try {
      const varchi = await Varco.findAll();
      return varchi;
    } catch (error) {
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.SERVER_ERROR,
        'Errore nel recupero dei varchi'
      );
    }
  }

  /**
   * Recupera un varco specifico per ID.
   *
   * @param {number} id ID del varco.
   * @returns {Promise<Varco | null>} Promise che restituisce un varco o null se non esistente.
   */
  async findById(id: number): Promise<Varco | null> {
    try {
      const varco = await Varco.findByPk(id);
      if (!varco) {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.RESOURCE_NOT_FOUND,
          `Varco con ID ${id} non trovato`
        );
      }
      return varco;
    } catch (error) {
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.SERVER_ERROR,
        'Errore nel recupero del varco'
      );
    }
  }

  /**
   * Aggiorna un varco.
   *
   * @param {number} id ID del varco da aggiornare.
   * @param {Partial<VarcoAttributes>} varcoData Dati parziali per aggiornare il varco.
   * @returns {Promise<boolean>} Promise che restituisce true se l'aggiornamento è avvenuto con successo, false in caso contrario.
   */
  async update(
    id: number,
    varcoData: Partial<VarcoAttributes>
  ): Promise<boolean> {
    try {
      const [numUpdated] = await Varco.update(varcoData, { where: { id } });
      if (numUpdated === 0) {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.RESOURCE_NOT_FOUND,
          `Varco con ID ${id} non trovato`
        );
      }
      return numUpdated === 1;
    } catch (error) {
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.SERVER_ERROR,
        "Errore nell'aggiornamento del varco"
      );
    }
  }

  /**
   * Elimina un varco.
   *
   * @param {number} id ID del varco da eliminare.
   * @returns {Promise<boolean>} Promise che restituisce true se la cancellazione è avvenuta con successo, false in caso contrario.
   */
  async delete(id: number): Promise<boolean> {
    try {
      const numDeleted = await Varco.destroy({ where: { id } });
      if (numDeleted === 0) {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.RESOURCE_NOT_FOUND,
          `Varco con ID ${id} non trovato`
        );
      }
      return numDeleted === 1;
    } catch (error) {
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.SERVER_ERROR,
        "Errore nell'eliminazione del varco"
      );
    }
  }

  /**
   * Recupera tutti i varchi di un parcheggio specifico.
   *
   * @param {number} idParcheggio ID del parcheggio.
   * @returns {Promise<Varco[]>} Promise che restituisce un array di varchi per il parcheggio specificato.
   */
  async findByParcheggio(idParcheggio: number): Promise<Varco[]> {
    try {
      const varchi = await Varco.findAll({
        where: { id_parcheggio: idParcheggio },
      });
      return varchi;
    } catch (error) {
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.SERVER_ERROR,
        'Errore nel recupero dei varchi per il parcheggio specificato'
      );
    }
  }

  /**
   * Recupera tutti i varchi bidirezionali.
   *
   * @returns {Promise<Varco[]>} Promise che restituisce un array di varchi bidirezionali.
   */
  async findBidirezionali(): Promise<Varco[]> {
    try {
      const varchi = await Varco.findAll({ where: { bidirezionale: true } });
      return varchi;
    } catch (error) {
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.SERVER_ERROR,
        'Errore nel recupero dei varchi bidirezionali'
      );
    }
  }

  /**
   * Recupera tutti i varchi di un tipo specifico.
   *
   * @param {('INGRESSO' | 'USCITA')} tipo Tipo del varco da cercare.
   * @returns {Promise<Varco[]>} Promise che restituisce un array di varchi del tipo specificato.
   */
  async findByTipo(tipo: 'INGRESSO' | 'USCITA'): Promise<Varco[]> {
    try {
      const varchi = await Varco.findAll({ where: { tipo } });
      return varchi;
    } catch (error) {
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.SERVER_ERROR,
        'Errore nel recupero dei varchi per il tipo specificato'
      );
    }
  }

  /**
   * Elimina tutti i varchi associati a un parcheggio specifico.
   *
   * @param {number} idParcheggio ID del parcheggio.
   * @returns {Promise<boolean>} Promise che restituisce true se almeno un varco è stato eliminato.
   */
  async deleteByParcheggioId(idParcheggio: number): Promise<boolean> {
    try {
      const numDeleted = await Varco.destroy({
        where: { id_parcheggio: idParcheggio },
      });
      return numDeleted > 0;
    } catch (error) {
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.SERVER_ERROR,
        "Errore nell'eliminazione dei varchi associati al parcheggio"
      );
    }
  }
}

export default new VarcoDao();
