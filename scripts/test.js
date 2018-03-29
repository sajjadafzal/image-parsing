const fs = require('fs')
const path = require('path')
const brain = require('brain.js')
const sharp = require('sharp')

const dataPaths = require('../src/data-paths')

const net = new brain.recurrent.RNN()
const dirs = fs.readdirSync(dataPaths.testSimple)
const trainingData = fs.readFileSync(dataPaths.trainingOutput)
net.fromJSON(JSON.parse(trainingData))
const result = []

/**
 *
 *
 * @param {any} imgPath Path to the image file
 * @param {any} option output for the image
 * @returns Raw data array of size width x height
 */
async function getDataFromImage(imgPath, option) {
  const img = sharp(imgPath)
    // .resize(96, 28)
    .toColourspace('b-w')
    .threshold(32)

  const buff = await img.raw().toBuffer()
  const data = buff
    .toJSON()
    .data.join('')
    .replace(/255/g, '1')

  /*
  img
    .toFormat('png')
    .toFile(path.join(dataPaths.test, 'tmp', `${Math.random()}.png`), err => {
      if (err) console.error('Error writing file: ', err)
    })
  */

  return {
    data,
    option
  }
}

/**
 * Prepares/pre-process image data for for input
 *
 */
function processData() {
  const promises = []
  console.log('\nLoading training data...')

  dirs.forEach(dir => {
    const dirPath = path.join(dataPaths.sample, dir)
    const subDirs = fs.readdirSync(dirPath)

    subDirs.forEach(option => {
      const filePath = path.join(dirPath, option)

      promises.push(getDataFromImage(filePath, dir))
    })
  })

  Promise.all(promises).then(res => {
    for (let i = 0; i < res.length; i += 1) {
      const item = res[i]

      const output = net.runInput(item.data)

      result.push({
        input: item.option,
        output
      })
    }

    console.log('\nResults: ', result)

    fs.writeFileSync(dataPaths.resultsOutput, JSON.stringify(result))

    console.log('\nResults have been saved to: ', dataPaths.resultsOutput)
  })
}

// Starts process
processData()
