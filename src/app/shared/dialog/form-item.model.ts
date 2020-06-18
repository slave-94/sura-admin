export class FormItem {
    constructor(
        public key?: string,
        public value?: any,
        public title?: string,
        public type?: string,
        public options?: any[],
        public required?: boolean
    ) { }
}