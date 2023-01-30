import yaml from 'js-yaml';
import isNil from 'lodash.isnil';
import Console from '../classes/console';
import HttpError from 'http-errors';
import {
  writeFileSync
} from 'fs';
import {
  resolve as resolvePath
} from 'path';
import FsUtils from '../utils/fs-utils';
import { YamlConsole } from '../types';

// TODO: should we make this a class that implement a ConsoleClient interface?
const LocalClient = {
  async getLocalConsole (): Promise<Console> {
    const configPath = process.env.CONFIG_PATH;
    if (configPath) {
      const configFilePath = resolvePath(configPath);
      console.debug('configFilePath: ', configFilePath)
      const configFile = FsUtils.tryToReadFile(configFilePath);
      if (!configFile) throw HttpError.NotFound(`Cannot fetch consoles! Config file ${configPath} not found!`);
      const configJson = yaml.load(configFile.toString()) as YamlConsole;
      console.debug('configJson: ', JSON.stringify(configJson));
      return Console.fromYaml(configJson);
    }
    throw HttpError.BadRequest('Cannot fetch consoles! No value was found for CONFIG_PATH!');
  },
  async saveLocalConsole (console: Console): Promise<Console> {
    const yamlConsole = Console.toYaml(console);
    const consoleYml = yaml.dump(yamlConsole);
    const configPath = process.env.CONFIG_PATH;
    if (isNil(configPath)) throw HttpError.BadRequest(`Cannot save console ${console.name}! No value was found for CONFIG_PATH!`);
    try {
      writeFileSync(resolvePath(configPath), consoleYml);
      return this.getLocalConsole();
    } catch (error) {
      const message = `Failed to save local console ${console.name}!`;
      global.console.error(message, error);
      throw HttpError.InternalServerError(message);
    }
  },
  async deleteLocalConsole (consoleName: string): Promise<Console> {
    const configPath = process.env.CONFIG_PATH;
    if (isNil(configPath)) throw HttpError.BadRequest(`Cannot delete console ${consoleName}! No value was found for CONFIG_PATH!`);
    try {
      const console = this.getLocalConsole();
      writeFileSync(resolvePath(configPath), '');
      return console;
    } catch (error) {
      const message = `Failed to delete local console ${consoleName}!`;
      global.console.error(message, error);
      throw HttpError.InternalServerError(message);
    }
  }
};

const ConsoleClient = {
  async getConsoles (): Promise<Console[]> {
    // TODO: Add switching based on context for sourcing from other places.
    return [await LocalClient.getLocalConsole()];
  },
  async saveConsole (_consoleName: string, console: Console): Promise<Console> {
    // TODO: Add switching based on context for sourcing from other places.
    return LocalClient.saveLocalConsole(console);
  },
  async deleteConsole (consoleName: string): Promise<Console> {
    // TODO: Add switching based on context for sourcing from other places.
    return LocalClient.deleteLocalConsole(consoleName);
  }
};

export {
  ConsoleClient,
  LocalClient
};
export default ConsoleClient;