import { ICommand } from '../shims/textadventurejs.shim';

export interface IParser {
    parse(string: string): ICommand;
}
