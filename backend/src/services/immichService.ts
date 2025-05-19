import uploadAsset from "../models/immichModel.ts";

export default async function postNewImageService(filePath: string) {
  return await uploadAsset(filePath);
}
