import { join } from "path";
import { unlink } from "fs/promises";
import _ from "lodash";
import { NextApiResponse } from "next";
import { TypedRequestBody } from "types/req";

export default async function handle(
  req: TypedRequestBody<{
    image: string;
  }>,
  res: NextApiResponse
) {
  //--image
  const { image } = req.body;
  //--imagePath
  const imagePath = join(process.cwd(), image);
  //--delete file
  try {
    await unlink(imagePath);
    console.log("delete-image-server imagePath:", imagePath);
    return res.status(200).json(imagePath);
  } catch (e) {
    console.error("Error while trying to delete a file:" + e);
    // return res.status(500).json("Error while trying to delete a file: " + e);
    return res.status(200).json("Error while trying to delete a file: " + e); //if can't delete the image, do not interrupt the upload process. Give them the 200.
  }
}
