export interface  ErrorFieldInterface {
    name: string[],
    errors:string[],
    warnings:string[]
}
export interface ErrorInterface {
    errorFields: ErrorFieldInterface[],
    values:{}
}