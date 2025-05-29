import uploadAsset from "../models/immichModel.ts";

export default async function postNewImageService(bFile: any, file: any) {
  return await uploadAsset(bFile, file);
}
