import { debugMode } from "./constants";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export function prismaErrHandler(e: any): string {
  if (e instanceof PrismaClientKnownRequestError) {
    if (debugMode) {
      console.log(
        "code: " +
          e.code +
          ", meta: " +
          JSON.stringify(e.meta) +
          ", msg: " +
          e.message
      );
    }
    if (e.code == "P2000") {
      //varChar constraint
      return "field " + e.meta?.column_name + " is too long";
    } else if (e.code == "P2002") {
      //unique constraint
      //e.meta.target
      return e.meta?.target + " must be unique";
    } else if (e.code == "P2025") {
      //object DNE
      //e.meta.modelName
      return "your data is outdated, please refresh your webpage";
    } else if (e.code == "P2003") {
      //relation DNE
      //e.meta.modelName, e.meta.field_name
      return "your data is outdated, please refresh your webpage";
    } else {
      //unhandled prisma error
      return "your data is outdated, please refresh your webpage";
      //   return "Unhandled error: " + e.code + " | " + e.message;
    }
  } else {
    return "Unknown error: " + e;
  }
}
