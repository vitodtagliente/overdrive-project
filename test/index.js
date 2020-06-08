var express = require('express');
var app = express();
const Connection = require('overdrive-db').Connection;
const Schema = require('overdrive-db').Schema;

app.get('/', async function (req, res) {
    const Potion = Schema.define('Potion', {
        name: {
            type: String,
            required: true,
            trim: true,
            unique: true
        },
        description: {
            type: String,
            required: false,
            trim: true
        },
        value: {
            type: Number,
            required: false,
            default: 0
        }
    });

    console.log(await Potion.all());
    console.log(await Potion.count());

    res.json(await Potion.all());
});

app.listen(3000, function () {
    Connection.connect(
        Connection.Type.MongoDB,
        'mongodb://127.0.0.1/mrpg',
        null,
        () => {
            console.log('Example app listening on port 3000!');
        },
        (err) => {
            error(err);
        }
    );
});