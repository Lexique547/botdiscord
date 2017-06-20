// Package Dependencies
const fs = require('fs')
const path = require('path')
const create = require('create-if-not-exist')

// Define DB Location
const DB_PATH = path.join(__dirname, '..', 'shared', 'db', 'data.json')

/**
 * Creates the DB if it doesn't exist already
 * @returns {void}
 */
const main = () => {
  // Create Database
  // Well it isn't really a database
  create(DB_PATH, JSON.stringify({}, null, 0))
}

/**
 * Access the Database
 * @returns {Promise.<Object>}
 * @throws {Promise.<Error>}
 */
const accessDB = () => new Promise((resolve, reject) => {
  fs.readFile(DB_PATH, 'utf8', (err, res) => {
    if (err) reject(err)
    else resolve(JSON.parse(res))
  })
})

/**
 * Overwrite Database Info
 * @param {Object} obj - New database object
 * @returns {Promise.<void>}
 * @throws {Promise.<Error>}
 */
const saveDB = obj => new Promise((resolve, reject) => {
  fs.writeFile(DB_PATH, JSON.stringify(obj, null, 2), err => {
    if (err) reject(err)
    else resolve()
  })
})

module.exports = {
  main: main,
  updateGuilds: updateGuilds,
  accessDB: accessDB,
  saveDB: saveDB,
}
