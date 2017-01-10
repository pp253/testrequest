
const testrequest = require('./testrequest')

const testRequestUrlList = ['...', '...']
const interval = 60 * 1000
const logFilePath = 'log.txt'

let test = new testrequest.testRequest(testRequestUrlList, logFilePath, interval)

test.test()
