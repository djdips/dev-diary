// storage/index.ts
import { fileStorage } from "./fileStorage.ts";
import { dbStorage } from "./dbStorage.ts";
import { StorageAdapter } from "../storage.ts";
import { STORAGE_MODE } from "../../config.ts";

let storage: StorageAdapter;

switch (STORAGE_MODE) {
  case "db":
    storage = dbStorage;
    break;
  case "file":
  default:
    storage = fileStorage;
    break;
}

export { storage };
