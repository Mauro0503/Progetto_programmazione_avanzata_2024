import VarcoDao from '../dao/varcoDao';
import UtenteDao from '../dao/utenteDao';
import { VarcoAttributes, VarcoCreationAttributes } from '../models/varco';
import Varco from '../models/varco';
import { Sequelize } from 'sequelize';
import Database from '../db/database';
import { ErrorGenerator, ApplicationErrorTypes } from '../ext/errorFactory';
import { CustomHttpError } from '../ext/errorFactory';

class VarcoRepository {
  private sequelize: Sequelize;

  constructor() {
    this.sequelize = Database.getInstance();
  }
  /**
   * Creazione di un nuovo varco
   *
   * @param {VarcoCreationAttributes} varcoData
   * @returns {Promise<Varco>}
   */
  async create(varcoData: VarcoCreationAttributes): Promise<Varco> {
    const transaction = await this.sequelize.transaction();
    try {
      // Crea il nuovo varco
      const nuovoVarco = await VarcoDao.create(varcoData, transaction);

      // Crea l'utente "varco" associato
      await UtenteDao.create(
        {
          nome: `UtenteVarco-${nuovoVarco.id}`,
          ruolo: 'varco',
          username: `varco${nuovoVarco.id}`,
        },
        transaction
      );

      await transaction.commit();
      return nuovoVarco;
    } catch (error) {
      await transaction.rollback();
      if (error instanceof CustomHttpError) {
        // Rilancia l'errore originale se è un errore gestito
        throw error;
      } else {
        // Genera un nuovo errore per gli errori non gestiti
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.SERVER_ERROR,
          "Errore nella creazione del varco e dell'utente varco"
        );
      }
    }
  }

  /**
   * Ottenere tutti i varchi
   *
   * @returns {Promise<Varco[]>}
   */
  async findAll(): Promise<Varco[]> {
    // Chiama il metodo del DAO per ottenere tutti i varchi
    return VarcoDao.findAll();
  }

  /**
   * Ottenere un varco specifico per ID
   *
   * @param {number} id
   * @returns {Promise<Varco | null>}
   */
  async findById(id: number): Promise<Varco | null> {
    // Chiama il metodo del DAO per ottenere il varco con un ID specifico
    return VarcoDao.findById(id);
  }

  /**
   * Aggiornare un varco
   *
   * @param {number} id
   * @param {Partial<VarcoAttributes>} varcoData
   * @returns {Promise<boolean>}
   */
  async update(
    id: number,
    varcoData: Partial<VarcoAttributes>
  ): Promise<boolean> {
    // Chiama il metodo del DAO per aggiornare un varco
    return VarcoDao.update(id, varcoData);
  }

  /**
   * Eliminare un varco
   *
   * @param {number} id
   * @returns {Promise<boolean>}
   */
  async delete(id: number): Promise<boolean> {
    // Chiama il metodo del DAO per eliminare un varco
    return VarcoDao.delete(id);
  }

  /**
   * Ottenere tutti i varchi di un parcheggio specifico
   *
   * @param {number} idParcheggio
   * @returns {Promise<Varco[]>}
   */
  async findByParcheggio(idParcheggio: number): Promise<Varco[]> {
    // Chiama il metodo del DAO per ottenere tutti i varchi di un parcheggio specifico
    return VarcoDao.findByParcheggio(idParcheggio);
  }

  /**
   * Ottenere tutti i varchi bidirezionali
   *
   * @returns {Promise<Varco[]>}
   */
  async findBidirezionali(): Promise<Varco[]> {
    // Chiama il metodo del DAO per ottenere tutti i varchi bidirezionali
    return VarcoDao.findBidirezionali();
  }

  /**
   * Ottenere tutti i varchi di un tipo specifico
   *
   * @param {('INGRESSO' | 'USCITA')} tipo
   * @returns {Promise<Varco[]>}
   */
  async findByTipo(tipo: 'INGRESSO' | 'USCITA'): Promise<Varco[]> {
    // Chiama il metodo del DAO per ottenere tutti i varchi di un tipo specifico
    return VarcoDao.findByTipo(tipo);
  }
}

export default new VarcoRepository();
