import * as AWS from "aws-sdk";
import * as AWSXRay from "aws-xray-sdk";

const XAWS = AWSXRay.captureAWS(AWS);

import { createLogger } from "../utils/logger";

const logger = createLogger("s3Helper");

export class S3Helper {
  constructor(
    private readonly s3: AWS.S3 = new XAWS.S3({
      signatureVersion: "v4",
      region: process.env.region,
      params: { Bucket: process.env.IMAGE_BUCKET },
    }),
    private readonly signedUrlExpireSeconds = 60 * 5
  ) {}

  getPresignedUrl(todoId: string): string {
    logger.info(`getPresignedUrl invoked for todo ${todoId}`);
    logger.info(`bucket: ${process.env.IMAGES_S3_BUCKET}`);
    return this.s3.getSignedUrl("putObject", {
      Bucket: process.env.IMAGES_S3_BUCKET,
      Key: `${todoId}.png`,
      Expires: this.signedUrlExpireSeconds,
    }) as string;
  }
}
