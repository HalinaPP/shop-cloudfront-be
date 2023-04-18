import { S3Event } from 'aws-lambda';
import { REGION, headers } from '../constants';
import { errorResponse } from '../errors-hadler';
import { S3 } from 'aws-sdk';
import csv from 'csv-parser';

export const importFileParser = async (event: S3Event) => {
  const { Records } = event;

  const s3Bucket = Records[0].s3.bucket.name;
  const csvDataFile = Records[0].s3.object.key;

  console.log('file:', csvDataFile, ' will be parsed in a bucket:', s3Bucket);

  const s3 = new S3({ region: REGION });

  const params = {
    Bucket: s3Bucket,
    Key: csvDataFile
  };

  try {
    await s3
      .getObject(params)
      .createReadStream()
      .pipe(csv({ separator: ';' }))
      .on('data', (data) => {
        console.log('data:', data);
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

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(
        {
          data: 'CSV file was parsed successfully'
        },
        null,
        2
      )
    };
  } catch (error) {
    return errorResponse(500, error.message);
  }
};
