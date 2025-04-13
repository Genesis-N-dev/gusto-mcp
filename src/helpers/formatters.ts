import { Employee } from '@gusto/embedded-api/models/components/employee.js';
import { Job } from '@gusto/embedded-api/models/components/job.js';
import { Compensation } from '@gusto/embedded-api/models/components/compensation.js';
import { Termination } from '@gusto/embedded-api/models/components/termination.js';
import { Garnishment } from '@gusto/embedded-api/models/components/garnishment.js';
import { PayScheduleObject } from '@gusto/embedded-api/models/components/payscheduleobject.js';
import { Payroll } from '@gusto/embedded-api/models/components/payroll.js';

export const formatEmployee = (employee: Employee) => {
  return `Employee Information:
    ID: ${employee.uuid}
    Name: ${employee.firstName}${employee.middleInitial ? ' ' + employee.middleInitial : ''} ${employee.lastName}
    Email: ${employee.email || 'Not provided'}
    WorkEmail: ${employee.workEmail || 'Not provided'}
    Phone: ${employee.phone || 'Not provided'}
    PreferredFirstName: ${employee.preferredFirstName || 'Not specified'}
    DateOfBirth: ${employee.dateOfBirth || 'Not provided'}
    HasSsn: ${employee.hasSsn ? 'Yes' : 'No'}
    
    Employment Details:
    Department: ${employee.department || 'Not assigned'}
    CurrentStatus: ${employee.currentEmploymentStatus || 'Not specified'}
    Terminated: ${employee.terminated ? 'Yes' : 'No'}
    TwoPercentShareholder: ${employee.twoPercentShareholder ? 'Yes' : 'No'}
    Onboarded: ${employee.onboarded ? 'Yes' : 'No'}
    OnboardingStatus: ${employee.onboardingStatus || 'Unknown'}
    PaymentMethod: ${employee.paymentMethod || 'Not specified'}
    ManagerID: ${employee.managerUuid || 'No manager assigned'}
    
    Jobs: ${employee.jobs && employee.jobs.length > 0 ? formatJobs(employee.jobs) : 'No jobs assigned'}
    
    Terminations: ${employee.terminations && employee.terminations.length > 0 ? formatTerminations(employee.terminations) : 'No termination records'}
    
    Garnishments: ${employee.garnishments && employee.garnishments.length > 0 ? formatGarnishments(employee.garnishments) : 'No garnishments'}`;
};

export const formatPaySchedule = (paySchedule: PayScheduleObject) => {
  const schedule = {
    frequency: paySchedule.frequency,
    anchorPayDate: paySchedule.anchorPayDate,
    anchorEndOfPayPeriod: paySchedule.anchorEndOfPayPeriod,
    day1: paySchedule.day1,
    day2: paySchedule.day2,
    name: paySchedule.name,
    customName: paySchedule.customName,
    autoPilot: paySchedule.autoPilot,
    active: paySchedule.active,
  };

  // Format the pay schedule details
  return `Pay Schedule Information:
    Name: ${schedule.name}
    Custom Name: ${schedule.customName}
    Frequency: ${schedule.frequency}
    Anchor Pay Date: ${schedule.anchorPayDate}
    Anchor End of Pay Period: ${schedule.anchorEndOfPayPeriod}
    Pay Days: ${schedule.day1} and ${schedule.day2} of the month
    Auto Pilot: ${schedule.autoPilot ? 'Enabled' : 'Disabled'}
    Status: ${schedule.active ? 'Active' : 'Inactive'}`;
};

export const generatePayrollText = (payroll: Payroll) => {
  const type = payroll.offCycle ? 'Off-Cycle' : 'Regular';

  // Determine status based on processed flag
  const status = payroll.processed ? 'Processed' : 'Pending';

  // Format pay period dates
  const payPeriod = payroll.payPeriod
    ? `${payroll.payPeriod.startDate} to ${payroll.payPeriod.endDate}`
    : 'No pay period defined';

  // Get or format dates and times
  const checkDate = payroll.checkDate || 'Not scheduled';
  const processedDate = payroll.processedDate || 'Not processed';
  const calculatedAt = payroll.calculatedAt || 'Not calculated';
  const createdAt = payroll.calculatedAt || 'Unknown';
  const payrollDeadline = payroll.payrollDeadline || 'No deadline';

  // Format financial details if available
  let financialDetails = '';
  if (payroll.totals) {
    const t = payroll.totals;
    financialDetails = `
    Financial Details:
    Gross Pay: ${t.grossPay}
    Net Pay: ${t.netPay}
    Employee Taxes: ${t.employeeTaxes}
    Employer Taxes: ${t.employerTaxes}
    Employee Commissions: ${t.employeeCommissions}
    Employee Benefits Deductions: ${t.employeeBenefitsDeductions}
    Other Deductions: ${t.otherDeductions}
    Check Amount: ${t.checkAmount}`;
  }

  return `Payroll Information:
        Pay Period: ${payPeriod}
        Type: ${type}
        Status: ${status}
        External: ${payroll.external ? 'Yes' : 'No'}
        Check Date: ${checkDate}
        Created At: ${createdAt}
        Processed Date: ${processedDate}
        Calculated At: ${calculatedAt}
        Payroll Deadline: ${payrollDeadline}${financialDetails}`;
};

const formatJobs = (jobs: Array<Job>) => {
  return `\n${jobs
    .map((job, index) => {
      const compensationsInfo =
        job.compensations && job.compensations.length > 0
          ? `\n      Compensations: ${formatCompensations(job.compensations)}`
          : '\n      Compensations: None';

      return `    Job ${index + 1}:
        ID: ${job.uuid}
        Title: ${job.title || 'No title'}
        HireDate: ${job.hireDate}
        Primary: ${job.primary ? 'Yes' : 'No'}
        Payment: ${job.rate} per ${job.paymentUnit}${compensationsInfo}`;
    })
    .join('\n\n')}`;
};

const formatCompensations = (compensations: Array<Compensation>) => {
  return `\n${compensations
    .map((comp, index) => {
      return `        Compensation ${index + 1}:
            Rate: ${comp.rate} per ${comp.paymentUnit}
            FlsaStatus: ${comp.flsaStatus || 'Not specified'}
            EffectiveDate: ${comp.effectiveDate}
            AdjustForMinimumWage: ${comp.adjustForMinimumWage ? 'Yes' : 'No'}`;
    })
    .join('\n')}`;
};

const formatTerminations = (terminations: Array<Termination>) => {
  return `\n${terminations
    .map((term, index) => {
      return `    Termination ${index + 1}:
        ID: ${term.uuid}
        EffectiveDate: ${term.effectiveDate}
        Active: ${term.active ? 'Yes' : 'No'}
        Cancelable: ${term.cancelable ? 'Yes' : 'No'}
        RunTerminationPayroll: ${term.runTerminationPayroll ? 'Yes' : 'No'}`;
    })
    .join('\n')}`;
};

const formatGarnishments = (garnishments: Array<Garnishment>) => {
  return `\n${garnishments
    .map((garn, index) => {
      let childSupportInfo = '';
      if (garn.childSupport) {
        childSupportInfo = `
          ChildSupportDetails:
            State: ${garn.childSupport.state}
            PaymentPeriod: ${garn.childSupport.paymentPeriod}
            FipsCode: ${garn.childSupport.fipsCode}
            CaseNumber: ${garn.childSupport.caseNumber || 'Not provided'}
            OrderNumber: ${garn.childSupport.orderNumber || 'Not provided'}
            RemittanceNumber: ${garn.childSupport.remittanceNumber || 'Not provided'}`;
      }

      return `    Garnishment ${index + 1}:
        ID: ${garn.uuid}
        Active: ${garn.active ? 'Yes' : 'No'}
        Amount: ${garn.amount}${garn.deductAsPercentage ? '%' : ''}
        Description: ${garn.description}
        CourtOrdered: ${garn.courtOrdered ? 'Yes' : 'No'}
        Recurring: ${garn.recurring ? 'Yes' : 'No'}
        Type: ${garn.garnishmentType || 'Not specified'}${childSupportInfo}`;
    })
    .join('\n')}`;
};
