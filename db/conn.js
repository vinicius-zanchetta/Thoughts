import { Sequelize } from 'sequelize'

export const sequelize = new Sequelize('thoughts', 'root', '0906xodo', {
    host: 'localhost',
    dialect: 'mysql',
})
