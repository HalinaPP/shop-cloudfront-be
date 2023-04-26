import { S3Event } from 'aws-lambda';
import { S3 } from 'aws-sdk';
import csv from 'csv-parser';
import { REGION } from '../constants';
import { errorResponse } from '../errors-hadler';

export const importFileParser = async (event: S3Event) => {
  const s3 = new S3({ region: REGION, signatureVersion: 'v4' });

  for (const record of event.Records) {
    const s3Bucket = record.s3.bucket.name;
    const csvDataFile = record.s3.object.key;

    console.log('file:', csvDataFile, ' will be parsed in a bucket:', s3Bucket);

    const params = {
      Bucket: s3Bucket,
      Key: csvDataFile
    };

    try {
      s3.getObject(params)
        .createReadStream()
        .pipe(csv())
        .on('error', (error) =>
          console.log(`error in parcing csv file: ${error}`)
        )
        .on('data', (data) => {
          console.log(`data: ${JSON.stringify(data)}`);
        })
        .on('end', async () => {
          console.log('Csv file was parsed');

          await s3
            .copyObject({
              Bucket: s3Bucket,
              CopySource: s3Bucket + '/' + csvDataFile,
              Key: csvDataFile.replace('uploaded', 'parsed')
            })
            .promise();

          await s3
            .deleteObject({
              Bucket: s3Bucket,
              Key: csvDataFile
            })
            .promise();
        });
    } catch (error) {
      return errorResponse(500, error.message);
    }
  }
};
