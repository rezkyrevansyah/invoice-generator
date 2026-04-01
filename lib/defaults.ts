import type { FreelancerData, InvoiceFormData } from './types';

export const defaultFreelancerData: FreelancerData = {
  name: 'M. Rezky Revansyah Suprihono',
  title: 'Software Engineer, UI/UX Designer & Full-Stack Developer',
  experience: '3+ Years',
  bank: 'BCA',
  accountNumber: '0661642679',
  accountName: 'M. Rezky Revansyah Suprihono',
};

const today = new Date().toISOString().split('T')[0];
const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

export const defaultFormData: InvoiceFormData = {
  invoiceNumber: '',
  agreementNumber: '',
  invoiceDate: today,
  agreementDate: today,
  initialPaymentDue: tomorrow,
  projectDeadline: '',

  clientCompany: '',
  clientPIC: '',

  projectName: '',
  scopeOfWork: '',
  deliverables: '',
  revisionRounds: 2,
  projectDuration: 14,
  startDate: today,
  endDate: '',
  progressUpdate: 'Setiap 2 hari atau sesuai milestone',
  projectValue: 0,

  paymentOption: null,
  paymentDisplay: 'both',
};
