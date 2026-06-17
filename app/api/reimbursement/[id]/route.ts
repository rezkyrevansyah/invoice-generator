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
      .from('standalone_reimbursements')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: error?.message ?? 'Not found' }, { status: 404 });
    }

    return NextResponse.json({
      reimbursementNumber: data.reimbursement_number,
      reimbursementDate: data.reimbursement_date,
      clientCompany: data.client_company,
      clientPIC: data.client_pic,
      projectName: data.project_name,
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
