const ReportType = {
  BALANCE_SHEET: 'balance_sheet',
  PROFIT_AND_LOSS: 'profit_and_loss',
  ACCOUNT_TRANSACTION: 'account_transaction',
};

const Role = {
  roles: {
    ADMINISTRATOR: 'administrator',
    SUPER_ADMIN: 'super_admin',
    OWNER: 'owner',
    MANAGER: 'manager',
    DEVELOPER: 'developer',
    ANALYST: 'analyst',
    TEAM_MEMBER: 'team_member',
  },
  scopes: {
    ORGANIZATION: 'organization',
    TENANT: 'tenant',
  },
};

const User = {
  passwordStatus: {
    ACTIVE: 'A',
    LOCKED: 'L',
  },
};

const Devices = {
  MOBILE: 'mobile',
  WEB: 'web',
  IOS: 'ios',
  ANDROID: 'android',
};

const Company = {
  employeeSize: {
    TIER_ONE: '500',
    TIER_TWO: '100 - 500',
    TIER_THREE: '50 - 100',
    TIER_FOUR: '10 - 50',
    TIER_FIVE: '< 10',
  },
  revenueClass: {
    TIER_ONE: '> 500M',
    TIER_TWO: '100M - 500M',
    TIER_THREE: '50M - 100M',
    TIER_FOUR: '10M - 50M',
    TIER_FIVE: '5M - 10M',
    TIER_SIX: '1M - 5M',
    TIER_SEVEN: '< 1M',
  },
  accountingSwStatus: {
    NEW: 'new',
    EXISTING: 'existing',
    FAIL_TO_LINK: 'failed to link',
  },
  accountingSwType: {
    QUICKBOOKS: 'quickbooks',
    XERO: 'xero',
  },
  paymentFreq: {
    MONTHLY: 'monthly',
    YEARLY: 'yearly',
  },
  freeTrial: {
    YES: 'yes',
    NO: 'no',
    ENDED: 'ended',
  },
  billingType: {
    ORGANIZATION: 'organization',
    SELF_MANAGED: 'self-managed',
  },
};

const UploadHistory = {
  uploadStatus: {
    NEW: 'new',
    FAILED: 'failed',
    DUPLICATED: 'duplicated',
    VERIFIED: 'verified',
    PROCESSED: 'processed',
  },
  uploadTo: {
    QUICKBOOKS: 'quickbooks',
    XERO: 'xero',
  },
  uploadFileType: {
    Company: 'Statement',
    SAL: 'Purchase Invoice',
    COS: 'Bills',
    OTH: 'Others',
  },
};

const Transaction = {
  uploadStatus: {
    NEW: 'new',
    FAILED: 'failed',
    DUPLICATED: 'duplicated',
    VERIFIED: 'verified',
    PROCESSED: 'processed',
  },
  uploadTo: {
    QUICKBOOKS: 'quickbooks',
    XERO: 'xero',
  },
};

const ExpenseUploads = {
  status: {
    PROCESSING: 'processing',
    PENDING_REVIEW: 'pending-review',
    PENDING_APPROVAL: 'pending-approval',
    AWAITING_PAYMENT: 'awaiting-payment',
    FAILED: 'failed',
    APPROVED: 'approved',
    PAID: 'paid',
  },
  approvalStatus: {
    PENDING_APPROVAL: 'pending-approval',
    APPROVED: 'approved',
    REJECTED: 'rejected',
  },
  uploadType: {
    OCR: 'ocr',
    MANUAL: 'manual',
  },
};

const Permissions = {
  users: {
    READ: 'users:read',
    CREATE: 'users:create',
    UPDATE: 'users:update',
    DELETE: 'users:delete',
  },
  company: {
    READ: 'company:read',
    CREATE: 'company:create',
    UPDATE: 'company:update',
    DELETE: 'company:delete',
  },
  documents: {
    READ: 'documents:read',
    CREATE: 'documents:create',
    UPDATE: 'documents:update',
    DELETE: 'documents:delete',
  },
  expenses: {
    READ: 'expenses:read',
    CREATE: 'expenses:create',
    UPDATE: 'expenses:update',
    DELETE: 'expenses:delete',
  },
  token: {
    READ: 'token:read',
    CREATE: 'token:create',
    UPDATE: 'token:update',
    DELETE: 'token:delete',
    DISABLE: 'token:disable',
  },
  connections: {
    READ: 'connections:read',
    CREATE: 'connections:create',
    UPDATE: 'connections:update',
    DELETE: 'connections:delete',
    DISABLE: 'connections:disable',
  },
  billing: {
    READ: 'billing:read',
    CREATE: 'billing:create',
    UPDATE: 'billing:update',
    DELETE: 'billing:delete',
  },
  accounts: {
    READ: 'accounts:read',
    CREATE: 'accounts:create',
    UPDATE: 'accounts:update',
    DELETE: 'accounts:delete',
  },
  organizations: {
    READ: 'organizations:read',
    CREATE: 'organizations:create',
    UPDATE: 'organizations:update',
    DELETE: 'organizations:delete',
  },
  reports: {
    READ: 'reports:read',
    CREATE: 'reports:create',
    UPDATE: 'reports:update',
    DELETE: 'reports:delete',
  },
  automations: {
    READ: 'automations:read',
    CREATE: 'automations:create',
    UPDATE: 'automations:update',
    DELETE: 'automations:delete',
  },
  teamMemberBudgets: {
    READ: 'teamMemberBudgets:read',
    CREATE: 'teamMemberBudgets:create',
    UPDATE: 'teamMemberBudgets:update',
    DELETE: 'teamMemberBudgets:delete',
  },
  pettyCash: {
    READ: 'pettyCash:read',
    CREATE: 'pettyCash:create',
    UPDATE: 'pettyCash:update',
    DELETE: 'pettyCash:delete',
  },
};

const OrganizationStructure = {
  status: {
    ACTIVE: 'active',
    NOACTIVE: 'no-active',
  },
};

const SalesReport = {
  status: {
    PROCESSING: 'processing',
    PENDING_REVIEW: 'pending-review',
    POSTED: 'posted',
    FAILED: 'failed',
  },
};

const SalesReportTypes = {
  description: {
    STRIPE: 'stripe',
    PAYME: 'payme',
  },
};

const Timeframe = {
  MONTH: 'MONTH',
  YEAR: 'YEAR',
  QUARTER: 'QUARTER',
  DAY: 'DAY',
};

const FileType = {
  PDF: 'application/pdf',
  HEIC: 'image/heic',
  HEIF: 'image/heif',
  JPEG: 'image/jpeg',
};

const Logs = {
  logType: {
    CLAIM_CREATION: 'claim-creation',
    DETAIL_UPDATES: 'detail-updates',
    APPROVER_ASSIGNMENT: 'approver-assignment',
    APPROVALS: 'approvals',
    REJECTION: 'rejection',
  },
};

const ExtractionRules = {
  ruleConditionType: {
    ALL: 'all',
    ANY: 'any',
  },
  reference: {
    FROM_INVOICE_NUMBER: 'from-invoice-number',
  },
  field: {
    MERCHANT: 'merchant',
    INVOICE_NUMBER: 'invoice-number',
  },
  condition: {
    EQUALS: 'equals',
    CONTAINS: 'contains',
    START_WITH: 'start-with',
    IS_BLANK: 'is-blank',
  },
};

const AutomatedApprovalRule = {
  status: {
    BLOCK: 'blocked',
    ALLOW: 'allowed',
  },
};

const NotificationTypes = {
  CLAIM_ASSIGN: {
    name: 'claim-assign',
    id: 1,
  },
  CLAIM_UNASSIGN: {
    name: 'claim-unassign',
    id: 2,
  },
  CLAIM_COMMENT: {
    name: 'claim-comment',
    id: 3,
  },
  CLAIM_APPROVE: {
    name: 'claim-approve',
    id: 5,
  },
  CLAIM_REJECT: {
    name: 'claim-reject',
    id: 6,
  },
  EXPENSE_COMMENT: {
    name: 'expense-comment',
    id: 7,
  },
  EXPENSE_RESOLVE: {
    name: 'expense-resolve',
    id: 8,
  },
  DOCUMENT_UPLOAD: {
    name: 'document-upload',
    id: 9,
  },
  GENERIC: {
    name: 'generic',
    id: 11,
  },
  PAYMENT_WEBHOOK_FAIL: {
    name: 'payment-fail-webhook',
    id: 12,
  },
};

const NotificationTypeIds = {
  CLAIM_ASSIGN: 1,
  CLAIM_UNASSIGN: 2,
  CLAIM_COMMENT: 3,
  CLAIM_SUBMITTER_COMMENT: 4,
  CLAIM_APPROVE: 5,
  CLAIM_REJECT: 6,
  EXPENSE_COMMENT: 7,
  EXPENSE_RESOLVE: 8,
  DOCUMENT_UPLOAD: 9,
  GENERIC: 11,
  PAYMENT_WEBHOOK_FAIL: 12,
};

const EmailNotifications = {
  DELIVERED: 'DELIVERED',
  FAILED: 'FAILED',
};

const SuppliersTimeRange = {
  THIS_WEEK: 'thisWeek',
  LAST_WEEK: 'lastWeek',
  THIS_MONTH: 'thisMonth',
};

const PettyCash = {
  transactionTypes: {
    DEPOSIT: 'deposit',
    WITHDRAWAL: 'withdrawal',
  },
};

const ExpenseClaimStatus = {
  REJECTED: 'rejected',
  APPROVED: 'approved',
  PENDING_APPROVAL: 'pending-approval',
};

const AccountPlatform = {
  XERO: 'xero',
  QUICKBOOKS: 'quickbooks',
};

export default {
  Company,
  UploadHistory,
  Transaction,
  User,
  ExpenseUploads,
  Permissions,
  Role,
  OrganizationStructure,
  SalesReport,
  SalesReportTypes,
  Devices,
  ReportType,
  Timeframe,
  FileType,
  Logs,
  ExtractionRules,
  AutomatedApprovalRule,
  NotificationTypes,
  NotificationTypeIds,
  SuppliersTimeRange,
  EmailNotifications,
  PettyCash,
  ExpenseClaimStatus,
  AccountPlatform,
};
