import isNil from 'lodash.isnil';
import { readFileSync } from 'fs';

const FsUtils = {
  tryToReadFile (filePath: string): Buffer | undefined {
    try {
      const file = readFileSync(filePath);
      if (isNil(file)) {
        console.warn(`The file specified at ${filePath} has no contents or does not exist!`);
        return undefined;
      }
      return file;
    } catch (error) {
      console.error(`An error occured when reading the file specified at ${filePath}!`, error);
      return undefined;
    }
  }
};

export default FsUtils;