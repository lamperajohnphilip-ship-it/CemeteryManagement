
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.AdminScalarFieldEnum = {
  id: 'id',
  email: 'email',
  password: 'password',
  name: 'name',
  username: 'username',
  contactNumber: 'contactNumber',
  role: 'role',
  avatar: 'avatar',
  department: 'department',
  sessionTimeout: 'sessionTimeout',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.DeceasedRecordScalarFieldEnum = {
  id: 'id',
  REF_NO: 'REF_NO',
  PAYORS_NAME: 'PAYORS_NAME',
  CONTACT_NO: 'CONTACT_NO',
  NAME_OF_DECEASED: 'NAME_OF_DECEASED',
  ADDRESS: 'ADDRESS',
  DATE_OF_BIRTH: 'DATE_OF_BIRTH',
  DATE_OF_DEATH: 'DATE_OF_DEATH',
  YEAR: 'YEAR',
  TOTAL_DUE: 'TOTAL_DUE',
  PAID: 'PAID',
  BALANCE: 'BALANCE',
  STATUS: 'STATUS',
  REMARKS: 'REMARKS',
  isArchived: 'isArchived',
  archivedAt: 'archivedAt',
  archiveReason: 'archiveReason',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PaymentRecordScalarFieldEnum = {
  id: 'id',
  REF_NO: 'REF_NO',
  PAYORS_NAME: 'PAYORS_NAME',
  CONTACT_NO: 'CONTACT_NO',
  NAME_OF_DECEASED: 'NAME_OF_DECEASED',
  ADDRESS: 'ADDRESS',
  DATE_OF_BIRTH: 'DATE_OF_BIRTH',
  DATE_OF_DEATH: 'DATE_OF_DEATH',
  YEAR: 'YEAR',
  TOTAL_DUE: 'TOTAL_DUE',
  PAID: 'PAID',
  BALANCE: 'BALANCE',
  STATUS: 'STATUS',
  REMARKS: 'REMARKS',
  OR_NO: 'OR_NO',
  DATE_PAID: 'DATE_PAID',
  METHOD: 'METHOD',
  DUE_DATE: 'DUE_DATE',
  deceasedRecordId: 'deceasedRecordId',
  isArchived: 'isArchived',
  archivedAt: 'archivedAt',
  archiveReason: 'archiveReason',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.InquiriesScalarFieldEnum = {
  id: 'id',
  APP_ID: 'APP_ID',
  FAMILY_NAME: 'FAMILY_NAME',
  DECEASED: 'DECEASED',
  REQUESTED_PLOT: 'REQUESTED_PLOT',
  BURIAL_DATE: 'BURIAL_DATE',
  TIME: 'TIME',
  CONTACT: 'CONTACT',
  STATUS: 'STATUS',
  email: 'email',
  emailVerified: 'emailVerified',
  emailVerifiedAt: 'emailVerifiedAt',
  relationship: 'relationship',
  address: 'address',
  reason: 'reason',
  notes: 'notes',
  remarks: 'remarks',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AnnouncementScalarFieldEnum = {
  id: 'id',
  title: 'title',
  content: 'content',
  category: 'category',
  badge: 'badge',
  visibility: 'visibility',
  status: 'status',
  date: 'date',
  validFrom: 'validFrom',
  validUntil: 'validUntil',
  views: 'views'
};

exports.Prisma.SmsNotificationScalarFieldEnum = {
  id: 'id',
  recipient: 'recipient',
  recipientName: 'recipientName',
  message: 'message',
  semaphoreId: 'semaphoreId',
  status: 'status',
  type: 'type',
  senderName: 'senderName',
  sentBy: 'sentBy',
  errorMessage: 'errorMessage',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SystemSettingScalarFieldEnum = {
  id: 'id',
  systemName: 'systemName',
  systemDescription: 'systemDescription',
  systemLogo: 'systemLogo',
  contactNumber: 'contactNumber',
  officialEmail: 'officialEmail',
  officeAddress: 'officeAddress',
  timeZone: 'timeZone',
  dateFormat: 'dateFormat',
  timeFormat: 'timeFormat',
  notifNewInquiry: 'notifNewInquiry',
  notifInquiryAccepted: 'notifInquiryAccepted',
  notifInquiryRejected: 'notifInquiryRejected',
  notifPayment: 'notifPayment',
  notifOverduePayment: 'notifOverduePayment',
  notifAnnouncement: 'notifAnnouncement',
  notifGraveLocator: 'notifGraveLocator',
  notifSystem: 'notifSystem',
  smsEnabled: 'smsEnabled',
  smsProvider: 'smsProvider',
  smsSenderName: 'smsSenderName',
  emailEnabled: 'emailEnabled',
  emailSenderName: 'emailSenderName',
  emailSenderAddress: 'emailSenderAddress',
  userAccessEnabled: 'userAccessEnabled',
  mobileAppEnabled: 'mobileAppEnabled',
  inquiriesEnabled: 'inquiriesEnabled',
  announcementsEnabled: 'announcementsEnabled',
  graveLocatorEnabled: 'graveLocatorEnabled',
  maintenanceMode: 'maintenanceMode',
  maintenanceMessage: 'maintenanceMessage',
  defaultTheme: 'defaultTheme',
  sidebarBehavior: 'sidebarBehavior',
  layoutDensity: 'layoutDensity',
  itemsPerPage: 'itemsPerPage',
  defaultDashboardPage: 'defaultDashboardPage',
  language: 'language',
  lastBackupAt: 'lastBackupAt',
  lastBackupFile: 'lastBackupFile',
  backupStatus: 'backupStatus',
  autoBackupEnabled: 'autoBackupEnabled',
  backupFrequency: 'backupFrequency',
  sessionTimeout: 'sessionTimeout',
  updatedAt: 'updatedAt',
  createdAt: 'createdAt'
};

exports.Prisma.AdminAuditLogScalarFieldEnum = {
  id: 'id',
  activity: 'activity',
  category: 'category',
  admin: 'admin',
  status: 'status',
  details: 'details',
  ipAddress: 'ipAddress',
  createdAt: 'createdAt'
};

exports.Prisma.EmailVerificationScalarFieldEnum = {
  id: 'id',
  email: 'email',
  codeHash: 'codeHash',
  attempts: 'attempts',
  expiresAt: 'expiresAt',
  verifiedAt: 'verifiedAt',
  createdAt: 'createdAt'
};

exports.Prisma.PasswordResetScalarFieldEnum = {
  id: 'id',
  email: 'email',
  tokenHash: 'tokenHash',
  expiresAt: 'expiresAt',
  usedAt: 'usedAt',
  createdAt: 'createdAt'
};

exports.Prisma.EmailNotificationLogScalarFieldEnum = {
  id: 'id',
  inquiryId: 'inquiryId',
  inquiryAppId: 'inquiryAppId',
  recipient: 'recipient',
  emailType: 'emailType',
  subject: 'subject',
  status: 'status',
  sentAt: 'sentAt',
  errorMessage: 'errorMessage',
  createdAt: 'createdAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};


exports.Prisma.ModelName = {
  Admin: 'Admin',
  DeceasedRecord: 'DeceasedRecord',
  PaymentRecord: 'PaymentRecord',
  Inquiries: 'Inquiries',
  Announcement: 'Announcement',
  SmsNotification: 'SmsNotification',
  SystemSetting: 'SystemSetting',
  AdminAuditLog: 'AdminAuditLog',
  EmailVerification: 'EmailVerification',
  PasswordReset: 'PasswordReset',
  EmailNotificationLog: 'EmailNotificationLog'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
