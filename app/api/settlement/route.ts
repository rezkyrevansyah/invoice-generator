import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { SettlementFormData } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const body: SettlementFormData & { reimbursementTotal: number; grandTotal: number } = await request.json();

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
      .from('settlement_invoices')
      .insert({
        settlement_number: body.settlementNumber,
        settlement_date: body.settlementDate,
        original_invoice_id: body.originalInvoiceId || null,
        original_invoice_number: body.originalInvoiceNumber,
        client_company: body.clientCompany,
        client_pic: body.clientPIC,
        project_name: body.projectName,
        project_value: body.projectValue,
        dp_amount: body.dpAmount,
        remaining_amount: body.remainingAmount,
        reimbursement_items: body.reimbursementItems,
        reimbursement_total: body.reimbursementTotal,
        grand_total: body.grandTotal,
        bank: body.bank,
        account_number: body.accountNumber,
        account_name: body.accountName,
        proof_image_urls: body.imageUrls,
      })
      .select('id')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ id: data.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
