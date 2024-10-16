import { Model, DataTypes, Optional } from 'sequelize';
import { getDb } from '../db'; // Asegúrate de que la ruta sea correcta
import { Sequelize } from 'sequelize';

interface UserAttributes {
  id: number;
  username: string;
  password: string;
}

// Definir un tipo para los atributos opcionales (para el registro)
interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public username!: string;
  public password!: string;
}

export const initUserModel = async () => {
  const db = await getDb(); // Obtener la instancia de la base de datos
  const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.db',
  });

  User.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'User',
    hooks: {
      beforeCreate: async (user: User) => {
        // Aquí puedes agregar lógica antes de crear un usuario, como encriptar la contraseña
      },
    },
  });

  await sequelize.sync(); // Sincronizar el modelo con la base de datos
};

// Llama a esta función para inicializar el modelo en tu archivo principal
