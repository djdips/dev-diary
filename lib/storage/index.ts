// storage/index.ts
import { fileStorage } from "./fileStorage.ts";
import { dbStorage } from "./dbStorage.ts";
import { StorageAdapter } from "../storage.ts";
import { STORAGE_MODE } from "../../config.ts";

let activeStorage: StorageAdapter =
  STORAGE_MODE === "db" ? dbStorage : fileStorage;

export const storage = {
  get adapter() {
    return activeStorage;
  },
  set adapter(newAdapter: StorageAdapter) {
    activeStorage = newAdapter;
  },
  get name(): string {
    return activeStorage?.constructor?.name ?? "unknown";
  },
};
