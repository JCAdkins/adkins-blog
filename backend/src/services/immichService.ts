import uploadAsset from "../models/immichModel.ts";

export default async function postNewImageService(bFile: any, file: File) {
  return await uploadAsset(bFile, file);
}
