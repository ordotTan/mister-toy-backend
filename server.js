const express = require('express')
const bodyParser = require('body-parser')
cors = require('cors')

const toyService = require('./services/toy.service.js')
const app = express()
const port = process.env.PORT || 3030;

app.use(bodyParser.json());

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('public'));
} else {
    const corsOptions = {
        origin:  /http:\/\/localhost:\d+/,
        credentials: true
    };
    app.use(cors(corsOptions));
}


//List toys
app.get('/api/toy', (req, res) => {
    const criteria = {
        name: req.query.name,
        type: req.query.type,
        inStock: req.query.inStock,
        sort: req.query.sort
    }
    toyService.query(criteria)
        .then(toys => {
            res.json(toys)
        })
})

//Read toy
app.get('/api/toy/:id', (req, res) => {
    const { id } = req.params;
    toyService.getById(id)
        .then(toy => {
            res.json(toy);
        })
})


//  Create toy
app.post('/api/toy', (req, res) => {
    const toy = req.body;   
    toyService.save(toy)
        .then((savedToy) => {
            res.json(savedToy);
        })
})


//  Update toy
app.put('/api/toy/:id', (req, res) => {
    const toy = req.body;
    toyService.save(toy)
        .then((savedToy) => {
            res.json(savedToy)
        })
})


//  delete toy
app.delete('/api/toy/:id', (req, res) => {
    const { id } = req.params;
    toyService.remove(id)
        .then(() => {
            res.end();
        })
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})