import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { InvoiceFormData } from '@/lib/types';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // Map snake_case DB columns → camelCase InvoiceFormData
    const formData: InvoiceFormData = {
      invoiceNumber: data.invoice_number ?? '',
      agreementNumber: data.agreement_number ?? '',
      invoiceDate: data.invoice_date ?? '',
      agreementDate: data.agreement_date ?? '',
      initialPaymentDue: data.initial_payment_due ?? '',
      projectDeadline: data.project_deadline ?? '',
      clientCompany: data.client_company ?? '',
      clientPIC: data.client_pic ?? '',
      projectName: data.project_name ?? '',
      scopeOfWork: data.scope_of_work ?? '',
      deliverables: data.deliverables ?? '',
      revisionRounds: data.revision_rounds ?? 2,
      projectDuration: data.project_duration ?? 14,
      startDate: data.start_date ?? '',
      endDate: data.end_date ?? '',
      progressUpdate: data.progress_update ?? '',
      projectValue: data.project_value ?? 0,
      paymentOption: data.payment_option ?? null,
      paymentDisplay: data.payment_display ?? 'both',
    };

    return NextResponse.json({ id: data.id, ...formData });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body: InvoiceFormData = await request.json();
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { error } = await supabase
      .from('invoices')
      .update({
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
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ id });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
