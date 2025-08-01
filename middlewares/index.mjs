import {Sequelize, DataTypes} from 'sequelize';
import userModel from '../models/userModel.mjs'; 
import dotenv from 'dotenv';
import pg from 'pg';


const Pool = pg.Pool

dotenv.config(); 

const DATABASE_URL = process.env.POSTGRES_URL

const sequelize = new Sequelize(DATABASE_URL, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  define: {
    schema: 'public',
  },
});

    sequelize.authenticate().then(() => {
        console.log(`Database connected`)
    }).catch((err) => {
        console.log(err)
    })

    const db = {}
    db.Sequelize = Sequelize
    db.sequelize = sequelize

db.users = userModel(sequelize, DataTypes)

export default db