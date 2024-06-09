export class InvoiceManager {
    public static async CreateAsync(projectId: string) {
        // take all shifts for project and user config and create an invoice, create an invoice number
        // keep an index of all invoices and whether or not they're paid (INVOICES file)
    }

    public static async PaidAsync(projectId: string, invoiceNumber: number) {
        // mark a specific invoice as paid
    }

    public static async StatusAsync(projectId: string | null) {
        // see all unpaid invoices for
        if (projectId) {
            // specific project
        }
        else {
            // all projects
        }
    }
}