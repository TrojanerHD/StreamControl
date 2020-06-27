import * as fs from 'fs';
import { Flow } from 'sc-shared';

export default class FlowsFileHandler {
  private static readonly _flowfile: string = '../json/flows.json';

  static saveFlows(flows: Flow[][]): void {
    fs.writeFile(
      FlowsFileHandler._flowfile,
      JSON.stringify(flows),
      FlowsFileHandler.onFileWrite
    );
  }

  private static onFileWrite(err: NodeJS.ErrnoException): void {
    if (err) console.error(err);
  }

  static loadFlows(): Flow[][] {
    if (!fs.existsSync(FlowsFileHandler._flowfile)) return [[]];
    const json: Flow[][] | undefined = FlowsFileHandler.validJSON(
      fs.readFileSync(FlowsFileHandler._flowfile, 'utf-8')
    );
    return json ? json : [[]];
  }

  private static validJSON(input: string): Flow[][] | undefined {
    try {
      return JSON.parse(input) as Flow[][];
    } catch {
      return undefined;
    }
  }
}
