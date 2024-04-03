import { APIGatewayProxyEventHeaders } from 'aws-lambda'
import csv from 'csvtojson'
import multipart from 'parse-multipart'

export class ProcessCsvTransactionCore {
  async execute(base64EncodedCsv: string, headers: APIGatewayProxyEventHeaders) {
    const body = Buffer.from(base64EncodedCsv.toString(), 'base64') // AWS case
    const boundary = multipart.getBoundary(headers['content-type']!)
    const buff = multipart.Parse(body, boundary)
    const csvDataString = buff[0].data.toString('utf8')
    const csvData = await csv({
      delimiter: ';',
    }).fromString(csvDataString)
    console.log('END :: ', csvData[0])
    return csvData
  }
}
