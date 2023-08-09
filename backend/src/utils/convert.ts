/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-undef */
import axios from 'axios';

export const getBufferFromUrl = async (
  url: string,
  encoding: BufferEncoding
): Promise<Buffer> => {
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  return Buffer.from(response.data, encoding);
};

export const getJsonFromBase64 = async (
  base64String: string
): Promise<{ [key: string]: any }> => {
  let file;
  file = Buffer.from(base64String, 'base64').toString().trim();
  file = JSON.parse(file);
  return file;
};

export const convertObjectToBase64 = (payload: {
  [key: string]: any;
}): string => {
  return Buffer.from(JSON.stringify(payload)).toString('base64');
};
