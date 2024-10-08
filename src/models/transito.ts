import { DataTypes, Model, Optional } from 'sequelize';
import Database from '../db/database';
import Veicolo from './veicolo';
import Varco from './varco';
import Tariffa from './tariffa';
const sequelize = Database.getInstance();

// Definizione degli attributi del model Transito
export interface TransitoAttributes {
  id: number;
  ingresso: Date;
  uscita: Date | null;
  id_veicolo: number;
  id_varco_ingresso: number;
  id_varco_uscita: number | null;
  id_tariffa: number | null;
  importo: number | null;
  veicolo?: Veicolo;
}

// Definizione dei campi opzionali per la creazione
export interface TransitoCreationAttributes
  extends Optional<
    TransitoAttributes,
    | 'id'
    | 'ingresso'
    | 'uscita'
    | 'id_varco_uscita'
    | 'importo'
    | 'id_tariffa'
    | 'id_veicolo'
  > {}

// Definizione del model Transito
class Transito
  extends Model<TransitoAttributes, TransitoCreationAttributes>
  implements TransitoAttributes
{
  public id!: number;

  public ingresso!: Date;

  public uscita!: Date | null;

  public id_veicolo!: number;

  public id_varco_ingresso!: number;

  public id_varco_uscita!: number | null;

  public id_tariffa!: number | null;

  public importo!: number | null;

  public readonly veicolo?: Veicolo;
}

// Inizializzazione del model Transito
Transito.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    ingresso: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    uscita: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    id_veicolo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Veicolo,
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    id_varco_ingresso: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Varco,
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    id_varco_uscita: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Varco,
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    id_tariffa: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Tariffa,
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },

    importo: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
  },
  {
    tableName: 'Transiti',
    sequelize,
    timestamps: true,
  }
);

// Definisci le relazioni tra Transito e gli altri modelli
Veicolo.hasMany(Transito, { foreignKey: 'id_veicolo', as: 'transiti' });
Transito.belongsTo(Veicolo, { foreignKey: 'id_veicolo', as: 'veicolo' });

Varco.hasMany(Transito, { foreignKey: 'id_varco_ingresso', as: 'transitiIn' });
Transito.belongsTo(Varco, {
  foreignKey: 'id_varco_ingresso',
  as: 'varcoIngresso',
});

Varco.hasMany(Transito, { foreignKey: 'id_varco_uscita', as: 'transitiOut' });
Transito.belongsTo(Varco, { foreignKey: 'id_varco_uscita', as: 'varcoUscita' });

Tariffa.hasMany(Transito, { foreignKey: 'id_tariffa', as: 'transiti' });
Transito.belongsTo(Tariffa, { foreignKey: 'id_tariffa', as: 'tariffa' });

export default Transito;
