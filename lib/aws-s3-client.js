const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

class appS3Client {
  constructor(accessKeyId = process.env.ACCESS_KEY_ID, secretAccessKey = process.env.SECRET_ACCESS_KEY) {
    this.client = new S3Client({
      accessKeyId,
      secretAccessKey,
    });
  }

  async send(command) {
    try {
      const data = await this.client.send(command);
      return { data, success: true, error: null }
    } catch (error) {
      return { error, success: false, data: null }
    }
  }

  createPutObjectCommand(location, filename, contents) {
    const request = {
      Bucket: location,
      Key: filename,
      Body: contents,
      ContentType: "text/html; charset=utf-8",
      // ACL: "public-read", // uncomment this if you want the raw s3 html url to work (https://s3.amazonaws.com/ismrbrightsidestillintheukcharts.com/index.html) so you can bypass cloudfront
      CacheControl: "max-age=60",
    };

    return new PutObjectCommand(request);
  }
}

const s3Client = new appS3Client()

module.exports = {
  s3Client,
};
