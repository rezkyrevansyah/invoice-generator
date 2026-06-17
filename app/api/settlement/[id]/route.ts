import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
      .from('settlement_invoices')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: error?.message ?? 'Not found' }, { status: 404 });
    }

    return NextResponse.json({
      settlementNumber: data.settlement_number,
      settlementDate: data.settlement_date,
      originalInvoiceId: data.original_invoice_id ?? '',
      originalInvoiceNumber: data.original_invoice_number,
      clientCompany: data.client_company,
      clientPIC: data.client_pic,
      projectName: data.project_name,
      projectValue: data.project_value,
      dpAmount: data.dp_amount,
      remainingAmount: data.remaining_amount,
      reimbursementItems: data.reimbursement_items ?? [],
      imageUrls: data.proof_image_urls ?? [],
      bank: data.bank,
      accountNumber: data.account_number,
      accountName: data.account_name,
    });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
