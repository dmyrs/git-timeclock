export interface IInvoiceHandler {
    createInvoiceAsync(invoicee: string, companyName: string, rate: number): Promise<void>;
}