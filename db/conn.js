import Sequelize from "sequelize";
import dotenv from 'dotenv';

dotenv.config()

let sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql'
    }
);

// Later on when running from Google Cloud, env variables will be passed in container cloud connection config
if (process.env.NODE_ENV === 'production') {
    sequelize = new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASS,
        {
            dialect: 'mysql',
            dialectOptions: {
                socketPath: `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`
            }
        }
    )
    console.log(sequelize)
    console.log('Running from cloud. Connecting to DB through GCP socket.');
}


sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch((error) => {
    console.error('Unable to connect to the database: ', error);
});

export default sequelize;