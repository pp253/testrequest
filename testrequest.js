/**
 * Copyright 2016 pp253
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const request = require('request')
const readline = require('readline')
const fs = require('fs')
const printf = require('printf')

const INTERVAL = 60 * 1000
const LOGFILEPATH = 'log.txt'

const COMMENT_PATTERN = new RegExp(/^#\s/)


function testRequestObject(testRequestUrlList, logFilePath, interval) {
  let testRequestData = {}
  let log = new logObject()
  let timer
  let formet = {
    urlMaxLength: 0
  }
  
  this.init = (testRequestUrlList) => {
    console.log('test request by pp253')
    console.log('')
    console.log('test url list:')
    for (let url of testRequestUrlList) {
      console.log('  ' + url)
    }
    console.log('test interval:', interval, 'ms')
    console.log('log file path:', logFilePath)
    console.log('')
    console.log('start time:   ', (new Date).toLocaleString())
    console.log('')
    
    /* formet */
    formet.urlMaxLength = (() => {
      let max = 0
      for (let url of testRequestUrlList) // FIXME
        if (max < url.length)
          max = url.length
      return max
    })()
    
    for (let url of testRequestUrlList) {
      testRequestData[url] = {
        requestTime: 0,
        responseTime: 0,
        average: -1,
        count: 0
      }
    }
  }
  
  this.test = () => {
    this.dotest()
    
    this.timer = setInterval(this.dotest, interval || 30 * 1000)
  }


  this.dotest = () => {
    for (let url in testRequestData) {
      testRequestData[url].requestTime = Date.now()
      
      request(url, (error) => {
        if (error) {
          console.error(error)
          log.wline([
            url,
            testRequestData[url].requestTime,
            'error'].join(' '))
          return false
        }
        if (testRequestData[url].requestTime == Date.now()) {
          log.wline([
            url,
            testRequestData[url].requestTime,
            'error'].join(' '))
          return false
        }
        if(testRequestData[url].count === 0) {
          log.wline(printf('# %s %d',
            url,
            interval))
        }
        
        testRequestData[url].count++
        testRequestData[url].responseTime = Date.now()
        
        let responseInterval = testRequestData[url].responseTime - testRequestData[url].requestTime
        
        testRequestData[url].average =
          ((testRequestData[url].average * (testRequestData[url].count - 1)) + responseInterval) / testRequestData[url].count
        
        console.log(printf('%s  %-' + formet.urlMaxLength + 's %5dms %+8.2fms',
          (new Date).toLocaleString(),
          url,
          responseInterval,
          responseInterval - testRequestData[url].average))
        
        log.wline([
          url,
          testRequestData[url].requestTime,
          testRequestData[url].responseTime,
          responseInterval].join(' '))
      })
    }
  }
  
  /*
  // under development
  this.analyze = (url) => {
    console.log('analyzing...')
    
    let analyzeData = {
      data: {
        url: '',
        test: []
      },
      responseTime: {
        total: 0,
        average: 0,
        max: 0,
        min: 0,
        distribution: {
          countVsMs: {},
          msVsHours: {}
        }
      },
      error: {
        times: 0
      }
    }
    
    let inblock = 0
    
    log.rline((input) => {
      if (COMMENT_PATTERN.test(input)) {
        let line = input.split(' ')
        
        if (line[1] !== url)
          return false
        
        inblock = 1
      } else {
        // 123
      }
    })
  }
  */
  
  this.output = (url, outputFilePath) => {
    let urlList = []
    
    if (url instanceof Array)
      urlList = url
    else if (typeof url === 'string')
      urlList[0] = url
    else
      return
    
    let outputfile = new logObject(outputFilePath || 'output.csv')
    outputfile.clear()
    
    log.rline((input) => {
      if (COMMENT_PATTERN.test(input))
        return
      
      input = input.split(' ')
      
      if (input.length < 4 || input[0] === '#')
        return
      
      if (!(urlList.includes(input[0])))
        return
      
      outputfile.wline([
        input[0],
        new Date( + input[1]).toLocaleString(),
        input[3]].join(','))
    })
  }
  
  if (!logFilePath)
    logFilePath = LOGFILEPATH
  if (!interval)
    interval = INTERVAL
  
  if (testRequestUrlList)
    this.init(testRequestUrlList)
  
}


function logObject(outputFilePath) {
  this.rline = (callback) => {
    let lineReader = readline.createInterface({
      input: fs.createReadStream(this.filepath)
    })
    lineReader.on('line', callback)
  }
  
  this.wline = (...data) => {
    let options = {encoding: 'utf8', flag: 'a'}
    fs.appendFile(this.filepath, data + '\n', options, () => {})
  }
  
  this.clear = () => {
    fs.truncate(this.filepath, 0, () => {})
  }
  
  this.filepath = outputFilePath || LOGFILEPATH
}

exports.testRequest = testRequestObject
