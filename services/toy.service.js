const utilService = require('./util.service.js')
const fs = require('fs');
const toys = require('../data/toy.json');


function query(criteria) {
    var toysToReturn = toys;

    if (criteria.name) {
        toysToReturn = toysToReturn.filter(toy => toy.name.toLowerCase().includes(criteria.name.toLowerCase()))
    }
    if (criteria.type) {
        toysToReturn = toysToReturn.filter(toy => toy.type === criteria.type)
    }
    if (criteria.inStock) {
        toysToReturn = toysToReturn.filter(toy => {
            if (criteria.inStock === 'true') return toy.inStock
            else return !toy.inStock
        })
    }

    return Promise.resolve(toysToReturn);

}

function getById(toyId) {
    const currToy = toys.find(toy => {
        return (toy._id.toString() === toyId.toString())
    })
    return Promise.resolve(currToy);
}


function remove(toyId) {
    const idx = toys.findIndex(toy => toy._id.toString() === toyId.toString())
    if (idx !== -1)
        toys.splice(idx, 1);
    return _saveToFile();

}

function save(toy) {
    if (toy._id) {
        const idx = toys.findIndex(currToy => currToy._id.toString() === toy._id.toString())
        toy.updatedAt = Date.now();
        toys[idx] = toy;
    } else { // New toy
        toy._id = utilService.makeId()
        toy.createdAt = Date.now();
        toys.unshift(toy);
    }
    return _saveToFile().then(() => toy)

}


module.exports = {
    query,
    getById,
    remove,
    save,
}


function _saveToFile() {
    return new Promise((resolve, reject) => {
        const str = JSON.stringify(toys, null, 2);
        fs.writeFile('data/toy.json', str, function (err) {
            if (err) {
                console.log('Had Problems', err)
                return reject(new Error('Cannot update toys file'));
            }
            resolve()
        });

    });

}