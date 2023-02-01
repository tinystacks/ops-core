import Console from '../../classes/console';
import LocalConsoleClient from './local';

/**
 * TODO: Eventually this becomes a proxy class which based on the environment returns a specific client i.e. local vs github vs s3 etc.
 */
const ConsoleClient = {
  async getConsole (_consoleName: string): Promise<Console> {
    // TODO: Add switching based on context for sourcing from other places.
    return LocalConsoleClient.getLocalConsole();
  },
  async getConsoles (): Promise<Console[]> {
    // TODO: Add switching based on context for sourcing from other places.
    const consoles = [];
    const localConsole = await LocalConsoleClient.getLocalConsole();
    if (localConsole) consoles.push(localConsole);
    return consoles;
  },
  async saveConsole (_consoleName: string, console: Console): Promise<Console> {
    // TODO: Add switching based on context for sourcing from other places.
    return LocalConsoleClient.saveLocalConsole(console);
  },
  async deleteConsole (consoleName: string): Promise<Console> {
    // TODO: Add switching based on context for sourcing from other places.
    return LocalConsoleClient.deleteLocalConsole(consoleName);
  }
};

export default ConsoleClient;