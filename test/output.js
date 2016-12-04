
const testrequest = require('./testrequest')

const testRequestUrlList = ['https://www.google.com']
const logFilePath = 'log.txt'

let test = new testrequest.testRequest(testRequestUrlList, logFilePath)

test.output('https://www.google.com', 'output.csv')
