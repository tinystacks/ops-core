import * as fs from 'fs';
import logger from '../../logger';

function init() {
  try {
    // fs.readFileSync()
  } catch (e) {
    logger.error(`Error creating example template file: ${e}`);
  }
}

export {
  init
};