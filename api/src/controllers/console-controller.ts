import { Console as ConsoleType } from '@tinystacks/ops-model';
import ConsoleClient from '../clients/console-client';
import Console from '../classes/console';

const ConsoleController = {
  async getConsoles (): Promise<ConsoleType[]> {
    return ConsoleClient.getConsoles();
  },
  async postConsole (createConsoleBody: ConsoleType): Promise<ConsoleType> {
    const console = Console.fromObject(createConsoleBody);
    return ConsoleClient.saveConsole(console.name, console);
  },
  async putConsole (consoleName: string, updateConsoleBody: ConsoleType): Promise<ConsoleType> {
    const console = Console.fromObject(updateConsoleBody);
    console.name = consoleName;
    return ConsoleClient.saveConsole(consoleName, console);
  },
  async deleteConsole (consoleName: string): Promise<ConsoleType> {
    return ConsoleClient.deleteConsole(consoleName);
  }
};

export default ConsoleController;