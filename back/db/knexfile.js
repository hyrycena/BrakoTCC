import "dotenv/config";

const {
    DB_NAME: dbName,
    DB_HOST: dbHost,
    DB_USER: dbUser,
    DB_PORT: dbPort,

} = process.env;



const knex = {
    client: 'mysql2',
    debug: true,
    connection: {
        host: dbHost,
        port: dbPort,
        user: dbUser,
        database: dbName,
    }
}

export default knex