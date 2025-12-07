import { Request, Response } from 'express';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import r2Client from '../../config/r2';
import path from 'path';

export const uploadFile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }

    const file = req.file;
    const fileExtension = path.extname(file.originalname);
    const fileName = `${uuidv4()}${fileExtension}`;
    const bucketName = process.env.CF_R2_BUCKET_NAME;

    if (!bucketName) {
      throw new Error('R2_BUCKET_NAME is not defined in environment variables');
    }

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

   const resp= await r2Client.send(command);

    const publicUrl = process.env.CF_R2_PUBLIC_URL
      ? `${process.env.CF_R2_PUBLIC_URL}/${fileName}`
      : `https://${process.env.CF_R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${bucketName}/${fileName}`;

    res.status(200).json({
      message: 'File uploaded successfully',
      url: publicUrl,
      fileName: fileName,
    });
  } catch (error) {
    console.error('Error uploading file to R2:', error);
    res.status(500).json({ message: 'Internal server error uploading file' });
  }
};
