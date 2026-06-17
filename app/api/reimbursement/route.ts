import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { ReimbursementOnlyFormData } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const body: ReimbursementOnlyFormData & { reimbursementTotal: number } = await request.json();

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
      .from('standalone_reimbursements')
      .insert({
        reimbursement_number: body.reimbursementNumber,
        reimbursement_date: body.reimbursementDate,
        client_company: body.clientCompany,
        client_pic: body.clientPIC,
        project_name: body.projectName,
        reimbursement_items: body.reimbursementItems,
        reimbursement_total: body.reimbursementTotal,
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
