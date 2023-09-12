export interface IInvoiceHandler {
    createInvoiceAsync(invoicee: string, companyName: string): Promise<void>;
}