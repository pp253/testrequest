
const testrequest = require('./testrequest')

const testRequestUrlList = ['http://www.wnacg.org', 'http://www.wnacg.org/data/0339/00/0003.jpg']
const interval = 60 * 1000
const logFilePath = 'log.txt'


let test = new testrequest.testRequest(testRequestUrlList, logFilePath, interval)

test.test()
