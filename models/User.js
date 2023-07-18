import { DataTypes } from 'sequelize'

import sequelize from '../db/conn.js'

const User = sequelize.define('User', {
    name: {
        type: DataTypes.STRING,
        require: true
    },
    email: {
        type: DataTypes.STRING,
        require: true
    },
    password: {
        type: DataTypes.STRING,
        require: true
    },
})


export default User;