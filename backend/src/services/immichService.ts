import { uploadAsset, downloadAsset } from "../models/immichModel.ts";

export async function postNewImageService(bFile: any, file: any) {
  return await uploadAsset(bFile, file);
}

export async function getImmichImageService(id: string) {
  return await downloadAsset(id);
}
