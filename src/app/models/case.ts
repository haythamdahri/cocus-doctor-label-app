import { Label } from './label';

export class Case {
    constructor(public id: string, public content: string, public conditions: Label[], public reviewed: boolean) {}
}
