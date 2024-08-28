import { knex } from 'knex';
// Using JS to import non module
const knexfile = require('./knexfile');

const db = knex(knexfile.development);

export default db;
