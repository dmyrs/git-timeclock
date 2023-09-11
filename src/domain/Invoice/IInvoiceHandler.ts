export interface IInvoiceHandler {
    createInvoiceAsync(): Promise<void>;
}