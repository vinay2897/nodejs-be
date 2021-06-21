require('dotenv').config()
const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());
const port = 5000

const { Pool } = require('pg')

const pool = new Pool({
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: 5432,
})

app.get('/', (req, res) => {
    pool.connect((err, client, done) => {
        if (err) {
            console.log(err)
            res.send({ error: 'Server Error' });
        }
        client.query(
            `SELECT * FROM users;`, (err, result) => {
                done();
                if (err) {
                    res.send({ error: 'Error saving data' });
                } else {
                    res.send({ msg: 'Successfully fetched', data: result.rows });
                }
            })
    })
});

app.post('/save', (req, res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;

    pool.connect((err, client, done) => {
        if (err) {
            console.log(err)
            res.send({ error: 'Server Error' });
        }
        client.query(
            `INSERT INTO users (userid, fname, lname) VALUES($1, $2, $3)`,
            [uuidv4(), firstName, lastName], (err, result) => {
                done();
                if (err) {
                    res.send({ error: 'Error saving data' });
                } else {
                    res.send({ msg: 'Successfully saved' });
                }
            })
    })
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})