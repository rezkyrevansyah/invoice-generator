import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { InvoiceFormData } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const body: InvoiceFormData = await request.json();

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
      .from('invoices')
      .insert({
        invoice_number: body.invoiceNumber,
        agreement_number: body.agreementNumber,
        invoice_date: body.invoiceDate,
        agreement_date: body.agreementDate,
        initial_payment_due: body.initialPaymentDue,
        project_deadline: body.projectDeadline,

        client_company: body.clientCompany,
        client_pic: body.clientPIC,

        project_name: body.projectName,
        scope_of_work: body.scopeOfWork,
        deliverables: body.deliverables,
        revision_rounds: body.revisionRounds,
        project_duration: body.projectDuration,
        start_date: body.startDate,
        end_date: body.endDate,
        progress_update: body.progressUpdate,
        project_value: body.projectValue,

        payment_option: body.paymentOption,
        payment_display: body.paymentDisplay,
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
