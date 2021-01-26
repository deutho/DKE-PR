require('dotenv').config();
const express = require('express');
const redis = require('redis');

const app = express();
const client = redis.createClient({
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
});

const port = process.env.PORT || 5050;

app.get('/', (req, res) => {
    res.status(200).send({
        message: "Looks like you've hit the root url",
        availableurls: [
            " post /:user/:value",
            " get /:user",
            " delete /:user/:value"
        ],
        
    })
});

app.get('/:user', (req, res) => {
    client.lrange(req.params.user, 0, -1, (err, reply) => {
        res.status(200).send({
            notifications: reply
        });
    });
});

app.post('/:user/:value', (req, res) => {
    // client.set(req.params.user, req.params.value);
    client.lpush(req.params.user, [req.params.value])
    res.status(200).send({
        status: 'OK'
    });
});

app.delete('/:user/:value', (req, res) => {
    client.lrem(req.params.user, 0, req.params.value, function(err, data){
        console.log("deleted " + data + " values");
    });
    res.status(200).send({
        status: 'OK'
    });
});

app.delete('/:user', (req, res) => {
    client.del(req.params.user);
    res.status(200).send({
        status: 'OK'
    });
});

app.get('*', function(req, res){
    res.status(400).send({
        message: "what???",
        status: 404
    });
});

app.listen(port, () => {
    console.log(`App successfully started on http://localhost:${port}`);
})