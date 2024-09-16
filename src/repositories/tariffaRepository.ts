import TariffaDao from '../dao/tariffaDao';
import Tariffa, {
  TariffaAttributes,
  TariffaCreationAttributes,
} from '../models/tariffa';

class TariffaRepository {
  // Creazione di una nuova tariffa
  async create(tariffaData: TariffaCreationAttributes): Promise<Tariffa> {
    return await TariffaDao.create(tariffaData);
  }

  // Acquisizione di tutte le tariffe
  async findAll(): Promise<Tariffa[]> {
    return await TariffaDao.findAll();
  }

  // Acquisizione di una tariffa specifica per ID
  async findById(id: number): Promise<Tariffa | null> {
    return await TariffaDao.findById(id);
  }

  // Aggiornamento di una tariffa
  async update(
    id: number,
    tariffaData: Partial<TariffaAttributes>
  ): Promise<boolean> {
    return await TariffaDao.update(id, tariffaData);
  }

  // Eliminazione di una tariffa
  async delete(id: number): Promise<boolean> {
    return await TariffaDao.delete(id);
  }
}

export default new TariffaRepository();
