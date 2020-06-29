import * as fs from 'fs';
import { Flow, BUTTONCOUNT, FlowButton } from 'sc-shared';

export default class FlowsFileHandler {
  private static readonly _flowfile: string = '../json/flows.json';

  /**
   * Saves the flows to the json file
   * @param flows The flows to be saved
   */
  static saveFlows(flows: FlowButton[]): void {
    fs.writeFile(
      FlowsFileHandler._flowfile,
      JSON.stringify(flows),
      FlowsFileHandler.onFileWrite
    );
  }

  /**
   * Callback for writing to the flows file
   * @param err The error that occurred while writing the flows to the file if an error occured
   */
  private static onFileWrite(err: NodeJS.ErrnoException): void {
    if (err) console.error(err);
  }

  /**
   * Returns the flows of the json files if valid. Otherwise it will return an empty FlowButton[]
   */
  static loadFlows(): FlowButton[] {
    if (!fs.existsSync(FlowsFileHandler._flowfile)) return FlowsFileHandler.generateFlowsArrayArray();
    const json: FlowButton[] | undefined = FlowsFileHandler.validJSON(
      fs.readFileSync(FlowsFileHandler._flowfile, 'utf-8')
    );
    return json ? json : FlowsFileHandler.generateFlowsArrayArray();
  }

  /**
   * Checks if a string can be parsed into a FlowButton[] json and returns it if possible. Otherwise it will return undefined
   * @param input The string to check
   */
  private static validJSON(input: string): FlowButton[] | undefined {
    try {
      return JSON.parse(input) as FlowButton[];
    } catch {
      return undefined;
    }
  }

  /**
   * Generates empty flow arrays inside the flow array array
   */
  private static generateFlowsArrayArray(): FlowButton[] {
    const flows: FlowButton[] = [];
    while (flows.length < BUTTONCOUNT) flows.push({actions: [], button: {color: '#282828', name: 'Button'}});
    return flows;
  }
}
