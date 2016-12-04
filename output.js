
const testrequest = require('./testrequest')

const testRequestUrlList = ['http://www.wnacg.org', 'http://www.wnacg.org/data/0339/00/0003.jpg']
const logFilePath = 'log.txt'


let test = new testrequest.testRequest(testRequestUrlList, logFilePath)

test.output('http://www.wnacg.org', 'output-home.csv')

test.output('http://www.wnacg.org/data/0339/00/0003.jpg', 'output-picture.csv')
