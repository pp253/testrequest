
const testrequest = require('./testrequest')

const testRequestUrlList = ['https://www.google.com']
const interval = 60 * 1000
const logFilePath = 'log.txt'

let test = new testrequest.testRequest(testRequestUrlList, logFilePath, interval)

test.test()
