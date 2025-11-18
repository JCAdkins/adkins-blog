import {
  uploadAsset,
  downloadAsset,
  downloadThumbnail,
} from "../models/immichModel.js";

export async function postNewImageService(bFile: any, file: any) {
  return await uploadAsset(bFile, file);
}

export async function getImmichImageService(id: string) {
  return await downloadAsset(id);
}

export async function getImmichThumbnailService(id: string) {
  const data = await downloadThumbnail(id);
  return data;
}
