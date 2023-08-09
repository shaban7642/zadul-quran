import fs from 'fs';
import os from 'os';
import { getBufferFromUrl } from './convert';

const downloadFile = async (
  filename: string,
  fileUrl: string,
  destinationDirectory = os.tmpdir()
) => {
  const outputPath = `${destinationDirectory}/${filename}`;
  const buffer = await getBufferFromUrl(fileUrl, 'utf-8');
  console.log({ buffer });
  await fs.writeFileSync(outputPath, buffer, 'utf8');
  return outputPath;
};

export default downloadFile;
