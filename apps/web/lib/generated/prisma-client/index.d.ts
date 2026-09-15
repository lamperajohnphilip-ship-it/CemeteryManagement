
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Admin
 * 
 */
export type Admin = $Result.DefaultSelection<Prisma.$AdminPayload>
/**
 * Model DeceasedRecord
 * 
 */
export type DeceasedRecord = $Result.DefaultSelection<Prisma.$DeceasedRecordPayload>
/**
 * Model PaymentRecord
 * 
 */
export type PaymentRecord = $Result.DefaultSelection<Prisma.$PaymentRecordPayload>
/**
 * Model Inquiries
 * 
 */
export type Inquiries = $Result.DefaultSelection<Prisma.$InquiriesPayload>
/**
 * Model Announcement
 * 
 */
export type Announcement = $Result.DefaultSelection<Prisma.$AnnouncementPayload>
/**
 * Model SmsNotification
 * 
 */
export type SmsNotification = $Result.DefaultSelection<Prisma.$SmsNotificationPayload>
/**
 * Model SystemSetting
 * 
 */
export type SystemSetting = $Result.DefaultSelection<Prisma.$SystemSettingPayload>
/**
 * Model AdminAuditLog
 * 
 */
export type AdminAuditLog = $Result.DefaultSelection<Prisma.$AdminAuditLogPayload>
/**
 * Model EmailVerification
 * 
 */
export type EmailVerification = $Result.DefaultSelection<Prisma.$EmailVerificationPayload>
/**
 * Model PasswordReset
 * 
 */
export type PasswordReset = $Result.DefaultSelection<Prisma.$PasswordResetPayload>
/**
 * Model EmailNotificationLog
 * 
 */
export type EmailNotificationLog = $Result.DefaultSelection<Prisma.$EmailNotificationLogPayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Admins
 * const admins = await prisma.admin.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Admins
   * const admins = await prisma.admin.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.admin`: Exposes CRUD operations for the **Admin** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Admins
    * const admins = await prisma.admin.findMany()
    * ```
    */
  get admin(): Prisma.AdminDelegate<ExtArgs>;

  /**
   * `prisma.deceasedRecord`: Exposes CRUD operations for the **DeceasedRecord** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DeceasedRecords
    * const deceasedRecords = await prisma.deceasedRecord.findMany()
    * ```
    */
  get deceasedRecord(): Prisma.DeceasedRecordDelegate<ExtArgs>;

  /**
   * `prisma.paymentRecord`: Exposes CRUD operations for the **PaymentRecord** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PaymentRecords
    * const paymentRecords = await prisma.paymentRecord.findMany()
    * ```
    */
  get paymentRecord(): Prisma.PaymentRecordDelegate<ExtArgs>;

  /**
   * `prisma.inquiries`: Exposes CRUD operations for the **Inquiries** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Inquiries
    * const inquiries = await prisma.inquiries.findMany()
    * ```
    */
  get inquiries(): Prisma.InquiriesDelegate<ExtArgs>;

  /**
   * `prisma.announcement`: Exposes CRUD operations for the **Announcement** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Announcements
    * const announcements = await prisma.announcement.findMany()
    * ```
    */
  get announcement(): Prisma.AnnouncementDelegate<ExtArgs>;

  /**
   * `prisma.smsNotification`: Exposes CRUD operations for the **SmsNotification** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SmsNotifications
    * const smsNotifications = await prisma.smsNotification.findMany()
    * ```
    */
  get smsNotification(): Prisma.SmsNotificationDelegate<ExtArgs>;

  /**
   * `prisma.systemSetting`: Exposes CRUD operations for the **SystemSetting** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SystemSettings
    * const systemSettings = await prisma.systemSetting.findMany()
    * ```
    */
  get systemSetting(): Prisma.SystemSettingDelegate<ExtArgs>;

  /**
   * `prisma.adminAuditLog`: Exposes CRUD operations for the **AdminAuditLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AdminAuditLogs
    * const adminAuditLogs = await prisma.adminAuditLog.findMany()
    * ```
    */
  get adminAuditLog(): Prisma.AdminAuditLogDelegate<ExtArgs>;

  /**
   * `prisma.emailVerification`: Exposes CRUD operations for the **EmailVerification** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more EmailVerifications
    * const emailVerifications = await prisma.emailVerification.findMany()
    * ```
    */
  get emailVerification(): Prisma.EmailVerificationDelegate<ExtArgs>;

  /**
   * `prisma.passwordReset`: Exposes CRUD operations for the **PasswordReset** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PasswordResets
    * const passwordResets = await prisma.passwordReset.findMany()
    * ```
    */
  get passwordReset(): Prisma.PasswordResetDelegate<ExtArgs>;

  /**
   * `prisma.emailNotificationLog`: Exposes CRUD operations for the **EmailNotificationLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more EmailNotificationLogs
    * const emailNotificationLogs = await prisma.emailNotificationLog.findMany()
    * ```
    */
  get emailNotificationLog(): Prisma.EmailNotificationLogDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
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

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "admin" | "deceasedRecord" | "paymentRecord" | "inquiries" | "announcement" | "smsNotification" | "systemSetting" | "adminAuditLog" | "emailVerification" | "passwordReset" | "emailNotificationLog"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Admin: {
        payload: Prisma.$AdminPayload<ExtArgs>
        fields: Prisma.AdminFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AdminFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AdminFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload>
          }
          findFirst: {
            args: Prisma.AdminFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AdminFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload>
          }
          findMany: {
            args: Prisma.AdminFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload>[]
          }
          create: {
            args: Prisma.AdminCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload>
          }
          createMany: {
            args: Prisma.AdminCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AdminCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload>[]
          }
          delete: {
            args: Prisma.AdminDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload>
          }
          update: {
            args: Prisma.AdminUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload>
          }
          deleteMany: {
            args: Prisma.AdminDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AdminUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AdminUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload>
          }
          aggregate: {
            args: Prisma.AdminAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAdmin>
          }
          groupBy: {
            args: Prisma.AdminGroupByArgs<ExtArgs>
            result: $Utils.Optional<AdminGroupByOutputType>[]
          }
          count: {
            args: Prisma.AdminCountArgs<ExtArgs>
            result: $Utils.Optional<AdminCountAggregateOutputType> | number
          }
        }
      }
      DeceasedRecord: {
        payload: Prisma.$DeceasedRecordPayload<ExtArgs>
        fields: Prisma.DeceasedRecordFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DeceasedRecordFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeceasedRecordPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DeceasedRecordFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeceasedRecordPayload>
          }
          findFirst: {
            args: Prisma.DeceasedRecordFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeceasedRecordPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DeceasedRecordFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeceasedRecordPayload>
          }
          findMany: {
            args: Prisma.DeceasedRecordFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeceasedRecordPayload>[]
          }
          create: {
            args: Prisma.DeceasedRecordCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeceasedRecordPayload>
          }
          createMany: {
            args: Prisma.DeceasedRecordCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DeceasedRecordCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeceasedRecordPayload>[]
          }
          delete: {
            args: Prisma.DeceasedRecordDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeceasedRecordPayload>
          }
          update: {
            args: Prisma.DeceasedRecordUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeceasedRecordPayload>
          }
          deleteMany: {
            args: Prisma.DeceasedRecordDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DeceasedRecordUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.DeceasedRecordUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeceasedRecordPayload>
          }
          aggregate: {
            args: Prisma.DeceasedRecordAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDeceasedRecord>
          }
          groupBy: {
            args: Prisma.DeceasedRecordGroupByArgs<ExtArgs>
            result: $Utils.Optional<DeceasedRecordGroupByOutputType>[]
          }
          count: {
            args: Prisma.DeceasedRecordCountArgs<ExtArgs>
            result: $Utils.Optional<DeceasedRecordCountAggregateOutputType> | number
          }
        }
      }
      PaymentRecord: {
        payload: Prisma.$PaymentRecordPayload<ExtArgs>
        fields: Prisma.PaymentRecordFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PaymentRecordFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentRecordPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PaymentRecordFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentRecordPayload>
          }
          findFirst: {
            args: Prisma.PaymentRecordFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentRecordPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PaymentRecordFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentRecordPayload>
          }
          findMany: {
            args: Prisma.PaymentRecordFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentRecordPayload>[]
          }
          create: {
            args: Prisma.PaymentRecordCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentRecordPayload>
          }
          createMany: {
            args: Prisma.PaymentRecordCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PaymentRecordCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentRecordPayload>[]
          }
          delete: {
            args: Prisma.PaymentRecordDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentRecordPayload>
          }
          update: {
            args: Prisma.PaymentRecordUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentRecordPayload>
          }
          deleteMany: {
            args: Prisma.PaymentRecordDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PaymentRecordUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PaymentRecordUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentRecordPayload>
          }
          aggregate: {
            args: Prisma.PaymentRecordAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePaymentRecord>
          }
          groupBy: {
            args: Prisma.PaymentRecordGroupByArgs<ExtArgs>
            result: $Utils.Optional<PaymentRecordGroupByOutputType>[]
          }
          count: {
            args: Prisma.PaymentRecordCountArgs<ExtArgs>
            result: $Utils.Optional<PaymentRecordCountAggregateOutputType> | number
          }
        }
      }
      Inquiries: {
        payload: Prisma.$InquiriesPayload<ExtArgs>
        fields: Prisma.InquiriesFieldRefs
        operations: {
          findUnique: {
            args: Prisma.InquiriesFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InquiriesPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.InquiriesFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InquiriesPayload>
          }
          findFirst: {
            args: Prisma.InquiriesFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InquiriesPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.InquiriesFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InquiriesPayload>
          }
          findMany: {
            args: Prisma.InquiriesFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InquiriesPayload>[]
          }
          create: {
            args: Prisma.InquiriesCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InquiriesPayload>
          }
          createMany: {
            args: Prisma.InquiriesCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.InquiriesCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InquiriesPayload>[]
          }
          delete: {
            args: Prisma.InquiriesDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InquiriesPayload>
          }
          update: {
            args: Prisma.InquiriesUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InquiriesPayload>
          }
          deleteMany: {
            args: Prisma.InquiriesDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.InquiriesUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.InquiriesUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InquiriesPayload>
          }
          aggregate: {
            args: Prisma.InquiriesAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateInquiries>
          }
          groupBy: {
            args: Prisma.InquiriesGroupByArgs<ExtArgs>
            result: $Utils.Optional<InquiriesGroupByOutputType>[]
          }
          count: {
            args: Prisma.InquiriesCountArgs<ExtArgs>
            result: $Utils.Optional<InquiriesCountAggregateOutputType> | number
          }
        }
      }
      Announcement: {
        payload: Prisma.$AnnouncementPayload<ExtArgs>
        fields: Prisma.AnnouncementFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AnnouncementFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnnouncementPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AnnouncementFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnnouncementPayload>
          }
          findFirst: {
            args: Prisma.AnnouncementFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnnouncementPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AnnouncementFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnnouncementPayload>
          }
          findMany: {
            args: Prisma.AnnouncementFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnnouncementPayload>[]
          }
          create: {
            args: Prisma.AnnouncementCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnnouncementPayload>
          }
          createMany: {
            args: Prisma.AnnouncementCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AnnouncementCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnnouncementPayload>[]
          }
          delete: {
            args: Prisma.AnnouncementDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnnouncementPayload>
          }
          update: {
            args: Prisma.AnnouncementUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnnouncementPayload>
          }
          deleteMany: {
            args: Prisma.AnnouncementDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AnnouncementUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AnnouncementUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnnouncementPayload>
          }
          aggregate: {
            args: Prisma.AnnouncementAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAnnouncement>
          }
          groupBy: {
            args: Prisma.AnnouncementGroupByArgs<ExtArgs>
            result: $Utils.Optional<AnnouncementGroupByOutputType>[]
          }
          count: {
            args: Prisma.AnnouncementCountArgs<ExtArgs>
            result: $Utils.Optional<AnnouncementCountAggregateOutputType> | number
          }
        }
      }
      SmsNotification: {
        payload: Prisma.$SmsNotificationPayload<ExtArgs>
        fields: Prisma.SmsNotificationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SmsNotificationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SmsNotificationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SmsNotificationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SmsNotificationPayload>
          }
          findFirst: {
            args: Prisma.SmsNotificationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SmsNotificationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SmsNotificationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SmsNotificationPayload>
          }
          findMany: {
            args: Prisma.SmsNotificationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SmsNotificationPayload>[]
          }
          create: {
            args: Prisma.SmsNotificationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SmsNotificationPayload>
          }
          createMany: {
            args: Prisma.SmsNotificationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SmsNotificationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SmsNotificationPayload>[]
          }
          delete: {
            args: Prisma.SmsNotificationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SmsNotificationPayload>
          }
          update: {
            args: Prisma.SmsNotificationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SmsNotificationPayload>
          }
          deleteMany: {
            args: Prisma.SmsNotificationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SmsNotificationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SmsNotificationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SmsNotificationPayload>
          }
          aggregate: {
            args: Prisma.SmsNotificationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSmsNotification>
          }
          groupBy: {
            args: Prisma.SmsNotificationGroupByArgs<ExtArgs>
            result: $Utils.Optional<SmsNotificationGroupByOutputType>[]
          }
          count: {
            args: Prisma.SmsNotificationCountArgs<ExtArgs>
            result: $Utils.Optional<SmsNotificationCountAggregateOutputType> | number
          }
        }
      }
      SystemSetting: {
        payload: Prisma.$SystemSettingPayload<ExtArgs>
        fields: Prisma.SystemSettingFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SystemSettingFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemSettingPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SystemSettingFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemSettingPayload>
          }
          findFirst: {
            args: Prisma.SystemSettingFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemSettingPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SystemSettingFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemSettingPayload>
          }
          findMany: {
            args: Prisma.SystemSettingFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemSettingPayload>[]
          }
          create: {
            args: Prisma.SystemSettingCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemSettingPayload>
          }
          createMany: {
            args: Prisma.SystemSettingCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SystemSettingCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemSettingPayload>[]
          }
          delete: {
            args: Prisma.SystemSettingDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemSettingPayload>
          }
          update: {
            args: Prisma.SystemSettingUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemSettingPayload>
          }
          deleteMany: {
            args: Prisma.SystemSettingDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SystemSettingUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SystemSettingUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemSettingPayload>
          }
          aggregate: {
            args: Prisma.SystemSettingAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSystemSetting>
          }
          groupBy: {
            args: Prisma.SystemSettingGroupByArgs<ExtArgs>
            result: $Utils.Optional<SystemSettingGroupByOutputType>[]
          }
          count: {
            args: Prisma.SystemSettingCountArgs<ExtArgs>
            result: $Utils.Optional<SystemSettingCountAggregateOutputType> | number
          }
        }
      }
      AdminAuditLog: {
        payload: Prisma.$AdminAuditLogPayload<ExtArgs>
        fields: Prisma.AdminAuditLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AdminAuditLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminAuditLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AdminAuditLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminAuditLogPayload>
          }
          findFirst: {
            args: Prisma.AdminAuditLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminAuditLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AdminAuditLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminAuditLogPayload>
          }
          findMany: {
            args: Prisma.AdminAuditLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminAuditLogPayload>[]
          }
          create: {
            args: Prisma.AdminAuditLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminAuditLogPayload>
          }
          createMany: {
            args: Prisma.AdminAuditLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AdminAuditLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminAuditLogPayload>[]
          }
          delete: {
            args: Prisma.AdminAuditLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminAuditLogPayload>
          }
          update: {
            args: Prisma.AdminAuditLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminAuditLogPayload>
          }
          deleteMany: {
            args: Prisma.AdminAuditLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AdminAuditLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AdminAuditLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminAuditLogPayload>
          }
          aggregate: {
            args: Prisma.AdminAuditLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAdminAuditLog>
          }
          groupBy: {
            args: Prisma.AdminAuditLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<AdminAuditLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.AdminAuditLogCountArgs<ExtArgs>
            result: $Utils.Optional<AdminAuditLogCountAggregateOutputType> | number
          }
        }
      }
      EmailVerification: {
        payload: Prisma.$EmailVerificationPayload<ExtArgs>
        fields: Prisma.EmailVerificationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EmailVerificationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmailVerificationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EmailVerificationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmailVerificationPayload>
          }
          findFirst: {
            args: Prisma.EmailVerificationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmailVerificationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EmailVerificationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmailVerificationPayload>
          }
          findMany: {
            args: Prisma.EmailVerificationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmailVerificationPayload>[]
          }
          create: {
            args: Prisma.EmailVerificationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmailVerificationPayload>
          }
          createMany: {
            args: Prisma.EmailVerificationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.EmailVerificationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmailVerificationPayload>[]
          }
          delete: {
            args: Prisma.EmailVerificationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmailVerificationPayload>
          }
          update: {
            args: Prisma.EmailVerificationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmailVerificationPayload>
          }
          deleteMany: {
            args: Prisma.EmailVerificationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EmailVerificationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.EmailVerificationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmailVerificationPayload>
          }
          aggregate: {
            args: Prisma.EmailVerificationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEmailVerification>
          }
          groupBy: {
            args: Prisma.EmailVerificationGroupByArgs<ExtArgs>
            result: $Utils.Optional<EmailVerificationGroupByOutputType>[]
          }
          count: {
            args: Prisma.EmailVerificationCountArgs<ExtArgs>
            result: $Utils.Optional<EmailVerificationCountAggregateOutputType> | number
          }
        }
      }
      PasswordReset: {
        payload: Prisma.$PasswordResetPayload<ExtArgs>
        fields: Prisma.PasswordResetFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PasswordResetFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PasswordResetFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetPayload>
          }
          findFirst: {
            args: Prisma.PasswordResetFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PasswordResetFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetPayload>
          }
          findMany: {
            args: Prisma.PasswordResetFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetPayload>[]
          }
          create: {
            args: Prisma.PasswordResetCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetPayload>
          }
          createMany: {
            args: Prisma.PasswordResetCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PasswordResetCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetPayload>[]
          }
          delete: {
            args: Prisma.PasswordResetDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetPayload>
          }
          update: {
            args: Prisma.PasswordResetUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetPayload>
          }
          deleteMany: {
            args: Prisma.PasswordResetDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PasswordResetUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PasswordResetUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetPayload>
          }
          aggregate: {
            args: Prisma.PasswordResetAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePasswordReset>
          }
          groupBy: {
            args: Prisma.PasswordResetGroupByArgs<ExtArgs>
            result: $Utils.Optional<PasswordResetGroupByOutputType>[]
          }
          count: {
            args: Prisma.PasswordResetCountArgs<ExtArgs>
            result: $Utils.Optional<PasswordResetCountAggregateOutputType> | number
          }
        }
      }
      EmailNotificationLog: {
        payload: Prisma.$EmailNotificationLogPayload<ExtArgs>
        fields: Prisma.EmailNotificationLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EmailNotificationLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmailNotificationLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EmailNotificationLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmailNotificationLogPayload>
          }
          findFirst: {
            args: Prisma.EmailNotificationLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmailNotificationLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EmailNotificationLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmailNotificationLogPayload>
          }
          findMany: {
            args: Prisma.EmailNotificationLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmailNotificationLogPayload>[]
          }
          create: {
            args: Prisma.EmailNotificationLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmailNotificationLogPayload>
          }
          createMany: {
            args: Prisma.EmailNotificationLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.EmailNotificationLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmailNotificationLogPayload>[]
          }
          delete: {
            args: Prisma.EmailNotificationLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmailNotificationLogPayload>
          }
          update: {
            args: Prisma.EmailNotificationLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmailNotificationLogPayload>
          }
          deleteMany: {
            args: Prisma.EmailNotificationLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EmailNotificationLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.EmailNotificationLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmailNotificationLogPayload>
          }
          aggregate: {
            args: Prisma.EmailNotificationLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEmailNotificationLog>
          }
          groupBy: {
            args: Prisma.EmailNotificationLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<EmailNotificationLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.EmailNotificationLogCountArgs<ExtArgs>
            result: $Utils.Optional<EmailNotificationLogCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type DeceasedRecordCountOutputType
   */

  export type DeceasedRecordCountOutputType = {
    payments: number
  }

  export type DeceasedRecordCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    payments?: boolean | DeceasedRecordCountOutputTypeCountPaymentsArgs
  }

  // Custom InputTypes
  /**
   * DeceasedRecordCountOutputType without action
   */
  export type DeceasedRecordCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeceasedRecordCountOutputType
     */
    select?: DeceasedRecordCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * DeceasedRecordCountOutputType without action
   */
  export type DeceasedRecordCountOutputTypeCountPaymentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PaymentRecordWhereInput
  }


  /**
   * Count Type InquiriesCountOutputType
   */

  export type InquiriesCountOutputType = {
    emailLogs: number
  }

  export type InquiriesCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    emailLogs?: boolean | InquiriesCountOutputTypeCountEmailLogsArgs
  }

  // Custom InputTypes
  /**
   * InquiriesCountOutputType without action
   */
  export type InquiriesCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InquiriesCountOutputType
     */
    select?: InquiriesCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * InquiriesCountOutputType without action
   */
  export type InquiriesCountOutputTypeCountEmailLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EmailNotificationLogWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Admin
   */

  export type AggregateAdmin = {
    _count: AdminCountAggregateOutputType | null
    _avg: AdminAvgAggregateOutputType | null
    _sum: AdminSumAggregateOutputType | null
    _min: AdminMinAggregateOutputType | null
    _max: AdminMaxAggregateOutputType | null
  }

  export type AdminAvgAggregateOutputType = {
    sessionTimeout: number | null
  }

  export type AdminSumAggregateOutputType = {
    sessionTimeout: number | null
  }

  export type AdminMinAggregateOutputType = {
    id: string | null
    email: string | null
    password: string | null
    name: string | null
    username: string | null
    contactNumber: string | null
    role: string | null
    avatar: string | null
    department: string | null
    sessionTimeout: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AdminMaxAggregateOutputType = {
    id: string | null
    email: string | null
    password: string | null
    name: string | null
    username: string | null
    contactNumber: string | null
    role: string | null
    avatar: string | null
    department: string | null
    sessionTimeout: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AdminCountAggregateOutputType = {
    id: number
    email: number
    password: number
    name: number
    username: number
    contactNumber: number
    role: number
    avatar: number
    department: number
    sessionTimeout: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AdminAvgAggregateInputType = {
    sessionTimeout?: true
  }

  export type AdminSumAggregateInputType = {
    sessionTimeout?: true
  }

  export type AdminMinAggregateInputType = {
    id?: true
    email?: true
    password?: true
    name?: true
    username?: true
    contactNumber?: true
    role?: true
    avatar?: true
    department?: true
    sessionTimeout?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AdminMaxAggregateInputType = {
    id?: true
    email?: true
    password?: true
    name?: true
    username?: true
    contactNumber?: true
    role?: true
    avatar?: true
    department?: true
    sessionTimeout?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AdminCountAggregateInputType = {
    id?: true
    email?: true
    password?: true
    name?: true
    username?: true
    contactNumber?: true
    role?: true
    avatar?: true
    department?: true
    sessionTimeout?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AdminAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Admin to aggregate.
     */
    where?: AdminWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Admins to fetch.
     */
    orderBy?: AdminOrderByWithRelationInput | AdminOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AdminWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Admins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Admins.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Admins
    **/
    _count?: true | AdminCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AdminAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AdminSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AdminMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AdminMaxAggregateInputType
  }

  export type GetAdminAggregateType<T extends AdminAggregateArgs> = {
        [P in keyof T & keyof AggregateAdmin]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAdmin[P]>
      : GetScalarType<T[P], AggregateAdmin[P]>
  }




  export type AdminGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AdminWhereInput
    orderBy?: AdminOrderByWithAggregationInput | AdminOrderByWithAggregationInput[]
    by: AdminScalarFieldEnum[] | AdminScalarFieldEnum
    having?: AdminScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AdminCountAggregateInputType | true
    _avg?: AdminAvgAggregateInputType
    _sum?: AdminSumAggregateInputType
    _min?: AdminMinAggregateInputType
    _max?: AdminMaxAggregateInputType
  }

  export type AdminGroupByOutputType = {
    id: string
    email: string
    password: string
    name: string | null
    username: string | null
    contactNumber: string | null
    role: string
    avatar: string | null
    department: string | null
    sessionTimeout: number
    createdAt: Date
    updatedAt: Date
    _count: AdminCountAggregateOutputType | null
    _avg: AdminAvgAggregateOutputType | null
    _sum: AdminSumAggregateOutputType | null
    _min: AdminMinAggregateOutputType | null
    _max: AdminMaxAggregateOutputType | null
  }

  type GetAdminGroupByPayload<T extends AdminGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AdminGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AdminGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AdminGroupByOutputType[P]>
            : GetScalarType<T[P], AdminGroupByOutputType[P]>
        }
      >
    >


  export type AdminSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    password?: boolean
    name?: boolean
    username?: boolean
    contactNumber?: boolean
    role?: boolean
    avatar?: boolean
    department?: boolean
    sessionTimeout?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["admin"]>

  export type AdminSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    password?: boolean
    name?: boolean
    username?: boolean
    contactNumber?: boolean
    role?: boolean
    avatar?: boolean
    department?: boolean
    sessionTimeout?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["admin"]>

  export type AdminSelectScalar = {
    id?: boolean
    email?: boolean
    password?: boolean
    name?: boolean
    username?: boolean
    contactNumber?: boolean
    role?: boolean
    avatar?: boolean
    department?: boolean
    sessionTimeout?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }


  export type $AdminPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Admin"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      password: string
      name: string | null
      username: string | null
      contactNumber: string | null
      role: string
      avatar: string | null
      department: string | null
      sessionTimeout: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["admin"]>
    composites: {}
  }

  type AdminGetPayload<S extends boolean | null | undefined | AdminDefaultArgs> = $Result.GetResult<Prisma.$AdminPayload, S>

  type AdminCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AdminFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AdminCountAggregateInputType | true
    }

  export interface AdminDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Admin'], meta: { name: 'Admin' } }
    /**
     * Find zero or one Admin that matches the filter.
     * @param {AdminFindUniqueArgs} args - Arguments to find a Admin
     * @example
     * // Get one Admin
     * const admin = await prisma.admin.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AdminFindUniqueArgs>(args: SelectSubset<T, AdminFindUniqueArgs<ExtArgs>>): Prisma__AdminClient<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Admin that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {AdminFindUniqueOrThrowArgs} args - Arguments to find a Admin
     * @example
     * // Get one Admin
     * const admin = await prisma.admin.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AdminFindUniqueOrThrowArgs>(args: SelectSubset<T, AdminFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AdminClient<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Admin that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminFindFirstArgs} args - Arguments to find a Admin
     * @example
     * // Get one Admin
     * const admin = await prisma.admin.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AdminFindFirstArgs>(args?: SelectSubset<T, AdminFindFirstArgs<ExtArgs>>): Prisma__AdminClient<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Admin that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminFindFirstOrThrowArgs} args - Arguments to find a Admin
     * @example
     * // Get one Admin
     * const admin = await prisma.admin.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AdminFindFirstOrThrowArgs>(args?: SelectSubset<T, AdminFindFirstOrThrowArgs<ExtArgs>>): Prisma__AdminClient<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Admins that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Admins
     * const admins = await prisma.admin.findMany()
     * 
     * // Get first 10 Admins
     * const admins = await prisma.admin.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const adminWithIdOnly = await prisma.admin.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AdminFindManyArgs>(args?: SelectSubset<T, AdminFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Admin.
     * @param {AdminCreateArgs} args - Arguments to create a Admin.
     * @example
     * // Create one Admin
     * const Admin = await prisma.admin.create({
     *   data: {
     *     // ... data to create a Admin
     *   }
     * })
     * 
     */
    create<T extends AdminCreateArgs>(args: SelectSubset<T, AdminCreateArgs<ExtArgs>>): Prisma__AdminClient<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Admins.
     * @param {AdminCreateManyArgs} args - Arguments to create many Admins.
     * @example
     * // Create many Admins
     * const admin = await prisma.admin.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AdminCreateManyArgs>(args?: SelectSubset<T, AdminCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Admins and returns the data saved in the database.
     * @param {AdminCreateManyAndReturnArgs} args - Arguments to create many Admins.
     * @example
     * // Create many Admins
     * const admin = await prisma.admin.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Admins and only return the `id`
     * const adminWithIdOnly = await prisma.admin.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AdminCreateManyAndReturnArgs>(args?: SelectSubset<T, AdminCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Admin.
     * @param {AdminDeleteArgs} args - Arguments to delete one Admin.
     * @example
     * // Delete one Admin
     * const Admin = await prisma.admin.delete({
     *   where: {
     *     // ... filter to delete one Admin
     *   }
     * })
     * 
     */
    delete<T extends AdminDeleteArgs>(args: SelectSubset<T, AdminDeleteArgs<ExtArgs>>): Prisma__AdminClient<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Admin.
     * @param {AdminUpdateArgs} args - Arguments to update one Admin.
     * @example
     * // Update one Admin
     * const admin = await prisma.admin.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AdminUpdateArgs>(args: SelectSubset<T, AdminUpdateArgs<ExtArgs>>): Prisma__AdminClient<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Admins.
     * @param {AdminDeleteManyArgs} args - Arguments to filter Admins to delete.
     * @example
     * // Delete a few Admins
     * const { count } = await prisma.admin.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AdminDeleteManyArgs>(args?: SelectSubset<T, AdminDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Admins.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Admins
     * const admin = await prisma.admin.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AdminUpdateManyArgs>(args: SelectSubset<T, AdminUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Admin.
     * @param {AdminUpsertArgs} args - Arguments to update or create a Admin.
     * @example
     * // Update or create a Admin
     * const admin = await prisma.admin.upsert({
     *   create: {
     *     // ... data to create a Admin
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Admin we want to update
     *   }
     * })
     */
    upsert<T extends AdminUpsertArgs>(args: SelectSubset<T, AdminUpsertArgs<ExtArgs>>): Prisma__AdminClient<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Admins.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminCountArgs} args - Arguments to filter Admins to count.
     * @example
     * // Count the number of Admins
     * const count = await prisma.admin.count({
     *   where: {
     *     // ... the filter for the Admins we want to count
     *   }
     * })
    **/
    count<T extends AdminCountArgs>(
      args?: Subset<T, AdminCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AdminCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Admin.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AdminAggregateArgs>(args: Subset<T, AdminAggregateArgs>): Prisma.PrismaPromise<GetAdminAggregateType<T>>

    /**
     * Group by Admin.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AdminGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AdminGroupByArgs['orderBy'] }
        : { orderBy?: AdminGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AdminGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAdminGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Admin model
   */
  readonly fields: AdminFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Admin.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AdminClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Admin model
   */ 
  interface AdminFieldRefs {
    readonly id: FieldRef<"Admin", 'String'>
    readonly email: FieldRef<"Admin", 'String'>
    readonly password: FieldRef<"Admin", 'String'>
    readonly name: FieldRef<"Admin", 'String'>
    readonly username: FieldRef<"Admin", 'String'>
    readonly contactNumber: FieldRef<"Admin", 'String'>
    readonly role: FieldRef<"Admin", 'String'>
    readonly avatar: FieldRef<"Admin", 'String'>
    readonly department: FieldRef<"Admin", 'String'>
    readonly sessionTimeout: FieldRef<"Admin", 'Int'>
    readonly createdAt: FieldRef<"Admin", 'DateTime'>
    readonly updatedAt: FieldRef<"Admin", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Admin findUnique
   */
  export type AdminFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * Filter, which Admin to fetch.
     */
    where: AdminWhereUniqueInput
  }

  /**
   * Admin findUniqueOrThrow
   */
  export type AdminFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * Filter, which Admin to fetch.
     */
    where: AdminWhereUniqueInput
  }

  /**
   * Admin findFirst
   */
  export type AdminFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * Filter, which Admin to fetch.
     */
    where?: AdminWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Admins to fetch.
     */
    orderBy?: AdminOrderByWithRelationInput | AdminOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Admins.
     */
    cursor?: AdminWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Admins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Admins.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Admins.
     */
    distinct?: AdminScalarFieldEnum | AdminScalarFieldEnum[]
  }

  /**
   * Admin findFirstOrThrow
   */
  export type AdminFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * Filter, which Admin to fetch.
     */
    where?: AdminWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Admins to fetch.
     */
    orderBy?: AdminOrderByWithRelationInput | AdminOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Admins.
     */
    cursor?: AdminWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Admins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Admins.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Admins.
     */
    distinct?: AdminScalarFieldEnum | AdminScalarFieldEnum[]
  }

  /**
   * Admin findMany
   */
  export type AdminFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * Filter, which Admins to fetch.
     */
    where?: AdminWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Admins to fetch.
     */
    orderBy?: AdminOrderByWithRelationInput | AdminOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Admins.
     */
    cursor?: AdminWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Admins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Admins.
     */
    skip?: number
    distinct?: AdminScalarFieldEnum | AdminScalarFieldEnum[]
  }

  /**
   * Admin create
   */
  export type AdminCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * The data needed to create a Admin.
     */
    data: XOR<AdminCreateInput, AdminUncheckedCreateInput>
  }

  /**
   * Admin createMany
   */
  export type AdminCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Admins.
     */
    data: AdminCreateManyInput | AdminCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Admin createManyAndReturn
   */
  export type AdminCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Admins.
     */
    data: AdminCreateManyInput | AdminCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Admin update
   */
  export type AdminUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * The data needed to update a Admin.
     */
    data: XOR<AdminUpdateInput, AdminUncheckedUpdateInput>
    /**
     * Choose, which Admin to update.
     */
    where: AdminWhereUniqueInput
  }

  /**
   * Admin updateMany
   */
  export type AdminUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Admins.
     */
    data: XOR<AdminUpdateManyMutationInput, AdminUncheckedUpdateManyInput>
    /**
     * Filter which Admins to update
     */
    where?: AdminWhereInput
  }

  /**
   * Admin upsert
   */
  export type AdminUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * The filter to search for the Admin to update in case it exists.
     */
    where: AdminWhereUniqueInput
    /**
     * In case the Admin found by the `where` argument doesn't exist, create a new Admin with this data.
     */
    create: XOR<AdminCreateInput, AdminUncheckedCreateInput>
    /**
     * In case the Admin was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AdminUpdateInput, AdminUncheckedUpdateInput>
  }

  /**
   * Admin delete
   */
  export type AdminDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * Filter which Admin to delete.
     */
    where: AdminWhereUniqueInput
  }

  /**
   * Admin deleteMany
   */
  export type AdminDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Admins to delete
     */
    where?: AdminWhereInput
  }

  /**
   * Admin without action
   */
  export type AdminDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
  }


  /**
   * Model DeceasedRecord
   */

  export type AggregateDeceasedRecord = {
    _count: DeceasedRecordCountAggregateOutputType | null
    _avg: DeceasedRecordAvgAggregateOutputType | null
    _sum: DeceasedRecordSumAggregateOutputType | null
    _min: DeceasedRecordMinAggregateOutputType | null
    _max: DeceasedRecordMaxAggregateOutputType | null
  }

  export type DeceasedRecordAvgAggregateOutputType = {
    YEAR: number | null
    TOTAL_DUE: number | null
    PAID: number | null
    BALANCE: number | null
  }

  export type DeceasedRecordSumAggregateOutputType = {
    YEAR: number | null
    TOTAL_DUE: number | null
    PAID: number | null
    BALANCE: number | null
  }

  export type DeceasedRecordMinAggregateOutputType = {
    id: string | null
    REF_NO: string | null
    PAYORS_NAME: string | null
    CONTACT_NO: string | null
    NAME_OF_DECEASED: string | null
    ADDRESS: string | null
    DATE_OF_BIRTH: Date | null
    DATE_OF_DEATH: Date | null
    YEAR: number | null
    TOTAL_DUE: number | null
    PAID: number | null
    BALANCE: number | null
    STATUS: string | null
    REMARKS: string | null
    isArchived: boolean | null
    archivedAt: Date | null
    archiveReason: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DeceasedRecordMaxAggregateOutputType = {
    id: string | null
    REF_NO: string | null
    PAYORS_NAME: string | null
    CONTACT_NO: string | null
    NAME_OF_DECEASED: string | null
    ADDRESS: string | null
    DATE_OF_BIRTH: Date | null
    DATE_OF_DEATH: Date | null
    YEAR: number | null
    TOTAL_DUE: number | null
    PAID: number | null
    BALANCE: number | null
    STATUS: string | null
    REMARKS: string | null
    isArchived: boolean | null
    archivedAt: Date | null
    archiveReason: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DeceasedRecordCountAggregateOutputType = {
    id: number
    REF_NO: number
    PAYORS_NAME: number
    CONTACT_NO: number
    NAME_OF_DECEASED: number
    ADDRESS: number
    DATE_OF_BIRTH: number
    DATE_OF_DEATH: number
    YEAR: number
    TOTAL_DUE: number
    PAID: number
    BALANCE: number
    STATUS: number
    REMARKS: number
    isArchived: number
    archivedAt: number
    archiveReason: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type DeceasedRecordAvgAggregateInputType = {
    YEAR?: true
    TOTAL_DUE?: true
    PAID?: true
    BALANCE?: true
  }

  export type DeceasedRecordSumAggregateInputType = {
    YEAR?: true
    TOTAL_DUE?: true
    PAID?: true
    BALANCE?: true
  }

  export type DeceasedRecordMinAggregateInputType = {
    id?: true
    REF_NO?: true
    PAYORS_NAME?: true
    CONTACT_NO?: true
    NAME_OF_DECEASED?: true
    ADDRESS?: true
    DATE_OF_BIRTH?: true
    DATE_OF_DEATH?: true
    YEAR?: true
    TOTAL_DUE?: true
    PAID?: true
    BALANCE?: true
    STATUS?: true
    REMARKS?: true
    isArchived?: true
    archivedAt?: true
    archiveReason?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DeceasedRecordMaxAggregateInputType = {
    id?: true
    REF_NO?: true
    PAYORS_NAME?: true
    CONTACT_NO?: true
    NAME_OF_DECEASED?: true
    ADDRESS?: true
    DATE_OF_BIRTH?: true
    DATE_OF_DEATH?: true
    YEAR?: true
    TOTAL_DUE?: true
    PAID?: true
    BALANCE?: true
    STATUS?: true
    REMARKS?: true
    isArchived?: true
    archivedAt?: true
    archiveReason?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DeceasedRecordCountAggregateInputType = {
    id?: true
    REF_NO?: true
    PAYORS_NAME?: true
    CONTACT_NO?: true
    NAME_OF_DECEASED?: true
    ADDRESS?: true
    DATE_OF_BIRTH?: true
    DATE_OF_DEATH?: true
    YEAR?: true
    TOTAL_DUE?: true
    PAID?: true
    BALANCE?: true
    STATUS?: true
    REMARKS?: true
    isArchived?: true
    archivedAt?: true
    archiveReason?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type DeceasedRecordAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DeceasedRecord to aggregate.
     */
    where?: DeceasedRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DeceasedRecords to fetch.
     */
    orderBy?: DeceasedRecordOrderByWithRelationInput | DeceasedRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DeceasedRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DeceasedRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DeceasedRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DeceasedRecords
    **/
    _count?: true | DeceasedRecordCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DeceasedRecordAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DeceasedRecordSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DeceasedRecordMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DeceasedRecordMaxAggregateInputType
  }

  export type GetDeceasedRecordAggregateType<T extends DeceasedRecordAggregateArgs> = {
        [P in keyof T & keyof AggregateDeceasedRecord]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDeceasedRecord[P]>
      : GetScalarType<T[P], AggregateDeceasedRecord[P]>
  }




  export type DeceasedRecordGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DeceasedRecordWhereInput
    orderBy?: DeceasedRecordOrderByWithAggregationInput | DeceasedRecordOrderByWithAggregationInput[]
    by: DeceasedRecordScalarFieldEnum[] | DeceasedRecordScalarFieldEnum
    having?: DeceasedRecordScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DeceasedRecordCountAggregateInputType | true
    _avg?: DeceasedRecordAvgAggregateInputType
    _sum?: DeceasedRecordSumAggregateInputType
    _min?: DeceasedRecordMinAggregateInputType
    _max?: DeceasedRecordMaxAggregateInputType
  }

  export type DeceasedRecordGroupByOutputType = {
    id: string
    REF_NO: string
    PAYORS_NAME: string
    CONTACT_NO: string
    NAME_OF_DECEASED: string
    ADDRESS: string
    DATE_OF_BIRTH: Date
    DATE_OF_DEATH: Date
    YEAR: number
    TOTAL_DUE: number
    PAID: number
    BALANCE: number
    STATUS: string
    REMARKS: string | null
    isArchived: boolean
    archivedAt: Date | null
    archiveReason: string | null
    createdAt: Date
    updatedAt: Date
    _count: DeceasedRecordCountAggregateOutputType | null
    _avg: DeceasedRecordAvgAggregateOutputType | null
    _sum: DeceasedRecordSumAggregateOutputType | null
    _min: DeceasedRecordMinAggregateOutputType | null
    _max: DeceasedRecordMaxAggregateOutputType | null
  }

  type GetDeceasedRecordGroupByPayload<T extends DeceasedRecordGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DeceasedRecordGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DeceasedRecordGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DeceasedRecordGroupByOutputType[P]>
            : GetScalarType<T[P], DeceasedRecordGroupByOutputType[P]>
        }
      >
    >


  export type DeceasedRecordSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    REF_NO?: boolean
    PAYORS_NAME?: boolean
    CONTACT_NO?: boolean
    NAME_OF_DECEASED?: boolean
    ADDRESS?: boolean
    DATE_OF_BIRTH?: boolean
    DATE_OF_DEATH?: boolean
    YEAR?: boolean
    TOTAL_DUE?: boolean
    PAID?: boolean
    BALANCE?: boolean
    STATUS?: boolean
    REMARKS?: boolean
    isArchived?: boolean
    archivedAt?: boolean
    archiveReason?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    payments?: boolean | DeceasedRecord$paymentsArgs<ExtArgs>
    _count?: boolean | DeceasedRecordCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["deceasedRecord"]>

  export type DeceasedRecordSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    REF_NO?: boolean
    PAYORS_NAME?: boolean
    CONTACT_NO?: boolean
    NAME_OF_DECEASED?: boolean
    ADDRESS?: boolean
    DATE_OF_BIRTH?: boolean
    DATE_OF_DEATH?: boolean
    YEAR?: boolean
    TOTAL_DUE?: boolean
    PAID?: boolean
    BALANCE?: boolean
    STATUS?: boolean
    REMARKS?: boolean
    isArchived?: boolean
    archivedAt?: boolean
    archiveReason?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["deceasedRecord"]>

  export type DeceasedRecordSelectScalar = {
    id?: boolean
    REF_NO?: boolean
    PAYORS_NAME?: boolean
    CONTACT_NO?: boolean
    NAME_OF_DECEASED?: boolean
    ADDRESS?: boolean
    DATE_OF_BIRTH?: boolean
    DATE_OF_DEATH?: boolean
    YEAR?: boolean
    TOTAL_DUE?: boolean
    PAID?: boolean
    BALANCE?: boolean
    STATUS?: boolean
    REMARKS?: boolean
    isArchived?: boolean
    archivedAt?: boolean
    archiveReason?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type DeceasedRecordInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    payments?: boolean | DeceasedRecord$paymentsArgs<ExtArgs>
    _count?: boolean | DeceasedRecordCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type DeceasedRecordIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $DeceasedRecordPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "DeceasedRecord"
    objects: {
      payments: Prisma.$PaymentRecordPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      REF_NO: string
      PAYORS_NAME: string
      CONTACT_NO: string
      NAME_OF_DECEASED: string
      ADDRESS: string
      DATE_OF_BIRTH: Date
      DATE_OF_DEATH: Date
      YEAR: number
      TOTAL_DUE: number
      PAID: number
      BALANCE: number
      STATUS: string
      REMARKS: string | null
      isArchived: boolean
      archivedAt: Date | null
      archiveReason: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["deceasedRecord"]>
    composites: {}
  }

  type DeceasedRecordGetPayload<S extends boolean | null | undefined | DeceasedRecordDefaultArgs> = $Result.GetResult<Prisma.$DeceasedRecordPayload, S>

  type DeceasedRecordCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<DeceasedRecordFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: DeceasedRecordCountAggregateInputType | true
    }

  export interface DeceasedRecordDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['DeceasedRecord'], meta: { name: 'DeceasedRecord' } }
    /**
     * Find zero or one DeceasedRecord that matches the filter.
     * @param {DeceasedRecordFindUniqueArgs} args - Arguments to find a DeceasedRecord
     * @example
     * // Get one DeceasedRecord
     * const deceasedRecord = await prisma.deceasedRecord.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DeceasedRecordFindUniqueArgs>(args: SelectSubset<T, DeceasedRecordFindUniqueArgs<ExtArgs>>): Prisma__DeceasedRecordClient<$Result.GetResult<Prisma.$DeceasedRecordPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one DeceasedRecord that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {DeceasedRecordFindUniqueOrThrowArgs} args - Arguments to find a DeceasedRecord
     * @example
     * // Get one DeceasedRecord
     * const deceasedRecord = await prisma.deceasedRecord.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DeceasedRecordFindUniqueOrThrowArgs>(args: SelectSubset<T, DeceasedRecordFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DeceasedRecordClient<$Result.GetResult<Prisma.$DeceasedRecordPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first DeceasedRecord that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeceasedRecordFindFirstArgs} args - Arguments to find a DeceasedRecord
     * @example
     * // Get one DeceasedRecord
     * const deceasedRecord = await prisma.deceasedRecord.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DeceasedRecordFindFirstArgs>(args?: SelectSubset<T, DeceasedRecordFindFirstArgs<ExtArgs>>): Prisma__DeceasedRecordClient<$Result.GetResult<Prisma.$DeceasedRecordPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first DeceasedRecord that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeceasedRecordFindFirstOrThrowArgs} args - Arguments to find a DeceasedRecord
     * @example
     * // Get one DeceasedRecord
     * const deceasedRecord = await prisma.deceasedRecord.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DeceasedRecordFindFirstOrThrowArgs>(args?: SelectSubset<T, DeceasedRecordFindFirstOrThrowArgs<ExtArgs>>): Prisma__DeceasedRecordClient<$Result.GetResult<Prisma.$DeceasedRecordPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more DeceasedRecords that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeceasedRecordFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DeceasedRecords
     * const deceasedRecords = await prisma.deceasedRecord.findMany()
     * 
     * // Get first 10 DeceasedRecords
     * const deceasedRecords = await prisma.deceasedRecord.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const deceasedRecordWithIdOnly = await prisma.deceasedRecord.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DeceasedRecordFindManyArgs>(args?: SelectSubset<T, DeceasedRecordFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DeceasedRecordPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a DeceasedRecord.
     * @param {DeceasedRecordCreateArgs} args - Arguments to create a DeceasedRecord.
     * @example
     * // Create one DeceasedRecord
     * const DeceasedRecord = await prisma.deceasedRecord.create({
     *   data: {
     *     // ... data to create a DeceasedRecord
     *   }
     * })
     * 
     */
    create<T extends DeceasedRecordCreateArgs>(args: SelectSubset<T, DeceasedRecordCreateArgs<ExtArgs>>): Prisma__DeceasedRecordClient<$Result.GetResult<Prisma.$DeceasedRecordPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many DeceasedRecords.
     * @param {DeceasedRecordCreateManyArgs} args - Arguments to create many DeceasedRecords.
     * @example
     * // Create many DeceasedRecords
     * const deceasedRecord = await prisma.deceasedRecord.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DeceasedRecordCreateManyArgs>(args?: SelectSubset<T, DeceasedRecordCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many DeceasedRecords and returns the data saved in the database.
     * @param {DeceasedRecordCreateManyAndReturnArgs} args - Arguments to create many DeceasedRecords.
     * @example
     * // Create many DeceasedRecords
     * const deceasedRecord = await prisma.deceasedRecord.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many DeceasedRecords and only return the `id`
     * const deceasedRecordWithIdOnly = await prisma.deceasedRecord.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DeceasedRecordCreateManyAndReturnArgs>(args?: SelectSubset<T, DeceasedRecordCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DeceasedRecordPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a DeceasedRecord.
     * @param {DeceasedRecordDeleteArgs} args - Arguments to delete one DeceasedRecord.
     * @example
     * // Delete one DeceasedRecord
     * const DeceasedRecord = await prisma.deceasedRecord.delete({
     *   where: {
     *     // ... filter to delete one DeceasedRecord
     *   }
     * })
     * 
     */
    delete<T extends DeceasedRecordDeleteArgs>(args: SelectSubset<T, DeceasedRecordDeleteArgs<ExtArgs>>): Prisma__DeceasedRecordClient<$Result.GetResult<Prisma.$DeceasedRecordPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one DeceasedRecord.
     * @param {DeceasedRecordUpdateArgs} args - Arguments to update one DeceasedRecord.
     * @example
     * // Update one DeceasedRecord
     * const deceasedRecord = await prisma.deceasedRecord.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DeceasedRecordUpdateArgs>(args: SelectSubset<T, DeceasedRecordUpdateArgs<ExtArgs>>): Prisma__DeceasedRecordClient<$Result.GetResult<Prisma.$DeceasedRecordPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more DeceasedRecords.
     * @param {DeceasedRecordDeleteManyArgs} args - Arguments to filter DeceasedRecords to delete.
     * @example
     * // Delete a few DeceasedRecords
     * const { count } = await prisma.deceasedRecord.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DeceasedRecordDeleteManyArgs>(args?: SelectSubset<T, DeceasedRecordDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DeceasedRecords.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeceasedRecordUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DeceasedRecords
     * const deceasedRecord = await prisma.deceasedRecord.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DeceasedRecordUpdateManyArgs>(args: SelectSubset<T, DeceasedRecordUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one DeceasedRecord.
     * @param {DeceasedRecordUpsertArgs} args - Arguments to update or create a DeceasedRecord.
     * @example
     * // Update or create a DeceasedRecord
     * const deceasedRecord = await prisma.deceasedRecord.upsert({
     *   create: {
     *     // ... data to create a DeceasedRecord
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DeceasedRecord we want to update
     *   }
     * })
     */
    upsert<T extends DeceasedRecordUpsertArgs>(args: SelectSubset<T, DeceasedRecordUpsertArgs<ExtArgs>>): Prisma__DeceasedRecordClient<$Result.GetResult<Prisma.$DeceasedRecordPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of DeceasedRecords.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeceasedRecordCountArgs} args - Arguments to filter DeceasedRecords to count.
     * @example
     * // Count the number of DeceasedRecords
     * const count = await prisma.deceasedRecord.count({
     *   where: {
     *     // ... the filter for the DeceasedRecords we want to count
     *   }
     * })
    **/
    count<T extends DeceasedRecordCountArgs>(
      args?: Subset<T, DeceasedRecordCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DeceasedRecordCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DeceasedRecord.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeceasedRecordAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DeceasedRecordAggregateArgs>(args: Subset<T, DeceasedRecordAggregateArgs>): Prisma.PrismaPromise<GetDeceasedRecordAggregateType<T>>

    /**
     * Group by DeceasedRecord.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeceasedRecordGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DeceasedRecordGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DeceasedRecordGroupByArgs['orderBy'] }
        : { orderBy?: DeceasedRecordGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DeceasedRecordGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDeceasedRecordGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the DeceasedRecord model
   */
  readonly fields: DeceasedRecordFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for DeceasedRecord.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DeceasedRecordClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    payments<T extends DeceasedRecord$paymentsArgs<ExtArgs> = {}>(args?: Subset<T, DeceasedRecord$paymentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentRecordPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the DeceasedRecord model
   */ 
  interface DeceasedRecordFieldRefs {
    readonly id: FieldRef<"DeceasedRecord", 'String'>
    readonly REF_NO: FieldRef<"DeceasedRecord", 'String'>
    readonly PAYORS_NAME: FieldRef<"DeceasedRecord", 'String'>
    readonly CONTACT_NO: FieldRef<"DeceasedRecord", 'String'>
    readonly NAME_OF_DECEASED: FieldRef<"DeceasedRecord", 'String'>
    readonly ADDRESS: FieldRef<"DeceasedRecord", 'String'>
    readonly DATE_OF_BIRTH: FieldRef<"DeceasedRecord", 'DateTime'>
    readonly DATE_OF_DEATH: FieldRef<"DeceasedRecord", 'DateTime'>
    readonly YEAR: FieldRef<"DeceasedRecord", 'Int'>
    readonly TOTAL_DUE: FieldRef<"DeceasedRecord", 'Float'>
    readonly PAID: FieldRef<"DeceasedRecord", 'Float'>
    readonly BALANCE: FieldRef<"DeceasedRecord", 'Float'>
    readonly STATUS: FieldRef<"DeceasedRecord", 'String'>
    readonly REMARKS: FieldRef<"DeceasedRecord", 'String'>
    readonly isArchived: FieldRef<"DeceasedRecord", 'Boolean'>
    readonly archivedAt: FieldRef<"DeceasedRecord", 'DateTime'>
    readonly archiveReason: FieldRef<"DeceasedRecord", 'String'>
    readonly createdAt: FieldRef<"DeceasedRecord", 'DateTime'>
    readonly updatedAt: FieldRef<"DeceasedRecord", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * DeceasedRecord findUnique
   */
  export type DeceasedRecordFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeceasedRecord
     */
    select?: DeceasedRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeceasedRecordInclude<ExtArgs> | null
    /**
     * Filter, which DeceasedRecord to fetch.
     */
    where: DeceasedRecordWhereUniqueInput
  }

  /**
   * DeceasedRecord findUniqueOrThrow
   */
  export type DeceasedRecordFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeceasedRecord
     */
    select?: DeceasedRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeceasedRecordInclude<ExtArgs> | null
    /**
     * Filter, which DeceasedRecord to fetch.
     */
    where: DeceasedRecordWhereUniqueInput
  }

  /**
   * DeceasedRecord findFirst
   */
  export type DeceasedRecordFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeceasedRecord
     */
    select?: DeceasedRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeceasedRecordInclude<ExtArgs> | null
    /**
     * Filter, which DeceasedRecord to fetch.
     */
    where?: DeceasedRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DeceasedRecords to fetch.
     */
    orderBy?: DeceasedRecordOrderByWithRelationInput | DeceasedRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DeceasedRecords.
     */
    cursor?: DeceasedRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DeceasedRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DeceasedRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DeceasedRecords.
     */
    distinct?: DeceasedRecordScalarFieldEnum | DeceasedRecordScalarFieldEnum[]
  }

  /**
   * DeceasedRecord findFirstOrThrow
   */
  export type DeceasedRecordFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeceasedRecord
     */
    select?: DeceasedRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeceasedRecordInclude<ExtArgs> | null
    /**
     * Filter, which DeceasedRecord to fetch.
     */
    where?: DeceasedRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DeceasedRecords to fetch.
     */
    orderBy?: DeceasedRecordOrderByWithRelationInput | DeceasedRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DeceasedRecords.
     */
    cursor?: DeceasedRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DeceasedRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DeceasedRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DeceasedRecords.
     */
    distinct?: DeceasedRecordScalarFieldEnum | DeceasedRecordScalarFieldEnum[]
  }

  /**
   * DeceasedRecord findMany
   */
  export type DeceasedRecordFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeceasedRecord
     */
    select?: DeceasedRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeceasedRecordInclude<ExtArgs> | null
    /**
     * Filter, which DeceasedRecords to fetch.
     */
    where?: DeceasedRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DeceasedRecords to fetch.
     */
    orderBy?: DeceasedRecordOrderByWithRelationInput | DeceasedRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DeceasedRecords.
     */
    cursor?: DeceasedRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DeceasedRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DeceasedRecords.
     */
    skip?: number
    distinct?: DeceasedRecordScalarFieldEnum | DeceasedRecordScalarFieldEnum[]
  }

  /**
   * DeceasedRecord create
   */
  export type DeceasedRecordCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeceasedRecord
     */
    select?: DeceasedRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeceasedRecordInclude<ExtArgs> | null
    /**
     * The data needed to create a DeceasedRecord.
     */
    data: XOR<DeceasedRecordCreateInput, DeceasedRecordUncheckedCreateInput>
  }

  /**
   * DeceasedRecord createMany
   */
  export type DeceasedRecordCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many DeceasedRecords.
     */
    data: DeceasedRecordCreateManyInput | DeceasedRecordCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * DeceasedRecord createManyAndReturn
   */
  export type DeceasedRecordCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeceasedRecord
     */
    select?: DeceasedRecordSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many DeceasedRecords.
     */
    data: DeceasedRecordCreateManyInput | DeceasedRecordCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * DeceasedRecord update
   */
  export type DeceasedRecordUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeceasedRecord
     */
    select?: DeceasedRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeceasedRecordInclude<ExtArgs> | null
    /**
     * The data needed to update a DeceasedRecord.
     */
    data: XOR<DeceasedRecordUpdateInput, DeceasedRecordUncheckedUpdateInput>
    /**
     * Choose, which DeceasedRecord to update.
     */
    where: DeceasedRecordWhereUniqueInput
  }

  /**
   * DeceasedRecord updateMany
   */
  export type DeceasedRecordUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update DeceasedRecords.
     */
    data: XOR<DeceasedRecordUpdateManyMutationInput, DeceasedRecordUncheckedUpdateManyInput>
    /**
     * Filter which DeceasedRecords to update
     */
    where?: DeceasedRecordWhereInput
  }

  /**
   * DeceasedRecord upsert
   */
  export type DeceasedRecordUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeceasedRecord
     */
    select?: DeceasedRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeceasedRecordInclude<ExtArgs> | null
    /**
     * The filter to search for the DeceasedRecord to update in case it exists.
     */
    where: DeceasedRecordWhereUniqueInput
    /**
     * In case the DeceasedRecord found by the `where` argument doesn't exist, create a new DeceasedRecord with this data.
     */
    create: XOR<DeceasedRecordCreateInput, DeceasedRecordUncheckedCreateInput>
    /**
     * In case the DeceasedRecord was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DeceasedRecordUpdateInput, DeceasedRecordUncheckedUpdateInput>
  }

  /**
   * DeceasedRecord delete
   */
  export type DeceasedRecordDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeceasedRecord
     */
    select?: DeceasedRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeceasedRecordInclude<ExtArgs> | null
    /**
     * Filter which DeceasedRecord to delete.
     */
    where: DeceasedRecordWhereUniqueInput
  }

  /**
   * DeceasedRecord deleteMany
   */
  export type DeceasedRecordDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DeceasedRecords to delete
     */
    where?: DeceasedRecordWhereInput
  }

  /**
   * DeceasedRecord.payments
   */
  export type DeceasedRecord$paymentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentRecord
     */
    select?: PaymentRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentRecordInclude<ExtArgs> | null
    where?: PaymentRecordWhereInput
    orderBy?: PaymentRecordOrderByWithRelationInput | PaymentRecordOrderByWithRelationInput[]
    cursor?: PaymentRecordWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PaymentRecordScalarFieldEnum | PaymentRecordScalarFieldEnum[]
  }

  /**
   * DeceasedRecord without action
   */
  export type DeceasedRecordDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeceasedRecord
     */
    select?: DeceasedRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeceasedRecordInclude<ExtArgs> | null
  }


  /**
   * Model PaymentRecord
   */

  export type AggregatePaymentRecord = {
    _count: PaymentRecordCountAggregateOutputType | null
    _avg: PaymentRecordAvgAggregateOutputType | null
    _sum: PaymentRecordSumAggregateOutputType | null
    _min: PaymentRecordMinAggregateOutputType | null
    _max: PaymentRecordMaxAggregateOutputType | null
  }

  export type PaymentRecordAvgAggregateOutputType = {
    YEAR: number | null
    TOTAL_DUE: number | null
    PAID: number | null
    BALANCE: number | null
  }

  export type PaymentRecordSumAggregateOutputType = {
    YEAR: number | null
    TOTAL_DUE: number | null
    PAID: number | null
    BALANCE: number | null
  }

  export type PaymentRecordMinAggregateOutputType = {
    id: string | null
    REF_NO: string | null
    PAYORS_NAME: string | null
    CONTACT_NO: string | null
    NAME_OF_DECEASED: string | null
    ADDRESS: string | null
    DATE_OF_BIRTH: Date | null
    DATE_OF_DEATH: Date | null
    YEAR: number | null
    TOTAL_DUE: number | null
    PAID: number | null
    BALANCE: number | null
    STATUS: string | null
    REMARKS: string | null
    OR_NO: string | null
    DATE_PAID: string | null
    METHOD: string | null
    DUE_DATE: string | null
    deceasedRecordId: string | null
    isArchived: boolean | null
    archivedAt: Date | null
    archiveReason: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PaymentRecordMaxAggregateOutputType = {
    id: string | null
    REF_NO: string | null
    PAYORS_NAME: string | null
    CONTACT_NO: string | null
    NAME_OF_DECEASED: string | null
    ADDRESS: string | null
    DATE_OF_BIRTH: Date | null
    DATE_OF_DEATH: Date | null
    YEAR: number | null
    TOTAL_DUE: number | null
    PAID: number | null
    BALANCE: number | null
    STATUS: string | null
    REMARKS: string | null
    OR_NO: string | null
    DATE_PAID: string | null
    METHOD: string | null
    DUE_DATE: string | null
    deceasedRecordId: string | null
    isArchived: boolean | null
    archivedAt: Date | null
    archiveReason: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PaymentRecordCountAggregateOutputType = {
    id: number
    REF_NO: number
    PAYORS_NAME: number
    CONTACT_NO: number
    NAME_OF_DECEASED: number
    ADDRESS: number
    DATE_OF_BIRTH: number
    DATE_OF_DEATH: number
    YEAR: number
    TOTAL_DUE: number
    PAID: number
    BALANCE: number
    STATUS: number
    REMARKS: number
    OR_NO: number
    DATE_PAID: number
    METHOD: number
    DUE_DATE: number
    deceasedRecordId: number
    isArchived: number
    archivedAt: number
    archiveReason: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PaymentRecordAvgAggregateInputType = {
    YEAR?: true
    TOTAL_DUE?: true
    PAID?: true
    BALANCE?: true
  }

  export type PaymentRecordSumAggregateInputType = {
    YEAR?: true
    TOTAL_DUE?: true
    PAID?: true
    BALANCE?: true
  }

  export type PaymentRecordMinAggregateInputType = {
    id?: true
    REF_NO?: true
    PAYORS_NAME?: true
    CONTACT_NO?: true
    NAME_OF_DECEASED?: true
    ADDRESS?: true
    DATE_OF_BIRTH?: true
    DATE_OF_DEATH?: true
    YEAR?: true
    TOTAL_DUE?: true
    PAID?: true
    BALANCE?: true
    STATUS?: true
    REMARKS?: true
    OR_NO?: true
    DATE_PAID?: true
    METHOD?: true
    DUE_DATE?: true
    deceasedRecordId?: true
    isArchived?: true
    archivedAt?: true
    archiveReason?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PaymentRecordMaxAggregateInputType = {
    id?: true
    REF_NO?: true
    PAYORS_NAME?: true
    CONTACT_NO?: true
    NAME_OF_DECEASED?: true
    ADDRESS?: true
    DATE_OF_BIRTH?: true
    DATE_OF_DEATH?: true
    YEAR?: true
    TOTAL_DUE?: true
    PAID?: true
    BALANCE?: true
    STATUS?: true
    REMARKS?: true
    OR_NO?: true
    DATE_PAID?: true
    METHOD?: true
    DUE_DATE?: true
    deceasedRecordId?: true
    isArchived?: true
    archivedAt?: true
    archiveReason?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PaymentRecordCountAggregateInputType = {
    id?: true
    REF_NO?: true
    PAYORS_NAME?: true
    CONTACT_NO?: true
    NAME_OF_DECEASED?: true
    ADDRESS?: true
    DATE_OF_BIRTH?: true
    DATE_OF_DEATH?: true
    YEAR?: true
    TOTAL_DUE?: true
    PAID?: true
    BALANCE?: true
    STATUS?: true
    REMARKS?: true
    OR_NO?: true
    DATE_PAID?: true
    METHOD?: true
    DUE_DATE?: true
    deceasedRecordId?: true
    isArchived?: true
    archivedAt?: true
    archiveReason?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PaymentRecordAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PaymentRecord to aggregate.
     */
    where?: PaymentRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PaymentRecords to fetch.
     */
    orderBy?: PaymentRecordOrderByWithRelationInput | PaymentRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PaymentRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PaymentRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PaymentRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PaymentRecords
    **/
    _count?: true | PaymentRecordCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PaymentRecordAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PaymentRecordSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PaymentRecordMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PaymentRecordMaxAggregateInputType
  }

  export type GetPaymentRecordAggregateType<T extends PaymentRecordAggregateArgs> = {
        [P in keyof T & keyof AggregatePaymentRecord]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePaymentRecord[P]>
      : GetScalarType<T[P], AggregatePaymentRecord[P]>
  }




  export type PaymentRecordGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PaymentRecordWhereInput
    orderBy?: PaymentRecordOrderByWithAggregationInput | PaymentRecordOrderByWithAggregationInput[]
    by: PaymentRecordScalarFieldEnum[] | PaymentRecordScalarFieldEnum
    having?: PaymentRecordScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PaymentRecordCountAggregateInputType | true
    _avg?: PaymentRecordAvgAggregateInputType
    _sum?: PaymentRecordSumAggregateInputType
    _min?: PaymentRecordMinAggregateInputType
    _max?: PaymentRecordMaxAggregateInputType
  }

  export type PaymentRecordGroupByOutputType = {
    id: string
    REF_NO: string
    PAYORS_NAME: string
    CONTACT_NO: string | null
    NAME_OF_DECEASED: string
    ADDRESS: string | null
    DATE_OF_BIRTH: Date | null
    DATE_OF_DEATH: Date | null
    YEAR: number
    TOTAL_DUE: number
    PAID: number
    BALANCE: number
    STATUS: string
    REMARKS: string | null
    OR_NO: string | null
    DATE_PAID: string | null
    METHOD: string | null
    DUE_DATE: string | null
    deceasedRecordId: string | null
    isArchived: boolean
    archivedAt: Date | null
    archiveReason: string | null
    createdAt: Date
    updatedAt: Date
    _count: PaymentRecordCountAggregateOutputType | null
    _avg: PaymentRecordAvgAggregateOutputType | null
    _sum: PaymentRecordSumAggregateOutputType | null
    _min: PaymentRecordMinAggregateOutputType | null
    _max: PaymentRecordMaxAggregateOutputType | null
  }

  type GetPaymentRecordGroupByPayload<T extends PaymentRecordGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PaymentRecordGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PaymentRecordGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PaymentRecordGroupByOutputType[P]>
            : GetScalarType<T[P], PaymentRecordGroupByOutputType[P]>
        }
      >
    >


  export type PaymentRecordSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    REF_NO?: boolean
    PAYORS_NAME?: boolean
    CONTACT_NO?: boolean
    NAME_OF_DECEASED?: boolean
    ADDRESS?: boolean
    DATE_OF_BIRTH?: boolean
    DATE_OF_DEATH?: boolean
    YEAR?: boolean
    TOTAL_DUE?: boolean
    PAID?: boolean
    BALANCE?: boolean
    STATUS?: boolean
    REMARKS?: boolean
    OR_NO?: boolean
    DATE_PAID?: boolean
    METHOD?: boolean
    DUE_DATE?: boolean
    deceasedRecordId?: boolean
    isArchived?: boolean
    archivedAt?: boolean
    archiveReason?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deceasedRecord?: boolean | PaymentRecord$deceasedRecordArgs<ExtArgs>
  }, ExtArgs["result"]["paymentRecord"]>

  export type PaymentRecordSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    REF_NO?: boolean
    PAYORS_NAME?: boolean
    CONTACT_NO?: boolean
    NAME_OF_DECEASED?: boolean
    ADDRESS?: boolean
    DATE_OF_BIRTH?: boolean
    DATE_OF_DEATH?: boolean
    YEAR?: boolean
    TOTAL_DUE?: boolean
    PAID?: boolean
    BALANCE?: boolean
    STATUS?: boolean
    REMARKS?: boolean
    OR_NO?: boolean
    DATE_PAID?: boolean
    METHOD?: boolean
    DUE_DATE?: boolean
    deceasedRecordId?: boolean
    isArchived?: boolean
    archivedAt?: boolean
    archiveReason?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deceasedRecord?: boolean | PaymentRecord$deceasedRecordArgs<ExtArgs>
  }, ExtArgs["result"]["paymentRecord"]>

  export type PaymentRecordSelectScalar = {
    id?: boolean
    REF_NO?: boolean
    PAYORS_NAME?: boolean
    CONTACT_NO?: boolean
    NAME_OF_DECEASED?: boolean
    ADDRESS?: boolean
    DATE_OF_BIRTH?: boolean
    DATE_OF_DEATH?: boolean
    YEAR?: boolean
    TOTAL_DUE?: boolean
    PAID?: boolean
    BALANCE?: boolean
    STATUS?: boolean
    REMARKS?: boolean
    OR_NO?: boolean
    DATE_PAID?: boolean
    METHOD?: boolean
    DUE_DATE?: boolean
    deceasedRecordId?: boolean
    isArchived?: boolean
    archivedAt?: boolean
    archiveReason?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type PaymentRecordInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    deceasedRecord?: boolean | PaymentRecord$deceasedRecordArgs<ExtArgs>
  }
  export type PaymentRecordIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    deceasedRecord?: boolean | PaymentRecord$deceasedRecordArgs<ExtArgs>
  }

  export type $PaymentRecordPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PaymentRecord"
    objects: {
      deceasedRecord: Prisma.$DeceasedRecordPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      REF_NO: string
      PAYORS_NAME: string
      CONTACT_NO: string | null
      NAME_OF_DECEASED: string
      ADDRESS: string | null
      DATE_OF_BIRTH: Date | null
      DATE_OF_DEATH: Date | null
      YEAR: number
      TOTAL_DUE: number
      PAID: number
      BALANCE: number
      STATUS: string
      REMARKS: string | null
      OR_NO: string | null
      DATE_PAID: string | null
      METHOD: string | null
      DUE_DATE: string | null
      deceasedRecordId: string | null
      isArchived: boolean
      archivedAt: Date | null
      archiveReason: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["paymentRecord"]>
    composites: {}
  }

  type PaymentRecordGetPayload<S extends boolean | null | undefined | PaymentRecordDefaultArgs> = $Result.GetResult<Prisma.$PaymentRecordPayload, S>

  type PaymentRecordCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<PaymentRecordFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: PaymentRecordCountAggregateInputType | true
    }

  export interface PaymentRecordDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PaymentRecord'], meta: { name: 'PaymentRecord' } }
    /**
     * Find zero or one PaymentRecord that matches the filter.
     * @param {PaymentRecordFindUniqueArgs} args - Arguments to find a PaymentRecord
     * @example
     * // Get one PaymentRecord
     * const paymentRecord = await prisma.paymentRecord.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PaymentRecordFindUniqueArgs>(args: SelectSubset<T, PaymentRecordFindUniqueArgs<ExtArgs>>): Prisma__PaymentRecordClient<$Result.GetResult<Prisma.$PaymentRecordPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one PaymentRecord that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {PaymentRecordFindUniqueOrThrowArgs} args - Arguments to find a PaymentRecord
     * @example
     * // Get one PaymentRecord
     * const paymentRecord = await prisma.paymentRecord.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PaymentRecordFindUniqueOrThrowArgs>(args: SelectSubset<T, PaymentRecordFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PaymentRecordClient<$Result.GetResult<Prisma.$PaymentRecordPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first PaymentRecord that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentRecordFindFirstArgs} args - Arguments to find a PaymentRecord
     * @example
     * // Get one PaymentRecord
     * const paymentRecord = await prisma.paymentRecord.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PaymentRecordFindFirstArgs>(args?: SelectSubset<T, PaymentRecordFindFirstArgs<ExtArgs>>): Prisma__PaymentRecordClient<$Result.GetResult<Prisma.$PaymentRecordPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first PaymentRecord that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentRecordFindFirstOrThrowArgs} args - Arguments to find a PaymentRecord
     * @example
     * // Get one PaymentRecord
     * const paymentRecord = await prisma.paymentRecord.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PaymentRecordFindFirstOrThrowArgs>(args?: SelectSubset<T, PaymentRecordFindFirstOrThrowArgs<ExtArgs>>): Prisma__PaymentRecordClient<$Result.GetResult<Prisma.$PaymentRecordPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more PaymentRecords that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentRecordFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PaymentRecords
     * const paymentRecords = await prisma.paymentRecord.findMany()
     * 
     * // Get first 10 PaymentRecords
     * const paymentRecords = await prisma.paymentRecord.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const paymentRecordWithIdOnly = await prisma.paymentRecord.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PaymentRecordFindManyArgs>(args?: SelectSubset<T, PaymentRecordFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentRecordPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a PaymentRecord.
     * @param {PaymentRecordCreateArgs} args - Arguments to create a PaymentRecord.
     * @example
     * // Create one PaymentRecord
     * const PaymentRecord = await prisma.paymentRecord.create({
     *   data: {
     *     // ... data to create a PaymentRecord
     *   }
     * })
     * 
     */
    create<T extends PaymentRecordCreateArgs>(args: SelectSubset<T, PaymentRecordCreateArgs<ExtArgs>>): Prisma__PaymentRecordClient<$Result.GetResult<Prisma.$PaymentRecordPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many PaymentRecords.
     * @param {PaymentRecordCreateManyArgs} args - Arguments to create many PaymentRecords.
     * @example
     * // Create many PaymentRecords
     * const paymentRecord = await prisma.paymentRecord.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PaymentRecordCreateManyArgs>(args?: SelectSubset<T, PaymentRecordCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PaymentRecords and returns the data saved in the database.
     * @param {PaymentRecordCreateManyAndReturnArgs} args - Arguments to create many PaymentRecords.
     * @example
     * // Create many PaymentRecords
     * const paymentRecord = await prisma.paymentRecord.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PaymentRecords and only return the `id`
     * const paymentRecordWithIdOnly = await prisma.paymentRecord.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PaymentRecordCreateManyAndReturnArgs>(args?: SelectSubset<T, PaymentRecordCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentRecordPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a PaymentRecord.
     * @param {PaymentRecordDeleteArgs} args - Arguments to delete one PaymentRecord.
     * @example
     * // Delete one PaymentRecord
     * const PaymentRecord = await prisma.paymentRecord.delete({
     *   where: {
     *     // ... filter to delete one PaymentRecord
     *   }
     * })
     * 
     */
    delete<T extends PaymentRecordDeleteArgs>(args: SelectSubset<T, PaymentRecordDeleteArgs<ExtArgs>>): Prisma__PaymentRecordClient<$Result.GetResult<Prisma.$PaymentRecordPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one PaymentRecord.
     * @param {PaymentRecordUpdateArgs} args - Arguments to update one PaymentRecord.
     * @example
     * // Update one PaymentRecord
     * const paymentRecord = await prisma.paymentRecord.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PaymentRecordUpdateArgs>(args: SelectSubset<T, PaymentRecordUpdateArgs<ExtArgs>>): Prisma__PaymentRecordClient<$Result.GetResult<Prisma.$PaymentRecordPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more PaymentRecords.
     * @param {PaymentRecordDeleteManyArgs} args - Arguments to filter PaymentRecords to delete.
     * @example
     * // Delete a few PaymentRecords
     * const { count } = await prisma.paymentRecord.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PaymentRecordDeleteManyArgs>(args?: SelectSubset<T, PaymentRecordDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PaymentRecords.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentRecordUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PaymentRecords
     * const paymentRecord = await prisma.paymentRecord.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PaymentRecordUpdateManyArgs>(args: SelectSubset<T, PaymentRecordUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one PaymentRecord.
     * @param {PaymentRecordUpsertArgs} args - Arguments to update or create a PaymentRecord.
     * @example
     * // Update or create a PaymentRecord
     * const paymentRecord = await prisma.paymentRecord.upsert({
     *   create: {
     *     // ... data to create a PaymentRecord
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PaymentRecord we want to update
     *   }
     * })
     */
    upsert<T extends PaymentRecordUpsertArgs>(args: SelectSubset<T, PaymentRecordUpsertArgs<ExtArgs>>): Prisma__PaymentRecordClient<$Result.GetResult<Prisma.$PaymentRecordPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of PaymentRecords.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentRecordCountArgs} args - Arguments to filter PaymentRecords to count.
     * @example
     * // Count the number of PaymentRecords
     * const count = await prisma.paymentRecord.count({
     *   where: {
     *     // ... the filter for the PaymentRecords we want to count
     *   }
     * })
    **/
    count<T extends PaymentRecordCountArgs>(
      args?: Subset<T, PaymentRecordCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PaymentRecordCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PaymentRecord.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentRecordAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PaymentRecordAggregateArgs>(args: Subset<T, PaymentRecordAggregateArgs>): Prisma.PrismaPromise<GetPaymentRecordAggregateType<T>>

    /**
     * Group by PaymentRecord.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentRecordGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PaymentRecordGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PaymentRecordGroupByArgs['orderBy'] }
        : { orderBy?: PaymentRecordGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PaymentRecordGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPaymentRecordGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PaymentRecord model
   */
  readonly fields: PaymentRecordFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PaymentRecord.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PaymentRecordClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    deceasedRecord<T extends PaymentRecord$deceasedRecordArgs<ExtArgs> = {}>(args?: Subset<T, PaymentRecord$deceasedRecordArgs<ExtArgs>>): Prisma__DeceasedRecordClient<$Result.GetResult<Prisma.$DeceasedRecordPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PaymentRecord model
   */ 
  interface PaymentRecordFieldRefs {
    readonly id: FieldRef<"PaymentRecord", 'String'>
    readonly REF_NO: FieldRef<"PaymentRecord", 'String'>
    readonly PAYORS_NAME: FieldRef<"PaymentRecord", 'String'>
    readonly CONTACT_NO: FieldRef<"PaymentRecord", 'String'>
    readonly NAME_OF_DECEASED: FieldRef<"PaymentRecord", 'String'>
    readonly ADDRESS: FieldRef<"PaymentRecord", 'String'>
    readonly DATE_OF_BIRTH: FieldRef<"PaymentRecord", 'DateTime'>
    readonly DATE_OF_DEATH: FieldRef<"PaymentRecord", 'DateTime'>
    readonly YEAR: FieldRef<"PaymentRecord", 'Int'>
    readonly TOTAL_DUE: FieldRef<"PaymentRecord", 'Float'>
    readonly PAID: FieldRef<"PaymentRecord", 'Float'>
    readonly BALANCE: FieldRef<"PaymentRecord", 'Float'>
    readonly STATUS: FieldRef<"PaymentRecord", 'String'>
    readonly REMARKS: FieldRef<"PaymentRecord", 'String'>
    readonly OR_NO: FieldRef<"PaymentRecord", 'String'>
    readonly DATE_PAID: FieldRef<"PaymentRecord", 'String'>
    readonly METHOD: FieldRef<"PaymentRecord", 'String'>
    readonly DUE_DATE: FieldRef<"PaymentRecord", 'String'>
    readonly deceasedRecordId: FieldRef<"PaymentRecord", 'String'>
    readonly isArchived: FieldRef<"PaymentRecord", 'Boolean'>
    readonly archivedAt: FieldRef<"PaymentRecord", 'DateTime'>
    readonly archiveReason: FieldRef<"PaymentRecord", 'String'>
    readonly createdAt: FieldRef<"PaymentRecord", 'DateTime'>
    readonly updatedAt: FieldRef<"PaymentRecord", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PaymentRecord findUnique
   */
  export type PaymentRecordFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentRecord
     */
    select?: PaymentRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentRecordInclude<ExtArgs> | null
    /**
     * Filter, which PaymentRecord to fetch.
     */
    where: PaymentRecordWhereUniqueInput
  }

  /**
   * PaymentRecord findUniqueOrThrow
   */
  export type PaymentRecordFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentRecord
     */
    select?: PaymentRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentRecordInclude<ExtArgs> | null
    /**
     * Filter, which PaymentRecord to fetch.
     */
    where: PaymentRecordWhereUniqueInput
  }

  /**
   * PaymentRecord findFirst
   */
  export type PaymentRecordFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentRecord
     */
    select?: PaymentRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentRecordInclude<ExtArgs> | null
    /**
     * Filter, which PaymentRecord to fetch.
     */
    where?: PaymentRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PaymentRecords to fetch.
     */
    orderBy?: PaymentRecordOrderByWithRelationInput | PaymentRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PaymentRecords.
     */
    cursor?: PaymentRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PaymentRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PaymentRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PaymentRecords.
     */
    distinct?: PaymentRecordScalarFieldEnum | PaymentRecordScalarFieldEnum[]
  }

  /**
   * PaymentRecord findFirstOrThrow
   */
  export type PaymentRecordFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentRecord
     */
    select?: PaymentRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentRecordInclude<ExtArgs> | null
    /**
     * Filter, which PaymentRecord to fetch.
     */
    where?: PaymentRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PaymentRecords to fetch.
     */
    orderBy?: PaymentRecordOrderByWithRelationInput | PaymentRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PaymentRecords.
     */
    cursor?: PaymentRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PaymentRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PaymentRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PaymentRecords.
     */
    distinct?: PaymentRecordScalarFieldEnum | PaymentRecordScalarFieldEnum[]
  }

  /**
   * PaymentRecord findMany
   */
  export type PaymentRecordFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentRecord
     */
    select?: PaymentRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentRecordInclude<ExtArgs> | null
    /**
     * Filter, which PaymentRecords to fetch.
     */
    where?: PaymentRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PaymentRecords to fetch.
     */
    orderBy?: PaymentRecordOrderByWithRelationInput | PaymentRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PaymentRecords.
     */
    cursor?: PaymentRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PaymentRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PaymentRecords.
     */
    skip?: number
    distinct?: PaymentRecordScalarFieldEnum | PaymentRecordScalarFieldEnum[]
  }

  /**
   * PaymentRecord create
   */
  export type PaymentRecordCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentRecord
     */
    select?: PaymentRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentRecordInclude<ExtArgs> | null
    /**
     * The data needed to create a PaymentRecord.
     */
    data: XOR<PaymentRecordCreateInput, PaymentRecordUncheckedCreateInput>
  }

  /**
   * PaymentRecord createMany
   */
  export type PaymentRecordCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PaymentRecords.
     */
    data: PaymentRecordCreateManyInput | PaymentRecordCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PaymentRecord createManyAndReturn
   */
  export type PaymentRecordCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentRecord
     */
    select?: PaymentRecordSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many PaymentRecords.
     */
    data: PaymentRecordCreateManyInput | PaymentRecordCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentRecordIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * PaymentRecord update
   */
  export type PaymentRecordUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentRecord
     */
    select?: PaymentRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentRecordInclude<ExtArgs> | null
    /**
     * The data needed to update a PaymentRecord.
     */
    data: XOR<PaymentRecordUpdateInput, PaymentRecordUncheckedUpdateInput>
    /**
     * Choose, which PaymentRecord to update.
     */
    where: PaymentRecordWhereUniqueInput
  }

  /**
   * PaymentRecord updateMany
   */
  export type PaymentRecordUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PaymentRecords.
     */
    data: XOR<PaymentRecordUpdateManyMutationInput, PaymentRecordUncheckedUpdateManyInput>
    /**
     * Filter which PaymentRecords to update
     */
    where?: PaymentRecordWhereInput
  }

  /**
   * PaymentRecord upsert
   */
  export type PaymentRecordUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentRecord
     */
    select?: PaymentRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentRecordInclude<ExtArgs> | null
    /**
     * The filter to search for the PaymentRecord to update in case it exists.
     */
    where: PaymentRecordWhereUniqueInput
    /**
     * In case the PaymentRecord found by the `where` argument doesn't exist, create a new PaymentRecord with this data.
     */
    create: XOR<PaymentRecordCreateInput, PaymentRecordUncheckedCreateInput>
    /**
     * In case the PaymentRecord was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PaymentRecordUpdateInput, PaymentRecordUncheckedUpdateInput>
  }

  /**
   * PaymentRecord delete
   */
  export type PaymentRecordDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentRecord
     */
    select?: PaymentRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentRecordInclude<ExtArgs> | null
    /**
     * Filter which PaymentRecord to delete.
     */
    where: PaymentRecordWhereUniqueInput
  }

  /**
   * PaymentRecord deleteMany
   */
  export type PaymentRecordDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PaymentRecords to delete
     */
    where?: PaymentRecordWhereInput
  }

  /**
   * PaymentRecord.deceasedRecord
   */
  export type PaymentRecord$deceasedRecordArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeceasedRecord
     */
    select?: DeceasedRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeceasedRecordInclude<ExtArgs> | null
    where?: DeceasedRecordWhereInput
  }

  /**
   * PaymentRecord without action
   */
  export type PaymentRecordDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentRecord
     */
    select?: PaymentRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentRecordInclude<ExtArgs> | null
  }


  /**
   * Model Inquiries
   */

  export type AggregateInquiries = {
    _count: InquiriesCountAggregateOutputType | null
    _avg: InquiriesAvgAggregateOutputType | null
    _sum: InquiriesSumAggregateOutputType | null
    _min: InquiriesMinAggregateOutputType | null
    _max: InquiriesMaxAggregateOutputType | null
  }

  export type InquiriesAvgAggregateOutputType = {
    id: number | null
  }

  export type InquiriesSumAggregateOutputType = {
    id: number | null
  }

  export type InquiriesMinAggregateOutputType = {
    id: number | null
    APP_ID: string | null
    FAMILY_NAME: string | null
    DECEASED: string | null
    REQUESTED_PLOT: string | null
    BURIAL_DATE: Date | null
    TIME: string | null
    CONTACT: string | null
    STATUS: string | null
    email: string | null
    emailVerified: boolean | null
    emailVerifiedAt: Date | null
    relationship: string | null
    address: string | null
    reason: string | null
    notes: string | null
    remarks: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type InquiriesMaxAggregateOutputType = {
    id: number | null
    APP_ID: string | null
    FAMILY_NAME: string | null
    DECEASED: string | null
    REQUESTED_PLOT: string | null
    BURIAL_DATE: Date | null
    TIME: string | null
    CONTACT: string | null
    STATUS: string | null
    email: string | null
    emailVerified: boolean | null
    emailVerifiedAt: Date | null
    relationship: string | null
    address: string | null
    reason: string | null
    notes: string | null
    remarks: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type InquiriesCountAggregateOutputType = {
    id: number
    APP_ID: number
    FAMILY_NAME: number
    DECEASED: number
    REQUESTED_PLOT: number
    BURIAL_DATE: number
    TIME: number
    CONTACT: number
    STATUS: number
    email: number
    emailVerified: number
    emailVerifiedAt: number
    relationship: number
    address: number
    reason: number
    notes: number
    remarks: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type InquiriesAvgAggregateInputType = {
    id?: true
  }

  export type InquiriesSumAggregateInputType = {
    id?: true
  }

  export type InquiriesMinAggregateInputType = {
    id?: true
    APP_ID?: true
    FAMILY_NAME?: true
    DECEASED?: true
    REQUESTED_PLOT?: true
    BURIAL_DATE?: true
    TIME?: true
    CONTACT?: true
    STATUS?: true
    email?: true
    emailVerified?: true
    emailVerifiedAt?: true
    relationship?: true
    address?: true
    reason?: true
    notes?: true
    remarks?: true
    createdAt?: true
    updatedAt?: true
  }

  export type InquiriesMaxAggregateInputType = {
    id?: true
    APP_ID?: true
    FAMILY_NAME?: true
    DECEASED?: true
    REQUESTED_PLOT?: true
    BURIAL_DATE?: true
    TIME?: true
    CONTACT?: true
    STATUS?: true
    email?: true
    emailVerified?: true
    emailVerifiedAt?: true
    relationship?: true
    address?: true
    reason?: true
    notes?: true
    remarks?: true
    createdAt?: true
    updatedAt?: true
  }

  export type InquiriesCountAggregateInputType = {
    id?: true
    APP_ID?: true
    FAMILY_NAME?: true
    DECEASED?: true
    REQUESTED_PLOT?: true
    BURIAL_DATE?: true
    TIME?: true
    CONTACT?: true
    STATUS?: true
    email?: true
    emailVerified?: true
    emailVerifiedAt?: true
    relationship?: true
    address?: true
    reason?: true
    notes?: true
    remarks?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type InquiriesAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Inquiries to aggregate.
     */
    where?: InquiriesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Inquiries to fetch.
     */
    orderBy?: InquiriesOrderByWithRelationInput | InquiriesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: InquiriesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Inquiries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Inquiries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Inquiries
    **/
    _count?: true | InquiriesCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: InquiriesAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: InquiriesSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: InquiriesMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: InquiriesMaxAggregateInputType
  }

  export type GetInquiriesAggregateType<T extends InquiriesAggregateArgs> = {
        [P in keyof T & keyof AggregateInquiries]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateInquiries[P]>
      : GetScalarType<T[P], AggregateInquiries[P]>
  }




  export type InquiriesGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InquiriesWhereInput
    orderBy?: InquiriesOrderByWithAggregationInput | InquiriesOrderByWithAggregationInput[]
    by: InquiriesScalarFieldEnum[] | InquiriesScalarFieldEnum
    having?: InquiriesScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: InquiriesCountAggregateInputType | true
    _avg?: InquiriesAvgAggregateInputType
    _sum?: InquiriesSumAggregateInputType
    _min?: InquiriesMinAggregateInputType
    _max?: InquiriesMaxAggregateInputType
  }

  export type InquiriesGroupByOutputType = {
    id: number
    APP_ID: string
    FAMILY_NAME: string
    DECEASED: string | null
    REQUESTED_PLOT: string | null
    BURIAL_DATE: Date | null
    TIME: string | null
    CONTACT: string
    STATUS: string
    email: string
    emailVerified: boolean
    emailVerifiedAt: Date | null
    relationship: string
    address: string | null
    reason: string
    notes: string | null
    remarks: string | null
    createdAt: Date
    updatedAt: Date
    _count: InquiriesCountAggregateOutputType | null
    _avg: InquiriesAvgAggregateOutputType | null
    _sum: InquiriesSumAggregateOutputType | null
    _min: InquiriesMinAggregateOutputType | null
    _max: InquiriesMaxAggregateOutputType | null
  }

  type GetInquiriesGroupByPayload<T extends InquiriesGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<InquiriesGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof InquiriesGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], InquiriesGroupByOutputType[P]>
            : GetScalarType<T[P], InquiriesGroupByOutputType[P]>
        }
      >
    >


  export type InquiriesSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    APP_ID?: boolean
    FAMILY_NAME?: boolean
    DECEASED?: boolean
    REQUESTED_PLOT?: boolean
    BURIAL_DATE?: boolean
    TIME?: boolean
    CONTACT?: boolean
    STATUS?: boolean
    email?: boolean
    emailVerified?: boolean
    emailVerifiedAt?: boolean
    relationship?: boolean
    address?: boolean
    reason?: boolean
    notes?: boolean
    remarks?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    emailLogs?: boolean | Inquiries$emailLogsArgs<ExtArgs>
    _count?: boolean | InquiriesCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["inquiries"]>

  export type InquiriesSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    APP_ID?: boolean
    FAMILY_NAME?: boolean
    DECEASED?: boolean
    REQUESTED_PLOT?: boolean
    BURIAL_DATE?: boolean
    TIME?: boolean
    CONTACT?: boolean
    STATUS?: boolean
    email?: boolean
    emailVerified?: boolean
    emailVerifiedAt?: boolean
    relationship?: boolean
    address?: boolean
    reason?: boolean
    notes?: boolean
    remarks?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["inquiries"]>

  export type InquiriesSelectScalar = {
    id?: boolean
    APP_ID?: boolean
    FAMILY_NAME?: boolean
    DECEASED?: boolean
    REQUESTED_PLOT?: boolean
    BURIAL_DATE?: boolean
    TIME?: boolean
    CONTACT?: boolean
    STATUS?: boolean
    email?: boolean
    emailVerified?: boolean
    emailVerifiedAt?: boolean
    relationship?: boolean
    address?: boolean
    reason?: boolean
    notes?: boolean
    remarks?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type InquiriesInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    emailLogs?: boolean | Inquiries$emailLogsArgs<ExtArgs>
    _count?: boolean | InquiriesCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type InquiriesIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $InquiriesPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Inquiries"
    objects: {
      emailLogs: Prisma.$EmailNotificationLogPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      APP_ID: string
      FAMILY_NAME: string
      DECEASED: string | null
      REQUESTED_PLOT: string | null
      BURIAL_DATE: Date | null
      TIME: string | null
      CONTACT: string
      STATUS: string
      email: string
      emailVerified: boolean
      emailVerifiedAt: Date | null
      relationship: string
      address: string | null
      reason: string
      notes: string | null
      remarks: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["inquiries"]>
    composites: {}
  }

  type InquiriesGetPayload<S extends boolean | null | undefined | InquiriesDefaultArgs> = $Result.GetResult<Prisma.$InquiriesPayload, S>

  type InquiriesCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<InquiriesFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: InquiriesCountAggregateInputType | true
    }

  export interface InquiriesDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Inquiries'], meta: { name: 'Inquiries' } }
    /**
     * Find zero or one Inquiries that matches the filter.
     * @param {InquiriesFindUniqueArgs} args - Arguments to find a Inquiries
     * @example
     * // Get one Inquiries
     * const inquiries = await prisma.inquiries.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends InquiriesFindUniqueArgs>(args: SelectSubset<T, InquiriesFindUniqueArgs<ExtArgs>>): Prisma__InquiriesClient<$Result.GetResult<Prisma.$InquiriesPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Inquiries that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {InquiriesFindUniqueOrThrowArgs} args - Arguments to find a Inquiries
     * @example
     * // Get one Inquiries
     * const inquiries = await prisma.inquiries.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends InquiriesFindUniqueOrThrowArgs>(args: SelectSubset<T, InquiriesFindUniqueOrThrowArgs<ExtArgs>>): Prisma__InquiriesClient<$Result.GetResult<Prisma.$InquiriesPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Inquiries that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InquiriesFindFirstArgs} args - Arguments to find a Inquiries
     * @example
     * // Get one Inquiries
     * const inquiries = await prisma.inquiries.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends InquiriesFindFirstArgs>(args?: SelectSubset<T, InquiriesFindFirstArgs<ExtArgs>>): Prisma__InquiriesClient<$Result.GetResult<Prisma.$InquiriesPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Inquiries that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InquiriesFindFirstOrThrowArgs} args - Arguments to find a Inquiries
     * @example
     * // Get one Inquiries
     * const inquiries = await prisma.inquiries.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends InquiriesFindFirstOrThrowArgs>(args?: SelectSubset<T, InquiriesFindFirstOrThrowArgs<ExtArgs>>): Prisma__InquiriesClient<$Result.GetResult<Prisma.$InquiriesPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Inquiries that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InquiriesFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Inquiries
     * const inquiries = await prisma.inquiries.findMany()
     * 
     * // Get first 10 Inquiries
     * const inquiries = await prisma.inquiries.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const inquiriesWithIdOnly = await prisma.inquiries.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends InquiriesFindManyArgs>(args?: SelectSubset<T, InquiriesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InquiriesPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Inquiries.
     * @param {InquiriesCreateArgs} args - Arguments to create a Inquiries.
     * @example
     * // Create one Inquiries
     * const Inquiries = await prisma.inquiries.create({
     *   data: {
     *     // ... data to create a Inquiries
     *   }
     * })
     * 
     */
    create<T extends InquiriesCreateArgs>(args: SelectSubset<T, InquiriesCreateArgs<ExtArgs>>): Prisma__InquiriesClient<$Result.GetResult<Prisma.$InquiriesPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Inquiries.
     * @param {InquiriesCreateManyArgs} args - Arguments to create many Inquiries.
     * @example
     * // Create many Inquiries
     * const inquiries = await prisma.inquiries.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends InquiriesCreateManyArgs>(args?: SelectSubset<T, InquiriesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Inquiries and returns the data saved in the database.
     * @param {InquiriesCreateManyAndReturnArgs} args - Arguments to create many Inquiries.
     * @example
     * // Create many Inquiries
     * const inquiries = await prisma.inquiries.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Inquiries and only return the `id`
     * const inquiriesWithIdOnly = await prisma.inquiries.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends InquiriesCreateManyAndReturnArgs>(args?: SelectSubset<T, InquiriesCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InquiriesPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Inquiries.
     * @param {InquiriesDeleteArgs} args - Arguments to delete one Inquiries.
     * @example
     * // Delete one Inquiries
     * const Inquiries = await prisma.inquiries.delete({
     *   where: {
     *     // ... filter to delete one Inquiries
     *   }
     * })
     * 
     */
    delete<T extends InquiriesDeleteArgs>(args: SelectSubset<T, InquiriesDeleteArgs<ExtArgs>>): Prisma__InquiriesClient<$Result.GetResult<Prisma.$InquiriesPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Inquiries.
     * @param {InquiriesUpdateArgs} args - Arguments to update one Inquiries.
     * @example
     * // Update one Inquiries
     * const inquiries = await prisma.inquiries.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends InquiriesUpdateArgs>(args: SelectSubset<T, InquiriesUpdateArgs<ExtArgs>>): Prisma__InquiriesClient<$Result.GetResult<Prisma.$InquiriesPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Inquiries.
     * @param {InquiriesDeleteManyArgs} args - Arguments to filter Inquiries to delete.
     * @example
     * // Delete a few Inquiries
     * const { count } = await prisma.inquiries.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends InquiriesDeleteManyArgs>(args?: SelectSubset<T, InquiriesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Inquiries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InquiriesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Inquiries
     * const inquiries = await prisma.inquiries.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends InquiriesUpdateManyArgs>(args: SelectSubset<T, InquiriesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Inquiries.
     * @param {InquiriesUpsertArgs} args - Arguments to update or create a Inquiries.
     * @example
     * // Update or create a Inquiries
     * const inquiries = await prisma.inquiries.upsert({
     *   create: {
     *     // ... data to create a Inquiries
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Inquiries we want to update
     *   }
     * })
     */
    upsert<T extends InquiriesUpsertArgs>(args: SelectSubset<T, InquiriesUpsertArgs<ExtArgs>>): Prisma__InquiriesClient<$Result.GetResult<Prisma.$InquiriesPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Inquiries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InquiriesCountArgs} args - Arguments to filter Inquiries to count.
     * @example
     * // Count the number of Inquiries
     * const count = await prisma.inquiries.count({
     *   where: {
     *     // ... the filter for the Inquiries we want to count
     *   }
     * })
    **/
    count<T extends InquiriesCountArgs>(
      args?: Subset<T, InquiriesCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], InquiriesCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Inquiries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InquiriesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends InquiriesAggregateArgs>(args: Subset<T, InquiriesAggregateArgs>): Prisma.PrismaPromise<GetInquiriesAggregateType<T>>

    /**
     * Group by Inquiries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InquiriesGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends InquiriesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: InquiriesGroupByArgs['orderBy'] }
        : { orderBy?: InquiriesGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, InquiriesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetInquiriesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Inquiries model
   */
  readonly fields: InquiriesFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Inquiries.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__InquiriesClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    emailLogs<T extends Inquiries$emailLogsArgs<ExtArgs> = {}>(args?: Subset<T, Inquiries$emailLogsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EmailNotificationLogPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Inquiries model
   */ 
  interface InquiriesFieldRefs {
    readonly id: FieldRef<"Inquiries", 'Int'>
    readonly APP_ID: FieldRef<"Inquiries", 'String'>
    readonly FAMILY_NAME: FieldRef<"Inquiries", 'String'>
    readonly DECEASED: FieldRef<"Inquiries", 'String'>
    readonly REQUESTED_PLOT: FieldRef<"Inquiries", 'String'>
    readonly BURIAL_DATE: FieldRef<"Inquiries", 'DateTime'>
    readonly TIME: FieldRef<"Inquiries", 'String'>
    readonly CONTACT: FieldRef<"Inquiries", 'String'>
    readonly STATUS: FieldRef<"Inquiries", 'String'>
    readonly email: FieldRef<"Inquiries", 'String'>
    readonly emailVerified: FieldRef<"Inquiries", 'Boolean'>
    readonly emailVerifiedAt: FieldRef<"Inquiries", 'DateTime'>
    readonly relationship: FieldRef<"Inquiries", 'String'>
    readonly address: FieldRef<"Inquiries", 'String'>
    readonly reason: FieldRef<"Inquiries", 'String'>
    readonly notes: FieldRef<"Inquiries", 'String'>
    readonly remarks: FieldRef<"Inquiries", 'String'>
    readonly createdAt: FieldRef<"Inquiries", 'DateTime'>
    readonly updatedAt: FieldRef<"Inquiries", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Inquiries findUnique
   */
  export type InquiriesFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inquiries
     */
    select?: InquiriesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InquiriesInclude<ExtArgs> | null
    /**
     * Filter, which Inquiries to fetch.
     */
    where: InquiriesWhereUniqueInput
  }

  /**
   * Inquiries findUniqueOrThrow
   */
  export type InquiriesFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inquiries
     */
    select?: InquiriesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InquiriesInclude<ExtArgs> | null
    /**
     * Filter, which Inquiries to fetch.
     */
    where: InquiriesWhereUniqueInput
  }

  /**
   * Inquiries findFirst
   */
  export type InquiriesFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inquiries
     */
    select?: InquiriesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InquiriesInclude<ExtArgs> | null
    /**
     * Filter, which Inquiries to fetch.
     */
    where?: InquiriesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Inquiries to fetch.
     */
    orderBy?: InquiriesOrderByWithRelationInput | InquiriesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Inquiries.
     */
    cursor?: InquiriesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Inquiries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Inquiries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Inquiries.
     */
    distinct?: InquiriesScalarFieldEnum | InquiriesScalarFieldEnum[]
  }

  /**
   * Inquiries findFirstOrThrow
   */
  export type InquiriesFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inquiries
     */
    select?: InquiriesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InquiriesInclude<ExtArgs> | null
    /**
     * Filter, which Inquiries to fetch.
     */
    where?: InquiriesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Inquiries to fetch.
     */
    orderBy?: InquiriesOrderByWithRelationInput | InquiriesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Inquiries.
     */
    cursor?: InquiriesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Inquiries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Inquiries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Inquiries.
     */
    distinct?: InquiriesScalarFieldEnum | InquiriesScalarFieldEnum[]
  }

  /**
   * Inquiries findMany
   */
  export type InquiriesFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inquiries
     */
    select?: InquiriesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InquiriesInclude<ExtArgs> | null
    /**
     * Filter, which Inquiries to fetch.
     */
    where?: InquiriesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Inquiries to fetch.
     */
    orderBy?: InquiriesOrderByWithRelationInput | InquiriesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Inquiries.
     */
    cursor?: InquiriesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Inquiries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Inquiries.
     */
    skip?: number
    distinct?: InquiriesScalarFieldEnum | InquiriesScalarFieldEnum[]
  }

  /**
   * Inquiries create
   */
  export type InquiriesCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inquiries
     */
    select?: InquiriesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InquiriesInclude<ExtArgs> | null
    /**
     * The data needed to create a Inquiries.
     */
    data: XOR<InquiriesCreateInput, InquiriesUncheckedCreateInput>
  }

  /**
   * Inquiries createMany
   */
  export type InquiriesCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Inquiries.
     */
    data: InquiriesCreateManyInput | InquiriesCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Inquiries createManyAndReturn
   */
  export type InquiriesCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inquiries
     */
    select?: InquiriesSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Inquiries.
     */
    data: InquiriesCreateManyInput | InquiriesCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Inquiries update
   */
  export type InquiriesUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inquiries
     */
    select?: InquiriesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InquiriesInclude<ExtArgs> | null
    /**
     * The data needed to update a Inquiries.
     */
    data: XOR<InquiriesUpdateInput, InquiriesUncheckedUpdateInput>
    /**
     * Choose, which Inquiries to update.
     */
    where: InquiriesWhereUniqueInput
  }

  /**
   * Inquiries updateMany
   */
  export type InquiriesUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Inquiries.
     */
    data: XOR<InquiriesUpdateManyMutationInput, InquiriesUncheckedUpdateManyInput>
    /**
     * Filter which Inquiries to update
     */
    where?: InquiriesWhereInput
  }

  /**
   * Inquiries upsert
   */
  export type InquiriesUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inquiries
     */
    select?: InquiriesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InquiriesInclude<ExtArgs> | null
    /**
     * The filter to search for the Inquiries to update in case it exists.
     */
    where: InquiriesWhereUniqueInput
    /**
     * In case the Inquiries found by the `where` argument doesn't exist, create a new Inquiries with this data.
     */
    create: XOR<InquiriesCreateInput, InquiriesUncheckedCreateInput>
    /**
     * In case the Inquiries was found with the provided `where` argument, update it with this data.
     */
    update: XOR<InquiriesUpdateInput, InquiriesUncheckedUpdateInput>
  }

  /**
   * Inquiries delete
   */
  export type InquiriesDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inquiries
     */
    select?: InquiriesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InquiriesInclude<ExtArgs> | null
    /**
     * Filter which Inquiries to delete.
     */
    where: InquiriesWhereUniqueInput
  }

  /**
   * Inquiries deleteMany
   */
  export type InquiriesDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Inquiries to delete
     */
    where?: InquiriesWhereInput
  }

  /**
   * Inquiries.emailLogs
   */
  export type Inquiries$emailLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailNotificationLog
     */
    select?: EmailNotificationLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmailNotificationLogInclude<ExtArgs> | null
    where?: EmailNotificationLogWhereInput
    orderBy?: EmailNotificationLogOrderByWithRelationInput | EmailNotificationLogOrderByWithRelationInput[]
    cursor?: EmailNotificationLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: EmailNotificationLogScalarFieldEnum | EmailNotificationLogScalarFieldEnum[]
  }

  /**
   * Inquiries without action
   */
  export type InquiriesDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inquiries
     */
    select?: InquiriesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InquiriesInclude<ExtArgs> | null
  }


  /**
   * Model Announcement
   */

  export type AggregateAnnouncement = {
    _count: AnnouncementCountAggregateOutputType | null
    _avg: AnnouncementAvgAggregateOutputType | null
    _sum: AnnouncementSumAggregateOutputType | null
    _min: AnnouncementMinAggregateOutputType | null
    _max: AnnouncementMaxAggregateOutputType | null
  }

  export type AnnouncementAvgAggregateOutputType = {
    id: number | null
    views: number | null
  }

  export type AnnouncementSumAggregateOutputType = {
    id: number | null
    views: number | null
  }

  export type AnnouncementMinAggregateOutputType = {
    id: number | null
    title: string | null
    content: string | null
    category: string | null
    badge: string | null
    visibility: string | null
    status: string | null
    date: Date | null
    validFrom: string | null
    validUntil: string | null
    views: number | null
  }

  export type AnnouncementMaxAggregateOutputType = {
    id: number | null
    title: string | null
    content: string | null
    category: string | null
    badge: string | null
    visibility: string | null
    status: string | null
    date: Date | null
    validFrom: string | null
    validUntil: string | null
    views: number | null
  }

  export type AnnouncementCountAggregateOutputType = {
    id: number
    title: number
    content: number
    category: number
    badge: number
    visibility: number
    status: number
    date: number
    validFrom: number
    validUntil: number
    views: number
    _all: number
  }


  export type AnnouncementAvgAggregateInputType = {
    id?: true
    views?: true
  }

  export type AnnouncementSumAggregateInputType = {
    id?: true
    views?: true
  }

  export type AnnouncementMinAggregateInputType = {
    id?: true
    title?: true
    content?: true
    category?: true
    badge?: true
    visibility?: true
    status?: true
    date?: true
    validFrom?: true
    validUntil?: true
    views?: true
  }

  export type AnnouncementMaxAggregateInputType = {
    id?: true
    title?: true
    content?: true
    category?: true
    badge?: true
    visibility?: true
    status?: true
    date?: true
    validFrom?: true
    validUntil?: true
    views?: true
  }

  export type AnnouncementCountAggregateInputType = {
    id?: true
    title?: true
    content?: true
    category?: true
    badge?: true
    visibility?: true
    status?: true
    date?: true
    validFrom?: true
    validUntil?: true
    views?: true
    _all?: true
  }

  export type AnnouncementAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Announcement to aggregate.
     */
    where?: AnnouncementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Announcements to fetch.
     */
    orderBy?: AnnouncementOrderByWithRelationInput | AnnouncementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AnnouncementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Announcements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Announcements.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Announcements
    **/
    _count?: true | AnnouncementCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AnnouncementAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AnnouncementSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AnnouncementMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AnnouncementMaxAggregateInputType
  }

  export type GetAnnouncementAggregateType<T extends AnnouncementAggregateArgs> = {
        [P in keyof T & keyof AggregateAnnouncement]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAnnouncement[P]>
      : GetScalarType<T[P], AggregateAnnouncement[P]>
  }




  export type AnnouncementGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AnnouncementWhereInput
    orderBy?: AnnouncementOrderByWithAggregationInput | AnnouncementOrderByWithAggregationInput[]
    by: AnnouncementScalarFieldEnum[] | AnnouncementScalarFieldEnum
    having?: AnnouncementScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AnnouncementCountAggregateInputType | true
    _avg?: AnnouncementAvgAggregateInputType
    _sum?: AnnouncementSumAggregateInputType
    _min?: AnnouncementMinAggregateInputType
    _max?: AnnouncementMaxAggregateInputType
  }

  export type AnnouncementGroupByOutputType = {
    id: number
    title: string
    content: string
    category: string
    badge: string | null
    visibility: string
    status: string
    date: Date
    validFrom: string | null
    validUntil: string | null
    views: number
    _count: AnnouncementCountAggregateOutputType | null
    _avg: AnnouncementAvgAggregateOutputType | null
    _sum: AnnouncementSumAggregateOutputType | null
    _min: AnnouncementMinAggregateOutputType | null
    _max: AnnouncementMaxAggregateOutputType | null
  }

  type GetAnnouncementGroupByPayload<T extends AnnouncementGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AnnouncementGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AnnouncementGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AnnouncementGroupByOutputType[P]>
            : GetScalarType<T[P], AnnouncementGroupByOutputType[P]>
        }
      >
    >


  export type AnnouncementSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    content?: boolean
    category?: boolean
    badge?: boolean
    visibility?: boolean
    status?: boolean
    date?: boolean
    validFrom?: boolean
    validUntil?: boolean
    views?: boolean
  }, ExtArgs["result"]["announcement"]>

  export type AnnouncementSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    content?: boolean
    category?: boolean
    badge?: boolean
    visibility?: boolean
    status?: boolean
    date?: boolean
    validFrom?: boolean
    validUntil?: boolean
    views?: boolean
  }, ExtArgs["result"]["announcement"]>

  export type AnnouncementSelectScalar = {
    id?: boolean
    title?: boolean
    content?: boolean
    category?: boolean
    badge?: boolean
    visibility?: boolean
    status?: boolean
    date?: boolean
    validFrom?: boolean
    validUntil?: boolean
    views?: boolean
  }


  export type $AnnouncementPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Announcement"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      title: string
      content: string
      category: string
      badge: string | null
      visibility: string
      status: string
      date: Date
      validFrom: string | null
      validUntil: string | null
      views: number
    }, ExtArgs["result"]["announcement"]>
    composites: {}
  }

  type AnnouncementGetPayload<S extends boolean | null | undefined | AnnouncementDefaultArgs> = $Result.GetResult<Prisma.$AnnouncementPayload, S>

  type AnnouncementCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AnnouncementFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AnnouncementCountAggregateInputType | true
    }

  export interface AnnouncementDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Announcement'], meta: { name: 'Announcement' } }
    /**
     * Find zero or one Announcement that matches the filter.
     * @param {AnnouncementFindUniqueArgs} args - Arguments to find a Announcement
     * @example
     * // Get one Announcement
     * const announcement = await prisma.announcement.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AnnouncementFindUniqueArgs>(args: SelectSubset<T, AnnouncementFindUniqueArgs<ExtArgs>>): Prisma__AnnouncementClient<$Result.GetResult<Prisma.$AnnouncementPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Announcement that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {AnnouncementFindUniqueOrThrowArgs} args - Arguments to find a Announcement
     * @example
     * // Get one Announcement
     * const announcement = await prisma.announcement.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AnnouncementFindUniqueOrThrowArgs>(args: SelectSubset<T, AnnouncementFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AnnouncementClient<$Result.GetResult<Prisma.$AnnouncementPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Announcement that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnnouncementFindFirstArgs} args - Arguments to find a Announcement
     * @example
     * // Get one Announcement
     * const announcement = await prisma.announcement.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AnnouncementFindFirstArgs>(args?: SelectSubset<T, AnnouncementFindFirstArgs<ExtArgs>>): Prisma__AnnouncementClient<$Result.GetResult<Prisma.$AnnouncementPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Announcement that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnnouncementFindFirstOrThrowArgs} args - Arguments to find a Announcement
     * @example
     * // Get one Announcement
     * const announcement = await prisma.announcement.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AnnouncementFindFirstOrThrowArgs>(args?: SelectSubset<T, AnnouncementFindFirstOrThrowArgs<ExtArgs>>): Prisma__AnnouncementClient<$Result.GetResult<Prisma.$AnnouncementPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Announcements that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnnouncementFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Announcements
     * const announcements = await prisma.announcement.findMany()
     * 
     * // Get first 10 Announcements
     * const announcements = await prisma.announcement.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const announcementWithIdOnly = await prisma.announcement.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AnnouncementFindManyArgs>(args?: SelectSubset<T, AnnouncementFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnnouncementPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Announcement.
     * @param {AnnouncementCreateArgs} args - Arguments to create a Announcement.
     * @example
     * // Create one Announcement
     * const Announcement = await prisma.announcement.create({
     *   data: {
     *     // ... data to create a Announcement
     *   }
     * })
     * 
     */
    create<T extends AnnouncementCreateArgs>(args: SelectSubset<T, AnnouncementCreateArgs<ExtArgs>>): Prisma__AnnouncementClient<$Result.GetResult<Prisma.$AnnouncementPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Announcements.
     * @param {AnnouncementCreateManyArgs} args - Arguments to create many Announcements.
     * @example
     * // Create many Announcements
     * const announcement = await prisma.announcement.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AnnouncementCreateManyArgs>(args?: SelectSubset<T, AnnouncementCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Announcements and returns the data saved in the database.
     * @param {AnnouncementCreateManyAndReturnArgs} args - Arguments to create many Announcements.
     * @example
     * // Create many Announcements
     * const announcement = await prisma.announcement.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Announcements and only return the `id`
     * const announcementWithIdOnly = await prisma.announcement.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AnnouncementCreateManyAndReturnArgs>(args?: SelectSubset<T, AnnouncementCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnnouncementPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Announcement.
     * @param {AnnouncementDeleteArgs} args - Arguments to delete one Announcement.
     * @example
     * // Delete one Announcement
     * const Announcement = await prisma.announcement.delete({
     *   where: {
     *     // ... filter to delete one Announcement
     *   }
     * })
     * 
     */
    delete<T extends AnnouncementDeleteArgs>(args: SelectSubset<T, AnnouncementDeleteArgs<ExtArgs>>): Prisma__AnnouncementClient<$Result.GetResult<Prisma.$AnnouncementPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Announcement.
     * @param {AnnouncementUpdateArgs} args - Arguments to update one Announcement.
     * @example
     * // Update one Announcement
     * const announcement = await prisma.announcement.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AnnouncementUpdateArgs>(args: SelectSubset<T, AnnouncementUpdateArgs<ExtArgs>>): Prisma__AnnouncementClient<$Result.GetResult<Prisma.$AnnouncementPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Announcements.
     * @param {AnnouncementDeleteManyArgs} args - Arguments to filter Announcements to delete.
     * @example
     * // Delete a few Announcements
     * const { count } = await prisma.announcement.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AnnouncementDeleteManyArgs>(args?: SelectSubset<T, AnnouncementDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Announcements.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnnouncementUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Announcements
     * const announcement = await prisma.announcement.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AnnouncementUpdateManyArgs>(args: SelectSubset<T, AnnouncementUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Announcement.
     * @param {AnnouncementUpsertArgs} args - Arguments to update or create a Announcement.
     * @example
     * // Update or create a Announcement
     * const announcement = await prisma.announcement.upsert({
     *   create: {
     *     // ... data to create a Announcement
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Announcement we want to update
     *   }
     * })
     */
    upsert<T extends AnnouncementUpsertArgs>(args: SelectSubset<T, AnnouncementUpsertArgs<ExtArgs>>): Prisma__AnnouncementClient<$Result.GetResult<Prisma.$AnnouncementPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Announcements.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnnouncementCountArgs} args - Arguments to filter Announcements to count.
     * @example
     * // Count the number of Announcements
     * const count = await prisma.announcement.count({
     *   where: {
     *     // ... the filter for the Announcements we want to count
     *   }
     * })
    **/
    count<T extends AnnouncementCountArgs>(
      args?: Subset<T, AnnouncementCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AnnouncementCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Announcement.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnnouncementAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AnnouncementAggregateArgs>(args: Subset<T, AnnouncementAggregateArgs>): Prisma.PrismaPromise<GetAnnouncementAggregateType<T>>

    /**
     * Group by Announcement.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnnouncementGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AnnouncementGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AnnouncementGroupByArgs['orderBy'] }
        : { orderBy?: AnnouncementGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AnnouncementGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAnnouncementGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Announcement model
   */
  readonly fields: AnnouncementFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Announcement.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AnnouncementClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Announcement model
   */ 
  interface AnnouncementFieldRefs {
    readonly id: FieldRef<"Announcement", 'Int'>
    readonly title: FieldRef<"Announcement", 'String'>
    readonly content: FieldRef<"Announcement", 'String'>
    readonly category: FieldRef<"Announcement", 'String'>
    readonly badge: FieldRef<"Announcement", 'String'>
    readonly visibility: FieldRef<"Announcement", 'String'>
    readonly status: FieldRef<"Announcement", 'String'>
    readonly date: FieldRef<"Announcement", 'DateTime'>
    readonly validFrom: FieldRef<"Announcement", 'String'>
    readonly validUntil: FieldRef<"Announcement", 'String'>
    readonly views: FieldRef<"Announcement", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * Announcement findUnique
   */
  export type AnnouncementFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Announcement
     */
    select?: AnnouncementSelect<ExtArgs> | null
    /**
     * Filter, which Announcement to fetch.
     */
    where: AnnouncementWhereUniqueInput
  }

  /**
   * Announcement findUniqueOrThrow
   */
  export type AnnouncementFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Announcement
     */
    select?: AnnouncementSelect<ExtArgs> | null
    /**
     * Filter, which Announcement to fetch.
     */
    where: AnnouncementWhereUniqueInput
  }

  /**
   * Announcement findFirst
   */
  export type AnnouncementFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Announcement
     */
    select?: AnnouncementSelect<ExtArgs> | null
    /**
     * Filter, which Announcement to fetch.
     */
    where?: AnnouncementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Announcements to fetch.
     */
    orderBy?: AnnouncementOrderByWithRelationInput | AnnouncementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Announcements.
     */
    cursor?: AnnouncementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Announcements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Announcements.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Announcements.
     */
    distinct?: AnnouncementScalarFieldEnum | AnnouncementScalarFieldEnum[]
  }

  /**
   * Announcement findFirstOrThrow
   */
  export type AnnouncementFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Announcement
     */
    select?: AnnouncementSelect<ExtArgs> | null
    /**
     * Filter, which Announcement to fetch.
     */
    where?: AnnouncementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Announcements to fetch.
     */
    orderBy?: AnnouncementOrderByWithRelationInput | AnnouncementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Announcements.
     */
    cursor?: AnnouncementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Announcements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Announcements.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Announcements.
     */
    distinct?: AnnouncementScalarFieldEnum | AnnouncementScalarFieldEnum[]
  }

  /**
   * Announcement findMany
   */
  export type AnnouncementFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Announcement
     */
    select?: AnnouncementSelect<ExtArgs> | null
    /**
     * Filter, which Announcements to fetch.
     */
    where?: AnnouncementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Announcements to fetch.
     */
    orderBy?: AnnouncementOrderByWithRelationInput | AnnouncementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Announcements.
     */
    cursor?: AnnouncementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Announcements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Announcements.
     */
    skip?: number
    distinct?: AnnouncementScalarFieldEnum | AnnouncementScalarFieldEnum[]
  }

  /**
   * Announcement create
   */
  export type AnnouncementCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Announcement
     */
    select?: AnnouncementSelect<ExtArgs> | null
    /**
     * The data needed to create a Announcement.
     */
    data: XOR<AnnouncementCreateInput, AnnouncementUncheckedCreateInput>
  }

  /**
   * Announcement createMany
   */
  export type AnnouncementCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Announcements.
     */
    data: AnnouncementCreateManyInput | AnnouncementCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Announcement createManyAndReturn
   */
  export type AnnouncementCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Announcement
     */
    select?: AnnouncementSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Announcements.
     */
    data: AnnouncementCreateManyInput | AnnouncementCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Announcement update
   */
  export type AnnouncementUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Announcement
     */
    select?: AnnouncementSelect<ExtArgs> | null
    /**
     * The data needed to update a Announcement.
     */
    data: XOR<AnnouncementUpdateInput, AnnouncementUncheckedUpdateInput>
    /**
     * Choose, which Announcement to update.
     */
    where: AnnouncementWhereUniqueInput
  }

  /**
   * Announcement updateMany
   */
  export type AnnouncementUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Announcements.
     */
    data: XOR<AnnouncementUpdateManyMutationInput, AnnouncementUncheckedUpdateManyInput>
    /**
     * Filter which Announcements to update
     */
    where?: AnnouncementWhereInput
  }

  /**
   * Announcement upsert
   */
  export type AnnouncementUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Announcement
     */
    select?: AnnouncementSelect<ExtArgs> | null
    /**
     * The filter to search for the Announcement to update in case it exists.
     */
    where: AnnouncementWhereUniqueInput
    /**
     * In case the Announcement found by the `where` argument doesn't exist, create a new Announcement with this data.
     */
    create: XOR<AnnouncementCreateInput, AnnouncementUncheckedCreateInput>
    /**
     * In case the Announcement was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AnnouncementUpdateInput, AnnouncementUncheckedUpdateInput>
  }

  /**
   * Announcement delete
   */
  export type AnnouncementDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Announcement
     */
    select?: AnnouncementSelect<ExtArgs> | null
    /**
     * Filter which Announcement to delete.
     */
    where: AnnouncementWhereUniqueInput
  }

  /**
   * Announcement deleteMany
   */
  export type AnnouncementDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Announcements to delete
     */
    where?: AnnouncementWhereInput
  }

  /**
   * Announcement without action
   */
  export type AnnouncementDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Announcement
     */
    select?: AnnouncementSelect<ExtArgs> | null
  }


  /**
   * Model SmsNotification
   */

  export type AggregateSmsNotification = {
    _count: SmsNotificationCountAggregateOutputType | null
    _min: SmsNotificationMinAggregateOutputType | null
    _max: SmsNotificationMaxAggregateOutputType | null
  }

  export type SmsNotificationMinAggregateOutputType = {
    id: string | null
    recipient: string | null
    recipientName: string | null
    message: string | null
    semaphoreId: string | null
    status: string | null
    type: string | null
    senderName: string | null
    sentBy: string | null
    errorMessage: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SmsNotificationMaxAggregateOutputType = {
    id: string | null
    recipient: string | null
    recipientName: string | null
    message: string | null
    semaphoreId: string | null
    status: string | null
    type: string | null
    senderName: string | null
    sentBy: string | null
    errorMessage: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SmsNotificationCountAggregateOutputType = {
    id: number
    recipient: number
    recipientName: number
    message: number
    semaphoreId: number
    status: number
    type: number
    senderName: number
    sentBy: number
    errorMessage: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SmsNotificationMinAggregateInputType = {
    id?: true
    recipient?: true
    recipientName?: true
    message?: true
    semaphoreId?: true
    status?: true
    type?: true
    senderName?: true
    sentBy?: true
    errorMessage?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SmsNotificationMaxAggregateInputType = {
    id?: true
    recipient?: true
    recipientName?: true
    message?: true
    semaphoreId?: true
    status?: true
    type?: true
    senderName?: true
    sentBy?: true
    errorMessage?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SmsNotificationCountAggregateInputType = {
    id?: true
    recipient?: true
    recipientName?: true
    message?: true
    semaphoreId?: true
    status?: true
    type?: true
    senderName?: true
    sentBy?: true
    errorMessage?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SmsNotificationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SmsNotification to aggregate.
     */
    where?: SmsNotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SmsNotifications to fetch.
     */
    orderBy?: SmsNotificationOrderByWithRelationInput | SmsNotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SmsNotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SmsNotifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SmsNotifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SmsNotifications
    **/
    _count?: true | SmsNotificationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SmsNotificationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SmsNotificationMaxAggregateInputType
  }

  export type GetSmsNotificationAggregateType<T extends SmsNotificationAggregateArgs> = {
        [P in keyof T & keyof AggregateSmsNotification]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSmsNotification[P]>
      : GetScalarType<T[P], AggregateSmsNotification[P]>
  }




  export type SmsNotificationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SmsNotificationWhereInput
    orderBy?: SmsNotificationOrderByWithAggregationInput | SmsNotificationOrderByWithAggregationInput[]
    by: SmsNotificationScalarFieldEnum[] | SmsNotificationScalarFieldEnum
    having?: SmsNotificationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SmsNotificationCountAggregateInputType | true
    _min?: SmsNotificationMinAggregateInputType
    _max?: SmsNotificationMaxAggregateInputType
  }

  export type SmsNotificationGroupByOutputType = {
    id: string
    recipient: string
    recipientName: string | null
    message: string
    semaphoreId: string | null
    status: string
    type: string | null
    senderName: string | null
    sentBy: string | null
    errorMessage: string | null
    createdAt: Date
    updatedAt: Date
    _count: SmsNotificationCountAggregateOutputType | null
    _min: SmsNotificationMinAggregateOutputType | null
    _max: SmsNotificationMaxAggregateOutputType | null
  }

  type GetSmsNotificationGroupByPayload<T extends SmsNotificationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SmsNotificationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SmsNotificationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SmsNotificationGroupByOutputType[P]>
            : GetScalarType<T[P], SmsNotificationGroupByOutputType[P]>
        }
      >
    >


  export type SmsNotificationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    recipient?: boolean
    recipientName?: boolean
    message?: boolean
    semaphoreId?: boolean
    status?: boolean
    type?: boolean
    senderName?: boolean
    sentBy?: boolean
    errorMessage?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["smsNotification"]>

  export type SmsNotificationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    recipient?: boolean
    recipientName?: boolean
    message?: boolean
    semaphoreId?: boolean
    status?: boolean
    type?: boolean
    senderName?: boolean
    sentBy?: boolean
    errorMessage?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["smsNotification"]>

  export type SmsNotificationSelectScalar = {
    id?: boolean
    recipient?: boolean
    recipientName?: boolean
    message?: boolean
    semaphoreId?: boolean
    status?: boolean
    type?: boolean
    senderName?: boolean
    sentBy?: boolean
    errorMessage?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }


  export type $SmsNotificationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SmsNotification"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      recipient: string
      recipientName: string | null
      message: string
      semaphoreId: string | null
      status: string
      type: string | null
      senderName: string | null
      sentBy: string | null
      errorMessage: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["smsNotification"]>
    composites: {}
  }

  type SmsNotificationGetPayload<S extends boolean | null | undefined | SmsNotificationDefaultArgs> = $Result.GetResult<Prisma.$SmsNotificationPayload, S>

  type SmsNotificationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<SmsNotificationFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: SmsNotificationCountAggregateInputType | true
    }

  export interface SmsNotificationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SmsNotification'], meta: { name: 'SmsNotification' } }
    /**
     * Find zero or one SmsNotification that matches the filter.
     * @param {SmsNotificationFindUniqueArgs} args - Arguments to find a SmsNotification
     * @example
     * // Get one SmsNotification
     * const smsNotification = await prisma.smsNotification.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SmsNotificationFindUniqueArgs>(args: SelectSubset<T, SmsNotificationFindUniqueArgs<ExtArgs>>): Prisma__SmsNotificationClient<$Result.GetResult<Prisma.$SmsNotificationPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one SmsNotification that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {SmsNotificationFindUniqueOrThrowArgs} args - Arguments to find a SmsNotification
     * @example
     * // Get one SmsNotification
     * const smsNotification = await prisma.smsNotification.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SmsNotificationFindUniqueOrThrowArgs>(args: SelectSubset<T, SmsNotificationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SmsNotificationClient<$Result.GetResult<Prisma.$SmsNotificationPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first SmsNotification that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SmsNotificationFindFirstArgs} args - Arguments to find a SmsNotification
     * @example
     * // Get one SmsNotification
     * const smsNotification = await prisma.smsNotification.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SmsNotificationFindFirstArgs>(args?: SelectSubset<T, SmsNotificationFindFirstArgs<ExtArgs>>): Prisma__SmsNotificationClient<$Result.GetResult<Prisma.$SmsNotificationPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first SmsNotification that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SmsNotificationFindFirstOrThrowArgs} args - Arguments to find a SmsNotification
     * @example
     * // Get one SmsNotification
     * const smsNotification = await prisma.smsNotification.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SmsNotificationFindFirstOrThrowArgs>(args?: SelectSubset<T, SmsNotificationFindFirstOrThrowArgs<ExtArgs>>): Prisma__SmsNotificationClient<$Result.GetResult<Prisma.$SmsNotificationPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more SmsNotifications that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SmsNotificationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SmsNotifications
     * const smsNotifications = await prisma.smsNotification.findMany()
     * 
     * // Get first 10 SmsNotifications
     * const smsNotifications = await prisma.smsNotification.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const smsNotificationWithIdOnly = await prisma.smsNotification.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SmsNotificationFindManyArgs>(args?: SelectSubset<T, SmsNotificationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SmsNotificationPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a SmsNotification.
     * @param {SmsNotificationCreateArgs} args - Arguments to create a SmsNotification.
     * @example
     * // Create one SmsNotification
     * const SmsNotification = await prisma.smsNotification.create({
     *   data: {
     *     // ... data to create a SmsNotification
     *   }
     * })
     * 
     */
    create<T extends SmsNotificationCreateArgs>(args: SelectSubset<T, SmsNotificationCreateArgs<ExtArgs>>): Prisma__SmsNotificationClient<$Result.GetResult<Prisma.$SmsNotificationPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many SmsNotifications.
     * @param {SmsNotificationCreateManyArgs} args - Arguments to create many SmsNotifications.
     * @example
     * // Create many SmsNotifications
     * const smsNotification = await prisma.smsNotification.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SmsNotificationCreateManyArgs>(args?: SelectSubset<T, SmsNotificationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SmsNotifications and returns the data saved in the database.
     * @param {SmsNotificationCreateManyAndReturnArgs} args - Arguments to create many SmsNotifications.
     * @example
     * // Create many SmsNotifications
     * const smsNotification = await prisma.smsNotification.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SmsNotifications and only return the `id`
     * const smsNotificationWithIdOnly = await prisma.smsNotification.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SmsNotificationCreateManyAndReturnArgs>(args?: SelectSubset<T, SmsNotificationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SmsNotificationPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a SmsNotification.
     * @param {SmsNotificationDeleteArgs} args - Arguments to delete one SmsNotification.
     * @example
     * // Delete one SmsNotification
     * const SmsNotification = await prisma.smsNotification.delete({
     *   where: {
     *     // ... filter to delete one SmsNotification
     *   }
     * })
     * 
     */
    delete<T extends SmsNotificationDeleteArgs>(args: SelectSubset<T, SmsNotificationDeleteArgs<ExtArgs>>): Prisma__SmsNotificationClient<$Result.GetResult<Prisma.$SmsNotificationPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one SmsNotification.
     * @param {SmsNotificationUpdateArgs} args - Arguments to update one SmsNotification.
     * @example
     * // Update one SmsNotification
     * const smsNotification = await prisma.smsNotification.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SmsNotificationUpdateArgs>(args: SelectSubset<T, SmsNotificationUpdateArgs<ExtArgs>>): Prisma__SmsNotificationClient<$Result.GetResult<Prisma.$SmsNotificationPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more SmsNotifications.
     * @param {SmsNotificationDeleteManyArgs} args - Arguments to filter SmsNotifications to delete.
     * @example
     * // Delete a few SmsNotifications
     * const { count } = await prisma.smsNotification.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SmsNotificationDeleteManyArgs>(args?: SelectSubset<T, SmsNotificationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SmsNotifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SmsNotificationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SmsNotifications
     * const smsNotification = await prisma.smsNotification.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SmsNotificationUpdateManyArgs>(args: SelectSubset<T, SmsNotificationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one SmsNotification.
     * @param {SmsNotificationUpsertArgs} args - Arguments to update or create a SmsNotification.
     * @example
     * // Update or create a SmsNotification
     * const smsNotification = await prisma.smsNotification.upsert({
     *   create: {
     *     // ... data to create a SmsNotification
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SmsNotification we want to update
     *   }
     * })
     */
    upsert<T extends SmsNotificationUpsertArgs>(args: SelectSubset<T, SmsNotificationUpsertArgs<ExtArgs>>): Prisma__SmsNotificationClient<$Result.GetResult<Prisma.$SmsNotificationPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of SmsNotifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SmsNotificationCountArgs} args - Arguments to filter SmsNotifications to count.
     * @example
     * // Count the number of SmsNotifications
     * const count = await prisma.smsNotification.count({
     *   where: {
     *     // ... the filter for the SmsNotifications we want to count
     *   }
     * })
    **/
    count<T extends SmsNotificationCountArgs>(
      args?: Subset<T, SmsNotificationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SmsNotificationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SmsNotification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SmsNotificationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SmsNotificationAggregateArgs>(args: Subset<T, SmsNotificationAggregateArgs>): Prisma.PrismaPromise<GetSmsNotificationAggregateType<T>>

    /**
     * Group by SmsNotification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SmsNotificationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SmsNotificationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SmsNotificationGroupByArgs['orderBy'] }
        : { orderBy?: SmsNotificationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SmsNotificationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSmsNotificationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SmsNotification model
   */
  readonly fields: SmsNotificationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SmsNotification.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SmsNotificationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SmsNotification model
   */ 
  interface SmsNotificationFieldRefs {
    readonly id: FieldRef<"SmsNotification", 'String'>
    readonly recipient: FieldRef<"SmsNotification", 'String'>
    readonly recipientName: FieldRef<"SmsNotification", 'String'>
    readonly message: FieldRef<"SmsNotification", 'String'>
    readonly semaphoreId: FieldRef<"SmsNotification", 'String'>
    readonly status: FieldRef<"SmsNotification", 'String'>
    readonly type: FieldRef<"SmsNotification", 'String'>
    readonly senderName: FieldRef<"SmsNotification", 'String'>
    readonly sentBy: FieldRef<"SmsNotification", 'String'>
    readonly errorMessage: FieldRef<"SmsNotification", 'String'>
    readonly createdAt: FieldRef<"SmsNotification", 'DateTime'>
    readonly updatedAt: FieldRef<"SmsNotification", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SmsNotification findUnique
   */
  export type SmsNotificationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SmsNotification
     */
    select?: SmsNotificationSelect<ExtArgs> | null
    /**
     * Filter, which SmsNotification to fetch.
     */
    where: SmsNotificationWhereUniqueInput
  }

  /**
   * SmsNotification findUniqueOrThrow
   */
  export type SmsNotificationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SmsNotification
     */
    select?: SmsNotificationSelect<ExtArgs> | null
    /**
     * Filter, which SmsNotification to fetch.
     */
    where: SmsNotificationWhereUniqueInput
  }

  /**
   * SmsNotification findFirst
   */
  export type SmsNotificationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SmsNotification
     */
    select?: SmsNotificationSelect<ExtArgs> | null
    /**
     * Filter, which SmsNotification to fetch.
     */
    where?: SmsNotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SmsNotifications to fetch.
     */
    orderBy?: SmsNotificationOrderByWithRelationInput | SmsNotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SmsNotifications.
     */
    cursor?: SmsNotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SmsNotifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SmsNotifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SmsNotifications.
     */
    distinct?: SmsNotificationScalarFieldEnum | SmsNotificationScalarFieldEnum[]
  }

  /**
   * SmsNotification findFirstOrThrow
   */
  export type SmsNotificationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SmsNotification
     */
    select?: SmsNotificationSelect<ExtArgs> | null
    /**
     * Filter, which SmsNotification to fetch.
     */
    where?: SmsNotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SmsNotifications to fetch.
     */
    orderBy?: SmsNotificationOrderByWithRelationInput | SmsNotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SmsNotifications.
     */
    cursor?: SmsNotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SmsNotifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SmsNotifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SmsNotifications.
     */
    distinct?: SmsNotificationScalarFieldEnum | SmsNotificationScalarFieldEnum[]
  }

  /**
   * SmsNotification findMany
   */
  export type SmsNotificationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SmsNotification
     */
    select?: SmsNotificationSelect<ExtArgs> | null
    /**
     * Filter, which SmsNotifications to fetch.
     */
    where?: SmsNotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SmsNotifications to fetch.
     */
    orderBy?: SmsNotificationOrderByWithRelationInput | SmsNotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SmsNotifications.
     */
    cursor?: SmsNotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SmsNotifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SmsNotifications.
     */
    skip?: number
    distinct?: SmsNotificationScalarFieldEnum | SmsNotificationScalarFieldEnum[]
  }

  /**
   * SmsNotification create
   */
  export type SmsNotificationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SmsNotification
     */
    select?: SmsNotificationSelect<ExtArgs> | null
    /**
     * The data needed to create a SmsNotification.
     */
    data: XOR<SmsNotificationCreateInput, SmsNotificationUncheckedCreateInput>
  }

  /**
   * SmsNotification createMany
   */
  export type SmsNotificationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SmsNotifications.
     */
    data: SmsNotificationCreateManyInput | SmsNotificationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SmsNotification createManyAndReturn
   */
  export type SmsNotificationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SmsNotification
     */
    select?: SmsNotificationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many SmsNotifications.
     */
    data: SmsNotificationCreateManyInput | SmsNotificationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SmsNotification update
   */
  export type SmsNotificationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SmsNotification
     */
    select?: SmsNotificationSelect<ExtArgs> | null
    /**
     * The data needed to update a SmsNotification.
     */
    data: XOR<SmsNotificationUpdateInput, SmsNotificationUncheckedUpdateInput>
    /**
     * Choose, which SmsNotification to update.
     */
    where: SmsNotificationWhereUniqueInput
  }

  /**
   * SmsNotification updateMany
   */
  export type SmsNotificationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SmsNotifications.
     */
    data: XOR<SmsNotificationUpdateManyMutationInput, SmsNotificationUncheckedUpdateManyInput>
    /**
     * Filter which SmsNotifications to update
     */
    where?: SmsNotificationWhereInput
  }

  /**
   * SmsNotification upsert
   */
  export type SmsNotificationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SmsNotification
     */
    select?: SmsNotificationSelect<ExtArgs> | null
    /**
     * The filter to search for the SmsNotification to update in case it exists.
     */
    where: SmsNotificationWhereUniqueInput
    /**
     * In case the SmsNotification found by the `where` argument doesn't exist, create a new SmsNotification with this data.
     */
    create: XOR<SmsNotificationCreateInput, SmsNotificationUncheckedCreateInput>
    /**
     * In case the SmsNotification was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SmsNotificationUpdateInput, SmsNotificationUncheckedUpdateInput>
  }

  /**
   * SmsNotification delete
   */
  export type SmsNotificationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SmsNotification
     */
    select?: SmsNotificationSelect<ExtArgs> | null
    /**
     * Filter which SmsNotification to delete.
     */
    where: SmsNotificationWhereUniqueInput
  }

  /**
   * SmsNotification deleteMany
   */
  export type SmsNotificationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SmsNotifications to delete
     */
    where?: SmsNotificationWhereInput
  }

  /**
   * SmsNotification without action
   */
  export type SmsNotificationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SmsNotification
     */
    select?: SmsNotificationSelect<ExtArgs> | null
  }


  /**
   * Model SystemSetting
   */

  export type AggregateSystemSetting = {
    _count: SystemSettingCountAggregateOutputType | null
    _avg: SystemSettingAvgAggregateOutputType | null
    _sum: SystemSettingSumAggregateOutputType | null
    _min: SystemSettingMinAggregateOutputType | null
    _max: SystemSettingMaxAggregateOutputType | null
  }

  export type SystemSettingAvgAggregateOutputType = {
    itemsPerPage: number | null
    sessionTimeout: number | null
  }

  export type SystemSettingSumAggregateOutputType = {
    itemsPerPage: number | null
    sessionTimeout: number | null
  }

  export type SystemSettingMinAggregateOutputType = {
    id: string | null
    systemName: string | null
    systemDescription: string | null
    systemLogo: string | null
    contactNumber: string | null
    officialEmail: string | null
    officeAddress: string | null
    timeZone: string | null
    dateFormat: string | null
    timeFormat: string | null
    notifNewInquiry: boolean | null
    notifInquiryAccepted: boolean | null
    notifInquiryRejected: boolean | null
    notifPayment: boolean | null
    notifOverduePayment: boolean | null
    notifAnnouncement: boolean | null
    notifGraveLocator: boolean | null
    notifSystem: boolean | null
    smsEnabled: boolean | null
    smsProvider: string | null
    smsSenderName: string | null
    emailEnabled: boolean | null
    emailSenderName: string | null
    emailSenderAddress: string | null
    userAccessEnabled: boolean | null
    mobileAppEnabled: boolean | null
    inquiriesEnabled: boolean | null
    announcementsEnabled: boolean | null
    graveLocatorEnabled: boolean | null
    maintenanceMode: boolean | null
    maintenanceMessage: string | null
    defaultTheme: string | null
    sidebarBehavior: string | null
    layoutDensity: string | null
    itemsPerPage: number | null
    defaultDashboardPage: string | null
    language: string | null
    lastBackupAt: Date | null
    lastBackupFile: string | null
    backupStatus: string | null
    autoBackupEnabled: boolean | null
    backupFrequency: string | null
    sessionTimeout: number | null
    updatedAt: Date | null
    createdAt: Date | null
  }

  export type SystemSettingMaxAggregateOutputType = {
    id: string | null
    systemName: string | null
    systemDescription: string | null
    systemLogo: string | null
    contactNumber: string | null
    officialEmail: string | null
    officeAddress: string | null
    timeZone: string | null
    dateFormat: string | null
    timeFormat: string | null
    notifNewInquiry: boolean | null
    notifInquiryAccepted: boolean | null
    notifInquiryRejected: boolean | null
    notifPayment: boolean | null
    notifOverduePayment: boolean | null
    notifAnnouncement: boolean | null
    notifGraveLocator: boolean | null
    notifSystem: boolean | null
    smsEnabled: boolean | null
    smsProvider: string | null
    smsSenderName: string | null
    emailEnabled: boolean | null
    emailSenderName: string | null
    emailSenderAddress: string | null
    userAccessEnabled: boolean | null
    mobileAppEnabled: boolean | null
    inquiriesEnabled: boolean | null
    announcementsEnabled: boolean | null
    graveLocatorEnabled: boolean | null
    maintenanceMode: boolean | null
    maintenanceMessage: string | null
    defaultTheme: string | null
    sidebarBehavior: string | null
    layoutDensity: string | null
    itemsPerPage: number | null
    defaultDashboardPage: string | null
    language: string | null
    lastBackupAt: Date | null
    lastBackupFile: string | null
    backupStatus: string | null
    autoBackupEnabled: boolean | null
    backupFrequency: string | null
    sessionTimeout: number | null
    updatedAt: Date | null
    createdAt: Date | null
  }

  export type SystemSettingCountAggregateOutputType = {
    id: number
    systemName: number
    systemDescription: number
    systemLogo: number
    contactNumber: number
    officialEmail: number
    officeAddress: number
    timeZone: number
    dateFormat: number
    timeFormat: number
    notifNewInquiry: number
    notifInquiryAccepted: number
    notifInquiryRejected: number
    notifPayment: number
    notifOverduePayment: number
    notifAnnouncement: number
    notifGraveLocator: number
    notifSystem: number
    smsEnabled: number
    smsProvider: number
    smsSenderName: number
    emailEnabled: number
    emailSenderName: number
    emailSenderAddress: number
    userAccessEnabled: number
    mobileAppEnabled: number
    inquiriesEnabled: number
    announcementsEnabled: number
    graveLocatorEnabled: number
    maintenanceMode: number
    maintenanceMessage: number
    defaultTheme: number
    sidebarBehavior: number
    layoutDensity: number
    itemsPerPage: number
    defaultDashboardPage: number
    language: number
    lastBackupAt: number
    lastBackupFile: number
    backupStatus: number
    autoBackupEnabled: number
    backupFrequency: number
    sessionTimeout: number
    updatedAt: number
    createdAt: number
    _all: number
  }


  export type SystemSettingAvgAggregateInputType = {
    itemsPerPage?: true
    sessionTimeout?: true
  }

  export type SystemSettingSumAggregateInputType = {
    itemsPerPage?: true
    sessionTimeout?: true
  }

  export type SystemSettingMinAggregateInputType = {
    id?: true
    systemName?: true
    systemDescription?: true
    systemLogo?: true
    contactNumber?: true
    officialEmail?: true
    officeAddress?: true
    timeZone?: true
    dateFormat?: true
    timeFormat?: true
    notifNewInquiry?: true
    notifInquiryAccepted?: true
    notifInquiryRejected?: true
    notifPayment?: true
    notifOverduePayment?: true
    notifAnnouncement?: true
    notifGraveLocator?: true
    notifSystem?: true
    smsEnabled?: true
    smsProvider?: true
    smsSenderName?: true
    emailEnabled?: true
    emailSenderName?: true
    emailSenderAddress?: true
    userAccessEnabled?: true
    mobileAppEnabled?: true
    inquiriesEnabled?: true
    announcementsEnabled?: true
    graveLocatorEnabled?: true
    maintenanceMode?: true
    maintenanceMessage?: true
    defaultTheme?: true
    sidebarBehavior?: true
    layoutDensity?: true
    itemsPerPage?: true
    defaultDashboardPage?: true
    language?: true
    lastBackupAt?: true
    lastBackupFile?: true
    backupStatus?: true
    autoBackupEnabled?: true
    backupFrequency?: true
    sessionTimeout?: true
    updatedAt?: true
    createdAt?: true
  }

  export type SystemSettingMaxAggregateInputType = {
    id?: true
    systemName?: true
    systemDescription?: true
    systemLogo?: true
    contactNumber?: true
    officialEmail?: true
    officeAddress?: true
    timeZone?: true
    dateFormat?: true
    timeFormat?: true
    notifNewInquiry?: true
    notifInquiryAccepted?: true
    notifInquiryRejected?: true
    notifPayment?: true
    notifOverduePayment?: true
    notifAnnouncement?: true
    notifGraveLocator?: true
    notifSystem?: true
    smsEnabled?: true
    smsProvider?: true
    smsSenderName?: true
    emailEnabled?: true
    emailSenderName?: true
    emailSenderAddress?: true
    userAccessEnabled?: true
    mobileAppEnabled?: true
    inquiriesEnabled?: true
    announcementsEnabled?: true
    graveLocatorEnabled?: true
    maintenanceMode?: true
    maintenanceMessage?: true
    defaultTheme?: true
    sidebarBehavior?: true
    layoutDensity?: true
    itemsPerPage?: true
    defaultDashboardPage?: true
    language?: true
    lastBackupAt?: true
    lastBackupFile?: true
    backupStatus?: true
    autoBackupEnabled?: true
    backupFrequency?: true
    sessionTimeout?: true
    updatedAt?: true
    createdAt?: true
  }

  export type SystemSettingCountAggregateInputType = {
    id?: true
    systemName?: true
    systemDescription?: true
    systemLogo?: true
    contactNumber?: true
    officialEmail?: true
    officeAddress?: true
    timeZone?: true
    dateFormat?: true
    timeFormat?: true
    notifNewInquiry?: true
    notifInquiryAccepted?: true
    notifInquiryRejected?: true
    notifPayment?: true
    notifOverduePayment?: true
    notifAnnouncement?: true
    notifGraveLocator?: true
    notifSystem?: true
    smsEnabled?: true
    smsProvider?: true
    smsSenderName?: true
    emailEnabled?: true
    emailSenderName?: true
    emailSenderAddress?: true
    userAccessEnabled?: true
    mobileAppEnabled?: true
    inquiriesEnabled?: true
    announcementsEnabled?: true
    graveLocatorEnabled?: true
    maintenanceMode?: true
    maintenanceMessage?: true
    defaultTheme?: true
    sidebarBehavior?: true
    layoutDensity?: true
    itemsPerPage?: true
    defaultDashboardPage?: true
    language?: true
    lastBackupAt?: true
    lastBackupFile?: true
    backupStatus?: true
    autoBackupEnabled?: true
    backupFrequency?: true
    sessionTimeout?: true
    updatedAt?: true
    createdAt?: true
    _all?: true
  }

  export type SystemSettingAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SystemSetting to aggregate.
     */
    where?: SystemSettingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SystemSettings to fetch.
     */
    orderBy?: SystemSettingOrderByWithRelationInput | SystemSettingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SystemSettingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SystemSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SystemSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SystemSettings
    **/
    _count?: true | SystemSettingCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SystemSettingAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SystemSettingSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SystemSettingMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SystemSettingMaxAggregateInputType
  }

  export type GetSystemSettingAggregateType<T extends SystemSettingAggregateArgs> = {
        [P in keyof T & keyof AggregateSystemSetting]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSystemSetting[P]>
      : GetScalarType<T[P], AggregateSystemSetting[P]>
  }




  export type SystemSettingGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SystemSettingWhereInput
    orderBy?: SystemSettingOrderByWithAggregationInput | SystemSettingOrderByWithAggregationInput[]
    by: SystemSettingScalarFieldEnum[] | SystemSettingScalarFieldEnum
    having?: SystemSettingScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SystemSettingCountAggregateInputType | true
    _avg?: SystemSettingAvgAggregateInputType
    _sum?: SystemSettingSumAggregateInputType
    _min?: SystemSettingMinAggregateInputType
    _max?: SystemSettingMaxAggregateInputType
  }

  export type SystemSettingGroupByOutputType = {
    id: string
    systemName: string
    systemDescription: string
    systemLogo: string | null
    contactNumber: string
    officialEmail: string
    officeAddress: string
    timeZone: string
    dateFormat: string
    timeFormat: string
    notifNewInquiry: boolean
    notifInquiryAccepted: boolean
    notifInquiryRejected: boolean
    notifPayment: boolean
    notifOverduePayment: boolean
    notifAnnouncement: boolean
    notifGraveLocator: boolean
    notifSystem: boolean
    smsEnabled: boolean
    smsProvider: string
    smsSenderName: string
    emailEnabled: boolean
    emailSenderName: string
    emailSenderAddress: string
    userAccessEnabled: boolean
    mobileAppEnabled: boolean
    inquiriesEnabled: boolean
    announcementsEnabled: boolean
    graveLocatorEnabled: boolean
    maintenanceMode: boolean
    maintenanceMessage: string
    defaultTheme: string
    sidebarBehavior: string
    layoutDensity: string
    itemsPerPage: number
    defaultDashboardPage: string
    language: string
    lastBackupAt: Date | null
    lastBackupFile: string | null
    backupStatus: string
    autoBackupEnabled: boolean
    backupFrequency: string
    sessionTimeout: number
    updatedAt: Date
    createdAt: Date
    _count: SystemSettingCountAggregateOutputType | null
    _avg: SystemSettingAvgAggregateOutputType | null
    _sum: SystemSettingSumAggregateOutputType | null
    _min: SystemSettingMinAggregateOutputType | null
    _max: SystemSettingMaxAggregateOutputType | null
  }

  type GetSystemSettingGroupByPayload<T extends SystemSettingGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SystemSettingGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SystemSettingGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SystemSettingGroupByOutputType[P]>
            : GetScalarType<T[P], SystemSettingGroupByOutputType[P]>
        }
      >
    >


  export type SystemSettingSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    systemName?: boolean
    systemDescription?: boolean
    systemLogo?: boolean
    contactNumber?: boolean
    officialEmail?: boolean
    officeAddress?: boolean
    timeZone?: boolean
    dateFormat?: boolean
    timeFormat?: boolean
    notifNewInquiry?: boolean
    notifInquiryAccepted?: boolean
    notifInquiryRejected?: boolean
    notifPayment?: boolean
    notifOverduePayment?: boolean
    notifAnnouncement?: boolean
    notifGraveLocator?: boolean
    notifSystem?: boolean
    smsEnabled?: boolean
    smsProvider?: boolean
    smsSenderName?: boolean
    emailEnabled?: boolean
    emailSenderName?: boolean
    emailSenderAddress?: boolean
    userAccessEnabled?: boolean
    mobileAppEnabled?: boolean
    inquiriesEnabled?: boolean
    announcementsEnabled?: boolean
    graveLocatorEnabled?: boolean
    maintenanceMode?: boolean
    maintenanceMessage?: boolean
    defaultTheme?: boolean
    sidebarBehavior?: boolean
    layoutDensity?: boolean
    itemsPerPage?: boolean
    defaultDashboardPage?: boolean
    language?: boolean
    lastBackupAt?: boolean
    lastBackupFile?: boolean
    backupStatus?: boolean
    autoBackupEnabled?: boolean
    backupFrequency?: boolean
    sessionTimeout?: boolean
    updatedAt?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["systemSetting"]>

  export type SystemSettingSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    systemName?: boolean
    systemDescription?: boolean
    systemLogo?: boolean
    contactNumber?: boolean
    officialEmail?: boolean
    officeAddress?: boolean
    timeZone?: boolean
    dateFormat?: boolean
    timeFormat?: boolean
    notifNewInquiry?: boolean
    notifInquiryAccepted?: boolean
    notifInquiryRejected?: boolean
    notifPayment?: boolean
    notifOverduePayment?: boolean
    notifAnnouncement?: boolean
    notifGraveLocator?: boolean
    notifSystem?: boolean
    smsEnabled?: boolean
    smsProvider?: boolean
    smsSenderName?: boolean
    emailEnabled?: boolean
    emailSenderName?: boolean
    emailSenderAddress?: boolean
    userAccessEnabled?: boolean
    mobileAppEnabled?: boolean
    inquiriesEnabled?: boolean
    announcementsEnabled?: boolean
    graveLocatorEnabled?: boolean
    maintenanceMode?: boolean
    maintenanceMessage?: boolean
    defaultTheme?: boolean
    sidebarBehavior?: boolean
    layoutDensity?: boolean
    itemsPerPage?: boolean
    defaultDashboardPage?: boolean
    language?: boolean
    lastBackupAt?: boolean
    lastBackupFile?: boolean
    backupStatus?: boolean
    autoBackupEnabled?: boolean
    backupFrequency?: boolean
    sessionTimeout?: boolean
    updatedAt?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["systemSetting"]>

  export type SystemSettingSelectScalar = {
    id?: boolean
    systemName?: boolean
    systemDescription?: boolean
    systemLogo?: boolean
    contactNumber?: boolean
    officialEmail?: boolean
    officeAddress?: boolean
    timeZone?: boolean
    dateFormat?: boolean
    timeFormat?: boolean
    notifNewInquiry?: boolean
    notifInquiryAccepted?: boolean
    notifInquiryRejected?: boolean
    notifPayment?: boolean
    notifOverduePayment?: boolean
    notifAnnouncement?: boolean
    notifGraveLocator?: boolean
    notifSystem?: boolean
    smsEnabled?: boolean
    smsProvider?: boolean
    smsSenderName?: boolean
    emailEnabled?: boolean
    emailSenderName?: boolean
    emailSenderAddress?: boolean
    userAccessEnabled?: boolean
    mobileAppEnabled?: boolean
    inquiriesEnabled?: boolean
    announcementsEnabled?: boolean
    graveLocatorEnabled?: boolean
    maintenanceMode?: boolean
    maintenanceMessage?: boolean
    defaultTheme?: boolean
    sidebarBehavior?: boolean
    layoutDensity?: boolean
    itemsPerPage?: boolean
    defaultDashboardPage?: boolean
    language?: boolean
    lastBackupAt?: boolean
    lastBackupFile?: boolean
    backupStatus?: boolean
    autoBackupEnabled?: boolean
    backupFrequency?: boolean
    sessionTimeout?: boolean
    updatedAt?: boolean
    createdAt?: boolean
  }


  export type $SystemSettingPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SystemSetting"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      systemName: string
      systemDescription: string
      systemLogo: string | null
      contactNumber: string
      officialEmail: string
      officeAddress: string
      timeZone: string
      dateFormat: string
      timeFormat: string
      notifNewInquiry: boolean
      notifInquiryAccepted: boolean
      notifInquiryRejected: boolean
      notifPayment: boolean
      notifOverduePayment: boolean
      notifAnnouncement: boolean
      notifGraveLocator: boolean
      notifSystem: boolean
      smsEnabled: boolean
      smsProvider: string
      smsSenderName: string
      emailEnabled: boolean
      emailSenderName: string
      emailSenderAddress: string
      userAccessEnabled: boolean
      mobileAppEnabled: boolean
      inquiriesEnabled: boolean
      announcementsEnabled: boolean
      graveLocatorEnabled: boolean
      maintenanceMode: boolean
      maintenanceMessage: string
      defaultTheme: string
      sidebarBehavior: string
      layoutDensity: string
      itemsPerPage: number
      defaultDashboardPage: string
      language: string
      lastBackupAt: Date | null
      lastBackupFile: string | null
      backupStatus: string
      autoBackupEnabled: boolean
      backupFrequency: string
      sessionTimeout: number
      updatedAt: Date
      createdAt: Date
    }, ExtArgs["result"]["systemSetting"]>
    composites: {}
  }

  type SystemSettingGetPayload<S extends boolean | null | undefined | SystemSettingDefaultArgs> = $Result.GetResult<Prisma.$SystemSettingPayload, S>

  type SystemSettingCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<SystemSettingFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: SystemSettingCountAggregateInputType | true
    }

  export interface SystemSettingDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SystemSetting'], meta: { name: 'SystemSetting' } }
    /**
     * Find zero or one SystemSetting that matches the filter.
     * @param {SystemSettingFindUniqueArgs} args - Arguments to find a SystemSetting
     * @example
     * // Get one SystemSetting
     * const systemSetting = await prisma.systemSetting.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SystemSettingFindUniqueArgs>(args: SelectSubset<T, SystemSettingFindUniqueArgs<ExtArgs>>): Prisma__SystemSettingClient<$Result.GetResult<Prisma.$SystemSettingPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one SystemSetting that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {SystemSettingFindUniqueOrThrowArgs} args - Arguments to find a SystemSetting
     * @example
     * // Get one SystemSetting
     * const systemSetting = await prisma.systemSetting.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SystemSettingFindUniqueOrThrowArgs>(args: SelectSubset<T, SystemSettingFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SystemSettingClient<$Result.GetResult<Prisma.$SystemSettingPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first SystemSetting that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemSettingFindFirstArgs} args - Arguments to find a SystemSetting
     * @example
     * // Get one SystemSetting
     * const systemSetting = await prisma.systemSetting.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SystemSettingFindFirstArgs>(args?: SelectSubset<T, SystemSettingFindFirstArgs<ExtArgs>>): Prisma__SystemSettingClient<$Result.GetResult<Prisma.$SystemSettingPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first SystemSetting that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemSettingFindFirstOrThrowArgs} args - Arguments to find a SystemSetting
     * @example
     * // Get one SystemSetting
     * const systemSetting = await prisma.systemSetting.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SystemSettingFindFirstOrThrowArgs>(args?: SelectSubset<T, SystemSettingFindFirstOrThrowArgs<ExtArgs>>): Prisma__SystemSettingClient<$Result.GetResult<Prisma.$SystemSettingPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more SystemSettings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemSettingFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SystemSettings
     * const systemSettings = await prisma.systemSetting.findMany()
     * 
     * // Get first 10 SystemSettings
     * const systemSettings = await prisma.systemSetting.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const systemSettingWithIdOnly = await prisma.systemSetting.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SystemSettingFindManyArgs>(args?: SelectSubset<T, SystemSettingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SystemSettingPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a SystemSetting.
     * @param {SystemSettingCreateArgs} args - Arguments to create a SystemSetting.
     * @example
     * // Create one SystemSetting
     * const SystemSetting = await prisma.systemSetting.create({
     *   data: {
     *     // ... data to create a SystemSetting
     *   }
     * })
     * 
     */
    create<T extends SystemSettingCreateArgs>(args: SelectSubset<T, SystemSettingCreateArgs<ExtArgs>>): Prisma__SystemSettingClient<$Result.GetResult<Prisma.$SystemSettingPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many SystemSettings.
     * @param {SystemSettingCreateManyArgs} args - Arguments to create many SystemSettings.
     * @example
     * // Create many SystemSettings
     * const systemSetting = await prisma.systemSetting.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SystemSettingCreateManyArgs>(args?: SelectSubset<T, SystemSettingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SystemSettings and returns the data saved in the database.
     * @param {SystemSettingCreateManyAndReturnArgs} args - Arguments to create many SystemSettings.
     * @example
     * // Create many SystemSettings
     * const systemSetting = await prisma.systemSetting.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SystemSettings and only return the `id`
     * const systemSettingWithIdOnly = await prisma.systemSetting.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SystemSettingCreateManyAndReturnArgs>(args?: SelectSubset<T, SystemSettingCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SystemSettingPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a SystemSetting.
     * @param {SystemSettingDeleteArgs} args - Arguments to delete one SystemSetting.
     * @example
     * // Delete one SystemSetting
     * const SystemSetting = await prisma.systemSetting.delete({
     *   where: {
     *     // ... filter to delete one SystemSetting
     *   }
     * })
     * 
     */
    delete<T extends SystemSettingDeleteArgs>(args: SelectSubset<T, SystemSettingDeleteArgs<ExtArgs>>): Prisma__SystemSettingClient<$Result.GetResult<Prisma.$SystemSettingPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one SystemSetting.
     * @param {SystemSettingUpdateArgs} args - Arguments to update one SystemSetting.
     * @example
     * // Update one SystemSetting
     * const systemSetting = await prisma.systemSetting.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SystemSettingUpdateArgs>(args: SelectSubset<T, SystemSettingUpdateArgs<ExtArgs>>): Prisma__SystemSettingClient<$Result.GetResult<Prisma.$SystemSettingPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more SystemSettings.
     * @param {SystemSettingDeleteManyArgs} args - Arguments to filter SystemSettings to delete.
     * @example
     * // Delete a few SystemSettings
     * const { count } = await prisma.systemSetting.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SystemSettingDeleteManyArgs>(args?: SelectSubset<T, SystemSettingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SystemSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemSettingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SystemSettings
     * const systemSetting = await prisma.systemSetting.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SystemSettingUpdateManyArgs>(args: SelectSubset<T, SystemSettingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one SystemSetting.
     * @param {SystemSettingUpsertArgs} args - Arguments to update or create a SystemSetting.
     * @example
     * // Update or create a SystemSetting
     * const systemSetting = await prisma.systemSetting.upsert({
     *   create: {
     *     // ... data to create a SystemSetting
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SystemSetting we want to update
     *   }
     * })
     */
    upsert<T extends SystemSettingUpsertArgs>(args: SelectSubset<T, SystemSettingUpsertArgs<ExtArgs>>): Prisma__SystemSettingClient<$Result.GetResult<Prisma.$SystemSettingPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of SystemSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemSettingCountArgs} args - Arguments to filter SystemSettings to count.
     * @example
     * // Count the number of SystemSettings
     * const count = await prisma.systemSetting.count({
     *   where: {
     *     // ... the filter for the SystemSettings we want to count
     *   }
     * })
    **/
    count<T extends SystemSettingCountArgs>(
      args?: Subset<T, SystemSettingCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SystemSettingCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SystemSetting.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemSettingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SystemSettingAggregateArgs>(args: Subset<T, SystemSettingAggregateArgs>): Prisma.PrismaPromise<GetSystemSettingAggregateType<T>>

    /**
     * Group by SystemSetting.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemSettingGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SystemSettingGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SystemSettingGroupByArgs['orderBy'] }
        : { orderBy?: SystemSettingGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SystemSettingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSystemSettingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SystemSetting model
   */
  readonly fields: SystemSettingFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SystemSetting.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SystemSettingClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SystemSetting model
   */ 
  interface SystemSettingFieldRefs {
    readonly id: FieldRef<"SystemSetting", 'String'>
    readonly systemName: FieldRef<"SystemSetting", 'String'>
    readonly systemDescription: FieldRef<"SystemSetting", 'String'>
    readonly systemLogo: FieldRef<"SystemSetting", 'String'>
    readonly contactNumber: FieldRef<"SystemSetting", 'String'>
    readonly officialEmail: FieldRef<"SystemSetting", 'String'>
    readonly officeAddress: FieldRef<"SystemSetting", 'String'>
    readonly timeZone: FieldRef<"SystemSetting", 'String'>
    readonly dateFormat: FieldRef<"SystemSetting", 'String'>
    readonly timeFormat: FieldRef<"SystemSetting", 'String'>
    readonly notifNewInquiry: FieldRef<"SystemSetting", 'Boolean'>
    readonly notifInquiryAccepted: FieldRef<"SystemSetting", 'Boolean'>
    readonly notifInquiryRejected: FieldRef<"SystemSetting", 'Boolean'>
    readonly notifPayment: FieldRef<"SystemSetting", 'Boolean'>
    readonly notifOverduePayment: FieldRef<"SystemSetting", 'Boolean'>
    readonly notifAnnouncement: FieldRef<"SystemSetting", 'Boolean'>
    readonly notifGraveLocator: FieldRef<"SystemSetting", 'Boolean'>
    readonly notifSystem: FieldRef<"SystemSetting", 'Boolean'>
    readonly smsEnabled: FieldRef<"SystemSetting", 'Boolean'>
    readonly smsProvider: FieldRef<"SystemSetting", 'String'>
    readonly smsSenderName: FieldRef<"SystemSetting", 'String'>
    readonly emailEnabled: FieldRef<"SystemSetting", 'Boolean'>
    readonly emailSenderName: FieldRef<"SystemSetting", 'String'>
    readonly emailSenderAddress: FieldRef<"SystemSetting", 'String'>
    readonly userAccessEnabled: FieldRef<"SystemSetting", 'Boolean'>
    readonly mobileAppEnabled: FieldRef<"SystemSetting", 'Boolean'>
    readonly inquiriesEnabled: FieldRef<"SystemSetting", 'Boolean'>
    readonly announcementsEnabled: FieldRef<"SystemSetting", 'Boolean'>
    readonly graveLocatorEnabled: FieldRef<"SystemSetting", 'Boolean'>
    readonly maintenanceMode: FieldRef<"SystemSetting", 'Boolean'>
    readonly maintenanceMessage: FieldRef<"SystemSetting", 'String'>
    readonly defaultTheme: FieldRef<"SystemSetting", 'String'>
    readonly sidebarBehavior: FieldRef<"SystemSetting", 'String'>
    readonly layoutDensity: FieldRef<"SystemSetting", 'String'>
    readonly itemsPerPage: FieldRef<"SystemSetting", 'Int'>
    readonly defaultDashboardPage: FieldRef<"SystemSetting", 'String'>
    readonly language: FieldRef<"SystemSetting", 'String'>
    readonly lastBackupAt: FieldRef<"SystemSetting", 'DateTime'>
    readonly lastBackupFile: FieldRef<"SystemSetting", 'String'>
    readonly backupStatus: FieldRef<"SystemSetting", 'String'>
    readonly autoBackupEnabled: FieldRef<"SystemSetting", 'Boolean'>
    readonly backupFrequency: FieldRef<"SystemSetting", 'String'>
    readonly sessionTimeout: FieldRef<"SystemSetting", 'Int'>
    readonly updatedAt: FieldRef<"SystemSetting", 'DateTime'>
    readonly createdAt: FieldRef<"SystemSetting", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SystemSetting findUnique
   */
  export type SystemSettingFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemSetting
     */
    select?: SystemSettingSelect<ExtArgs> | null
    /**
     * Filter, which SystemSetting to fetch.
     */
    where: SystemSettingWhereUniqueInput
  }

  /**
   * SystemSetting findUniqueOrThrow
   */
  export type SystemSettingFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemSetting
     */
    select?: SystemSettingSelect<ExtArgs> | null
    /**
     * Filter, which SystemSetting to fetch.
     */
    where: SystemSettingWhereUniqueInput
  }

  /**
   * SystemSetting findFirst
   */
  export type SystemSettingFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemSetting
     */
    select?: SystemSettingSelect<ExtArgs> | null
    /**
     * Filter, which SystemSetting to fetch.
     */
    where?: SystemSettingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SystemSettings to fetch.
     */
    orderBy?: SystemSettingOrderByWithRelationInput | SystemSettingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SystemSettings.
     */
    cursor?: SystemSettingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SystemSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SystemSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SystemSettings.
     */
    distinct?: SystemSettingScalarFieldEnum | SystemSettingScalarFieldEnum[]
  }

  /**
   * SystemSetting findFirstOrThrow
   */
  export type SystemSettingFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemSetting
     */
    select?: SystemSettingSelect<ExtArgs> | null
    /**
     * Filter, which SystemSetting to fetch.
     */
    where?: SystemSettingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SystemSettings to fetch.
     */
    orderBy?: SystemSettingOrderByWithRelationInput | SystemSettingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SystemSettings.
     */
    cursor?: SystemSettingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SystemSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SystemSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SystemSettings.
     */
    distinct?: SystemSettingScalarFieldEnum | SystemSettingScalarFieldEnum[]
  }

  /**
   * SystemSetting findMany
   */
  export type SystemSettingFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemSetting
     */
    select?: SystemSettingSelect<ExtArgs> | null
    /**
     * Filter, which SystemSettings to fetch.
     */
    where?: SystemSettingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SystemSettings to fetch.
     */
    orderBy?: SystemSettingOrderByWithRelationInput | SystemSettingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SystemSettings.
     */
    cursor?: SystemSettingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SystemSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SystemSettings.
     */
    skip?: number
    distinct?: SystemSettingScalarFieldEnum | SystemSettingScalarFieldEnum[]
  }

  /**
   * SystemSetting create
   */
  export type SystemSettingCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemSetting
     */
    select?: SystemSettingSelect<ExtArgs> | null
    /**
     * The data needed to create a SystemSetting.
     */
    data?: XOR<SystemSettingCreateInput, SystemSettingUncheckedCreateInput>
  }

  /**
   * SystemSetting createMany
   */
  export type SystemSettingCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SystemSettings.
     */
    data: SystemSettingCreateManyInput | SystemSettingCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SystemSetting createManyAndReturn
   */
  export type SystemSettingCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemSetting
     */
    select?: SystemSettingSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many SystemSettings.
     */
    data: SystemSettingCreateManyInput | SystemSettingCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SystemSetting update
   */
  export type SystemSettingUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemSetting
     */
    select?: SystemSettingSelect<ExtArgs> | null
    /**
     * The data needed to update a SystemSetting.
     */
    data: XOR<SystemSettingUpdateInput, SystemSettingUncheckedUpdateInput>
    /**
     * Choose, which SystemSetting to update.
     */
    where: SystemSettingWhereUniqueInput
  }

  /**
   * SystemSetting updateMany
   */
  export type SystemSettingUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SystemSettings.
     */
    data: XOR<SystemSettingUpdateManyMutationInput, SystemSettingUncheckedUpdateManyInput>
    /**
     * Filter which SystemSettings to update
     */
    where?: SystemSettingWhereInput
  }

  /**
   * SystemSetting upsert
   */
  export type SystemSettingUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemSetting
     */
    select?: SystemSettingSelect<ExtArgs> | null
    /**
     * The filter to search for the SystemSetting to update in case it exists.
     */
    where: SystemSettingWhereUniqueInput
    /**
     * In case the SystemSetting found by the `where` argument doesn't exist, create a new SystemSetting with this data.
     */
    create: XOR<SystemSettingCreateInput, SystemSettingUncheckedCreateInput>
    /**
     * In case the SystemSetting was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SystemSettingUpdateInput, SystemSettingUncheckedUpdateInput>
  }

  /**
   * SystemSetting delete
   */
  export type SystemSettingDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemSetting
     */
    select?: SystemSettingSelect<ExtArgs> | null
    /**
     * Filter which SystemSetting to delete.
     */
    where: SystemSettingWhereUniqueInput
  }

  /**
   * SystemSetting deleteMany
   */
  export type SystemSettingDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SystemSettings to delete
     */
    where?: SystemSettingWhereInput
  }

  /**
   * SystemSetting without action
   */
  export type SystemSettingDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemSetting
     */
    select?: SystemSettingSelect<ExtArgs> | null
  }


  /**
   * Model AdminAuditLog
   */

  export type AggregateAdminAuditLog = {
    _count: AdminAuditLogCountAggregateOutputType | null
    _min: AdminAuditLogMinAggregateOutputType | null
    _max: AdminAuditLogMaxAggregateOutputType | null
  }

  export type AdminAuditLogMinAggregateOutputType = {
    id: string | null
    activity: string | null
    category: string | null
    admin: string | null
    status: string | null
    details: string | null
    ipAddress: string | null
    createdAt: Date | null
  }

  export type AdminAuditLogMaxAggregateOutputType = {
    id: string | null
    activity: string | null
    category: string | null
    admin: string | null
    status: string | null
    details: string | null
    ipAddress: string | null
    createdAt: Date | null
  }

  export type AdminAuditLogCountAggregateOutputType = {
    id: number
    activity: number
    category: number
    admin: number
    status: number
    details: number
    ipAddress: number
    createdAt: number
    _all: number
  }


  export type AdminAuditLogMinAggregateInputType = {
    id?: true
    activity?: true
    category?: true
    admin?: true
    status?: true
    details?: true
    ipAddress?: true
    createdAt?: true
  }

  export type AdminAuditLogMaxAggregateInputType = {
    id?: true
    activity?: true
    category?: true
    admin?: true
    status?: true
    details?: true
    ipAddress?: true
    createdAt?: true
  }

  export type AdminAuditLogCountAggregateInputType = {
    id?: true
    activity?: true
    category?: true
    admin?: true
    status?: true
    details?: true
    ipAddress?: true
    createdAt?: true
    _all?: true
  }

  export type AdminAuditLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AdminAuditLog to aggregate.
     */
    where?: AdminAuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AdminAuditLogs to fetch.
     */
    orderBy?: AdminAuditLogOrderByWithRelationInput | AdminAuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AdminAuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AdminAuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AdminAuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AdminAuditLogs
    **/
    _count?: true | AdminAuditLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AdminAuditLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AdminAuditLogMaxAggregateInputType
  }

  export type GetAdminAuditLogAggregateType<T extends AdminAuditLogAggregateArgs> = {
        [P in keyof T & keyof AggregateAdminAuditLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAdminAuditLog[P]>
      : GetScalarType<T[P], AggregateAdminAuditLog[P]>
  }




  export type AdminAuditLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AdminAuditLogWhereInput
    orderBy?: AdminAuditLogOrderByWithAggregationInput | AdminAuditLogOrderByWithAggregationInput[]
    by: AdminAuditLogScalarFieldEnum[] | AdminAuditLogScalarFieldEnum
    having?: AdminAuditLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AdminAuditLogCountAggregateInputType | true
    _min?: AdminAuditLogMinAggregateInputType
    _max?: AdminAuditLogMaxAggregateInputType
  }

  export type AdminAuditLogGroupByOutputType = {
    id: string
    activity: string
    category: string
    admin: string
    status: string
    details: string | null
    ipAddress: string | null
    createdAt: Date
    _count: AdminAuditLogCountAggregateOutputType | null
    _min: AdminAuditLogMinAggregateOutputType | null
    _max: AdminAuditLogMaxAggregateOutputType | null
  }

  type GetAdminAuditLogGroupByPayload<T extends AdminAuditLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AdminAuditLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AdminAuditLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AdminAuditLogGroupByOutputType[P]>
            : GetScalarType<T[P], AdminAuditLogGroupByOutputType[P]>
        }
      >
    >


  export type AdminAuditLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    activity?: boolean
    category?: boolean
    admin?: boolean
    status?: boolean
    details?: boolean
    ipAddress?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["adminAuditLog"]>

  export type AdminAuditLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    activity?: boolean
    category?: boolean
    admin?: boolean
    status?: boolean
    details?: boolean
    ipAddress?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["adminAuditLog"]>

  export type AdminAuditLogSelectScalar = {
    id?: boolean
    activity?: boolean
    category?: boolean
    admin?: boolean
    status?: boolean
    details?: boolean
    ipAddress?: boolean
    createdAt?: boolean
  }


  export type $AdminAuditLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AdminAuditLog"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      activity: string
      category: string
      admin: string
      status: string
      details: string | null
      ipAddress: string | null
      createdAt: Date
    }, ExtArgs["result"]["adminAuditLog"]>
    composites: {}
  }

  type AdminAuditLogGetPayload<S extends boolean | null | undefined | AdminAuditLogDefaultArgs> = $Result.GetResult<Prisma.$AdminAuditLogPayload, S>

  type AdminAuditLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AdminAuditLogFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AdminAuditLogCountAggregateInputType | true
    }

  export interface AdminAuditLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AdminAuditLog'], meta: { name: 'AdminAuditLog' } }
    /**
     * Find zero or one AdminAuditLog that matches the filter.
     * @param {AdminAuditLogFindUniqueArgs} args - Arguments to find a AdminAuditLog
     * @example
     * // Get one AdminAuditLog
     * const adminAuditLog = await prisma.adminAuditLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AdminAuditLogFindUniqueArgs>(args: SelectSubset<T, AdminAuditLogFindUniqueArgs<ExtArgs>>): Prisma__AdminAuditLogClient<$Result.GetResult<Prisma.$AdminAuditLogPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one AdminAuditLog that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {AdminAuditLogFindUniqueOrThrowArgs} args - Arguments to find a AdminAuditLog
     * @example
     * // Get one AdminAuditLog
     * const adminAuditLog = await prisma.adminAuditLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AdminAuditLogFindUniqueOrThrowArgs>(args: SelectSubset<T, AdminAuditLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AdminAuditLogClient<$Result.GetResult<Prisma.$AdminAuditLogPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first AdminAuditLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminAuditLogFindFirstArgs} args - Arguments to find a AdminAuditLog
     * @example
     * // Get one AdminAuditLog
     * const adminAuditLog = await prisma.adminAuditLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AdminAuditLogFindFirstArgs>(args?: SelectSubset<T, AdminAuditLogFindFirstArgs<ExtArgs>>): Prisma__AdminAuditLogClient<$Result.GetResult<Prisma.$AdminAuditLogPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first AdminAuditLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminAuditLogFindFirstOrThrowArgs} args - Arguments to find a AdminAuditLog
     * @example
     * // Get one AdminAuditLog
     * const adminAuditLog = await prisma.adminAuditLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AdminAuditLogFindFirstOrThrowArgs>(args?: SelectSubset<T, AdminAuditLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__AdminAuditLogClient<$Result.GetResult<Prisma.$AdminAuditLogPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more AdminAuditLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminAuditLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AdminAuditLogs
     * const adminAuditLogs = await prisma.adminAuditLog.findMany()
     * 
     * // Get first 10 AdminAuditLogs
     * const adminAuditLogs = await prisma.adminAuditLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const adminAuditLogWithIdOnly = await prisma.adminAuditLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AdminAuditLogFindManyArgs>(args?: SelectSubset<T, AdminAuditLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AdminAuditLogPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a AdminAuditLog.
     * @param {AdminAuditLogCreateArgs} args - Arguments to create a AdminAuditLog.
     * @example
     * // Create one AdminAuditLog
     * const AdminAuditLog = await prisma.adminAuditLog.create({
     *   data: {
     *     // ... data to create a AdminAuditLog
     *   }
     * })
     * 
     */
    create<T extends AdminAuditLogCreateArgs>(args: SelectSubset<T, AdminAuditLogCreateArgs<ExtArgs>>): Prisma__AdminAuditLogClient<$Result.GetResult<Prisma.$AdminAuditLogPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many AdminAuditLogs.
     * @param {AdminAuditLogCreateManyArgs} args - Arguments to create many AdminAuditLogs.
     * @example
     * // Create many AdminAuditLogs
     * const adminAuditLog = await prisma.adminAuditLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AdminAuditLogCreateManyArgs>(args?: SelectSubset<T, AdminAuditLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AdminAuditLogs and returns the data saved in the database.
     * @param {AdminAuditLogCreateManyAndReturnArgs} args - Arguments to create many AdminAuditLogs.
     * @example
     * // Create many AdminAuditLogs
     * const adminAuditLog = await prisma.adminAuditLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AdminAuditLogs and only return the `id`
     * const adminAuditLogWithIdOnly = await prisma.adminAuditLog.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AdminAuditLogCreateManyAndReturnArgs>(args?: SelectSubset<T, AdminAuditLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AdminAuditLogPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a AdminAuditLog.
     * @param {AdminAuditLogDeleteArgs} args - Arguments to delete one AdminAuditLog.
     * @example
     * // Delete one AdminAuditLog
     * const AdminAuditLog = await prisma.adminAuditLog.delete({
     *   where: {
     *     // ... filter to delete one AdminAuditLog
     *   }
     * })
     * 
     */
    delete<T extends AdminAuditLogDeleteArgs>(args: SelectSubset<T, AdminAuditLogDeleteArgs<ExtArgs>>): Prisma__AdminAuditLogClient<$Result.GetResult<Prisma.$AdminAuditLogPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one AdminAuditLog.
     * @param {AdminAuditLogUpdateArgs} args - Arguments to update one AdminAuditLog.
     * @example
     * // Update one AdminAuditLog
     * const adminAuditLog = await prisma.adminAuditLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AdminAuditLogUpdateArgs>(args: SelectSubset<T, AdminAuditLogUpdateArgs<ExtArgs>>): Prisma__AdminAuditLogClient<$Result.GetResult<Prisma.$AdminAuditLogPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more AdminAuditLogs.
     * @param {AdminAuditLogDeleteManyArgs} args - Arguments to filter AdminAuditLogs to delete.
     * @example
     * // Delete a few AdminAuditLogs
     * const { count } = await prisma.adminAuditLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AdminAuditLogDeleteManyArgs>(args?: SelectSubset<T, AdminAuditLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AdminAuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminAuditLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AdminAuditLogs
     * const adminAuditLog = await prisma.adminAuditLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AdminAuditLogUpdateManyArgs>(args: SelectSubset<T, AdminAuditLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one AdminAuditLog.
     * @param {AdminAuditLogUpsertArgs} args - Arguments to update or create a AdminAuditLog.
     * @example
     * // Update or create a AdminAuditLog
     * const adminAuditLog = await prisma.adminAuditLog.upsert({
     *   create: {
     *     // ... data to create a AdminAuditLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AdminAuditLog we want to update
     *   }
     * })
     */
    upsert<T extends AdminAuditLogUpsertArgs>(args: SelectSubset<T, AdminAuditLogUpsertArgs<ExtArgs>>): Prisma__AdminAuditLogClient<$Result.GetResult<Prisma.$AdminAuditLogPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of AdminAuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminAuditLogCountArgs} args - Arguments to filter AdminAuditLogs to count.
     * @example
     * // Count the number of AdminAuditLogs
     * const count = await prisma.adminAuditLog.count({
     *   where: {
     *     // ... the filter for the AdminAuditLogs we want to count
     *   }
     * })
    **/
    count<T extends AdminAuditLogCountArgs>(
      args?: Subset<T, AdminAuditLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AdminAuditLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AdminAuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminAuditLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AdminAuditLogAggregateArgs>(args: Subset<T, AdminAuditLogAggregateArgs>): Prisma.PrismaPromise<GetAdminAuditLogAggregateType<T>>

    /**
     * Group by AdminAuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminAuditLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AdminAuditLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AdminAuditLogGroupByArgs['orderBy'] }
        : { orderBy?: AdminAuditLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AdminAuditLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAdminAuditLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AdminAuditLog model
   */
  readonly fields: AdminAuditLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AdminAuditLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AdminAuditLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AdminAuditLog model
   */ 
  interface AdminAuditLogFieldRefs {
    readonly id: FieldRef<"AdminAuditLog", 'String'>
    readonly activity: FieldRef<"AdminAuditLog", 'String'>
    readonly category: FieldRef<"AdminAuditLog", 'String'>
    readonly admin: FieldRef<"AdminAuditLog", 'String'>
    readonly status: FieldRef<"AdminAuditLog", 'String'>
    readonly details: FieldRef<"AdminAuditLog", 'String'>
    readonly ipAddress: FieldRef<"AdminAuditLog", 'String'>
    readonly createdAt: FieldRef<"AdminAuditLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AdminAuditLog findUnique
   */
  export type AdminAuditLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminAuditLog
     */
    select?: AdminAuditLogSelect<ExtArgs> | null
    /**
     * Filter, which AdminAuditLog to fetch.
     */
    where: AdminAuditLogWhereUniqueInput
  }

  /**
   * AdminAuditLog findUniqueOrThrow
   */
  export type AdminAuditLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminAuditLog
     */
    select?: AdminAuditLogSelect<ExtArgs> | null
    /**
     * Filter, which AdminAuditLog to fetch.
     */
    where: AdminAuditLogWhereUniqueInput
  }

  /**
   * AdminAuditLog findFirst
   */
  export type AdminAuditLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminAuditLog
     */
    select?: AdminAuditLogSelect<ExtArgs> | null
    /**
     * Filter, which AdminAuditLog to fetch.
     */
    where?: AdminAuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AdminAuditLogs to fetch.
     */
    orderBy?: AdminAuditLogOrderByWithRelationInput | AdminAuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AdminAuditLogs.
     */
    cursor?: AdminAuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AdminAuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AdminAuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AdminAuditLogs.
     */
    distinct?: AdminAuditLogScalarFieldEnum | AdminAuditLogScalarFieldEnum[]
  }

  /**
   * AdminAuditLog findFirstOrThrow
   */
  export type AdminAuditLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminAuditLog
     */
    select?: AdminAuditLogSelect<ExtArgs> | null
    /**
     * Filter, which AdminAuditLog to fetch.
     */
    where?: AdminAuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AdminAuditLogs to fetch.
     */
    orderBy?: AdminAuditLogOrderByWithRelationInput | AdminAuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AdminAuditLogs.
     */
    cursor?: AdminAuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AdminAuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AdminAuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AdminAuditLogs.
     */
    distinct?: AdminAuditLogScalarFieldEnum | AdminAuditLogScalarFieldEnum[]
  }

  /**
   * AdminAuditLog findMany
   */
  export type AdminAuditLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminAuditLog
     */
    select?: AdminAuditLogSelect<ExtArgs> | null
    /**
     * Filter, which AdminAuditLogs to fetch.
     */
    where?: AdminAuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AdminAuditLogs to fetch.
     */
    orderBy?: AdminAuditLogOrderByWithRelationInput | AdminAuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AdminAuditLogs.
     */
    cursor?: AdminAuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AdminAuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AdminAuditLogs.
     */
    skip?: number
    distinct?: AdminAuditLogScalarFieldEnum | AdminAuditLogScalarFieldEnum[]
  }

  /**
   * AdminAuditLog create
   */
  export type AdminAuditLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminAuditLog
     */
    select?: AdminAuditLogSelect<ExtArgs> | null
    /**
     * The data needed to create a AdminAuditLog.
     */
    data: XOR<AdminAuditLogCreateInput, AdminAuditLogUncheckedCreateInput>
  }

  /**
   * AdminAuditLog createMany
   */
  export type AdminAuditLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AdminAuditLogs.
     */
    data: AdminAuditLogCreateManyInput | AdminAuditLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AdminAuditLog createManyAndReturn
   */
  export type AdminAuditLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminAuditLog
     */
    select?: AdminAuditLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many AdminAuditLogs.
     */
    data: AdminAuditLogCreateManyInput | AdminAuditLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AdminAuditLog update
   */
  export type AdminAuditLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminAuditLog
     */
    select?: AdminAuditLogSelect<ExtArgs> | null
    /**
     * The data needed to update a AdminAuditLog.
     */
    data: XOR<AdminAuditLogUpdateInput, AdminAuditLogUncheckedUpdateInput>
    /**
     * Choose, which AdminAuditLog to update.
     */
    where: AdminAuditLogWhereUniqueInput
  }

  /**
   * AdminAuditLog updateMany
   */
  export type AdminAuditLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AdminAuditLogs.
     */
    data: XOR<AdminAuditLogUpdateManyMutationInput, AdminAuditLogUncheckedUpdateManyInput>
    /**
     * Filter which AdminAuditLogs to update
     */
    where?: AdminAuditLogWhereInput
  }

  /**
   * AdminAuditLog upsert
   */
  export type AdminAuditLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminAuditLog
     */
    select?: AdminAuditLogSelect<ExtArgs> | null
    /**
     * The filter to search for the AdminAuditLog to update in case it exists.
     */
    where: AdminAuditLogWhereUniqueInput
    /**
     * In case the AdminAuditLog found by the `where` argument doesn't exist, create a new AdminAuditLog with this data.
     */
    create: XOR<AdminAuditLogCreateInput, AdminAuditLogUncheckedCreateInput>
    /**
     * In case the AdminAuditLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AdminAuditLogUpdateInput, AdminAuditLogUncheckedUpdateInput>
  }

  /**
   * AdminAuditLog delete
   */
  export type AdminAuditLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminAuditLog
     */
    select?: AdminAuditLogSelect<ExtArgs> | null
    /**
     * Filter which AdminAuditLog to delete.
     */
    where: AdminAuditLogWhereUniqueInput
  }

  /**
   * AdminAuditLog deleteMany
   */
  export type AdminAuditLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AdminAuditLogs to delete
     */
    where?: AdminAuditLogWhereInput
  }

  /**
   * AdminAuditLog without action
   */
  export type AdminAuditLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminAuditLog
     */
    select?: AdminAuditLogSelect<ExtArgs> | null
  }


  /**
   * Model EmailVerification
   */

  export type AggregateEmailVerification = {
    _count: EmailVerificationCountAggregateOutputType | null
    _avg: EmailVerificationAvgAggregateOutputType | null
    _sum: EmailVerificationSumAggregateOutputType | null
    _min: EmailVerificationMinAggregateOutputType | null
    _max: EmailVerificationMaxAggregateOutputType | null
  }

  export type EmailVerificationAvgAggregateOutputType = {
    attempts: number | null
  }

  export type EmailVerificationSumAggregateOutputType = {
    attempts: number | null
  }

  export type EmailVerificationMinAggregateOutputType = {
    id: string | null
    email: string | null
    codeHash: string | null
    attempts: number | null
    expiresAt: Date | null
    verifiedAt: Date | null
    createdAt: Date | null
  }

  export type EmailVerificationMaxAggregateOutputType = {
    id: string | null
    email: string | null
    codeHash: string | null
    attempts: number | null
    expiresAt: Date | null
    verifiedAt: Date | null
    createdAt: Date | null
  }

  export type EmailVerificationCountAggregateOutputType = {
    id: number
    email: number
    codeHash: number
    attempts: number
    expiresAt: number
    verifiedAt: number
    createdAt: number
    _all: number
  }


  export type EmailVerificationAvgAggregateInputType = {
    attempts?: true
  }

  export type EmailVerificationSumAggregateInputType = {
    attempts?: true
  }

  export type EmailVerificationMinAggregateInputType = {
    id?: true
    email?: true
    codeHash?: true
    attempts?: true
    expiresAt?: true
    verifiedAt?: true
    createdAt?: true
  }

  export type EmailVerificationMaxAggregateInputType = {
    id?: true
    email?: true
    codeHash?: true
    attempts?: true
    expiresAt?: true
    verifiedAt?: true
    createdAt?: true
  }

  export type EmailVerificationCountAggregateInputType = {
    id?: true
    email?: true
    codeHash?: true
    attempts?: true
    expiresAt?: true
    verifiedAt?: true
    createdAt?: true
    _all?: true
  }

  export type EmailVerificationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EmailVerification to aggregate.
     */
    where?: EmailVerificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EmailVerifications to fetch.
     */
    orderBy?: EmailVerificationOrderByWithRelationInput | EmailVerificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EmailVerificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EmailVerifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EmailVerifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned EmailVerifications
    **/
    _count?: true | EmailVerificationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: EmailVerificationAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: EmailVerificationSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EmailVerificationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EmailVerificationMaxAggregateInputType
  }

  export type GetEmailVerificationAggregateType<T extends EmailVerificationAggregateArgs> = {
        [P in keyof T & keyof AggregateEmailVerification]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEmailVerification[P]>
      : GetScalarType<T[P], AggregateEmailVerification[P]>
  }




  export type EmailVerificationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EmailVerificationWhereInput
    orderBy?: EmailVerificationOrderByWithAggregationInput | EmailVerificationOrderByWithAggregationInput[]
    by: EmailVerificationScalarFieldEnum[] | EmailVerificationScalarFieldEnum
    having?: EmailVerificationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EmailVerificationCountAggregateInputType | true
    _avg?: EmailVerificationAvgAggregateInputType
    _sum?: EmailVerificationSumAggregateInputType
    _min?: EmailVerificationMinAggregateInputType
    _max?: EmailVerificationMaxAggregateInputType
  }

  export type EmailVerificationGroupByOutputType = {
    id: string
    email: string
    codeHash: string
    attempts: number
    expiresAt: Date
    verifiedAt: Date | null
    createdAt: Date
    _count: EmailVerificationCountAggregateOutputType | null
    _avg: EmailVerificationAvgAggregateOutputType | null
    _sum: EmailVerificationSumAggregateOutputType | null
    _min: EmailVerificationMinAggregateOutputType | null
    _max: EmailVerificationMaxAggregateOutputType | null
  }

  type GetEmailVerificationGroupByPayload<T extends EmailVerificationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EmailVerificationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EmailVerificationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EmailVerificationGroupByOutputType[P]>
            : GetScalarType<T[P], EmailVerificationGroupByOutputType[P]>
        }
      >
    >


  export type EmailVerificationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    codeHash?: boolean
    attempts?: boolean
    expiresAt?: boolean
    verifiedAt?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["emailVerification"]>

  export type EmailVerificationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    codeHash?: boolean
    attempts?: boolean
    expiresAt?: boolean
    verifiedAt?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["emailVerification"]>

  export type EmailVerificationSelectScalar = {
    id?: boolean
    email?: boolean
    codeHash?: boolean
    attempts?: boolean
    expiresAt?: boolean
    verifiedAt?: boolean
    createdAt?: boolean
  }


  export type $EmailVerificationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "EmailVerification"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      codeHash: string
      attempts: number
      expiresAt: Date
      verifiedAt: Date | null
      createdAt: Date
    }, ExtArgs["result"]["emailVerification"]>
    composites: {}
  }

  type EmailVerificationGetPayload<S extends boolean | null | undefined | EmailVerificationDefaultArgs> = $Result.GetResult<Prisma.$EmailVerificationPayload, S>

  type EmailVerificationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<EmailVerificationFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: EmailVerificationCountAggregateInputType | true
    }

  export interface EmailVerificationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['EmailVerification'], meta: { name: 'EmailVerification' } }
    /**
     * Find zero or one EmailVerification that matches the filter.
     * @param {EmailVerificationFindUniqueArgs} args - Arguments to find a EmailVerification
     * @example
     * // Get one EmailVerification
     * const emailVerification = await prisma.emailVerification.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EmailVerificationFindUniqueArgs>(args: SelectSubset<T, EmailVerificationFindUniqueArgs<ExtArgs>>): Prisma__EmailVerificationClient<$Result.GetResult<Prisma.$EmailVerificationPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one EmailVerification that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {EmailVerificationFindUniqueOrThrowArgs} args - Arguments to find a EmailVerification
     * @example
     * // Get one EmailVerification
     * const emailVerification = await prisma.emailVerification.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EmailVerificationFindUniqueOrThrowArgs>(args: SelectSubset<T, EmailVerificationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EmailVerificationClient<$Result.GetResult<Prisma.$EmailVerificationPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first EmailVerification that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmailVerificationFindFirstArgs} args - Arguments to find a EmailVerification
     * @example
     * // Get one EmailVerification
     * const emailVerification = await prisma.emailVerification.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EmailVerificationFindFirstArgs>(args?: SelectSubset<T, EmailVerificationFindFirstArgs<ExtArgs>>): Prisma__EmailVerificationClient<$Result.GetResult<Prisma.$EmailVerificationPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first EmailVerification that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmailVerificationFindFirstOrThrowArgs} args - Arguments to find a EmailVerification
     * @example
     * // Get one EmailVerification
     * const emailVerification = await prisma.emailVerification.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EmailVerificationFindFirstOrThrowArgs>(args?: SelectSubset<T, EmailVerificationFindFirstOrThrowArgs<ExtArgs>>): Prisma__EmailVerificationClient<$Result.GetResult<Prisma.$EmailVerificationPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more EmailVerifications that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmailVerificationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all EmailVerifications
     * const emailVerifications = await prisma.emailVerification.findMany()
     * 
     * // Get first 10 EmailVerifications
     * const emailVerifications = await prisma.emailVerification.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const emailVerificationWithIdOnly = await prisma.emailVerification.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends EmailVerificationFindManyArgs>(args?: SelectSubset<T, EmailVerificationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EmailVerificationPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a EmailVerification.
     * @param {EmailVerificationCreateArgs} args - Arguments to create a EmailVerification.
     * @example
     * // Create one EmailVerification
     * const EmailVerification = await prisma.emailVerification.create({
     *   data: {
     *     // ... data to create a EmailVerification
     *   }
     * })
     * 
     */
    create<T extends EmailVerificationCreateArgs>(args: SelectSubset<T, EmailVerificationCreateArgs<ExtArgs>>): Prisma__EmailVerificationClient<$Result.GetResult<Prisma.$EmailVerificationPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many EmailVerifications.
     * @param {EmailVerificationCreateManyArgs} args - Arguments to create many EmailVerifications.
     * @example
     * // Create many EmailVerifications
     * const emailVerification = await prisma.emailVerification.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EmailVerificationCreateManyArgs>(args?: SelectSubset<T, EmailVerificationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many EmailVerifications and returns the data saved in the database.
     * @param {EmailVerificationCreateManyAndReturnArgs} args - Arguments to create many EmailVerifications.
     * @example
     * // Create many EmailVerifications
     * const emailVerification = await prisma.emailVerification.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many EmailVerifications and only return the `id`
     * const emailVerificationWithIdOnly = await prisma.emailVerification.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends EmailVerificationCreateManyAndReturnArgs>(args?: SelectSubset<T, EmailVerificationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EmailVerificationPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a EmailVerification.
     * @param {EmailVerificationDeleteArgs} args - Arguments to delete one EmailVerification.
     * @example
     * // Delete one EmailVerification
     * const EmailVerification = await prisma.emailVerification.delete({
     *   where: {
     *     // ... filter to delete one EmailVerification
     *   }
     * })
     * 
     */
    delete<T extends EmailVerificationDeleteArgs>(args: SelectSubset<T, EmailVerificationDeleteArgs<ExtArgs>>): Prisma__EmailVerificationClient<$Result.GetResult<Prisma.$EmailVerificationPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one EmailVerification.
     * @param {EmailVerificationUpdateArgs} args - Arguments to update one EmailVerification.
     * @example
     * // Update one EmailVerification
     * const emailVerification = await prisma.emailVerification.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EmailVerificationUpdateArgs>(args: SelectSubset<T, EmailVerificationUpdateArgs<ExtArgs>>): Prisma__EmailVerificationClient<$Result.GetResult<Prisma.$EmailVerificationPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more EmailVerifications.
     * @param {EmailVerificationDeleteManyArgs} args - Arguments to filter EmailVerifications to delete.
     * @example
     * // Delete a few EmailVerifications
     * const { count } = await prisma.emailVerification.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EmailVerificationDeleteManyArgs>(args?: SelectSubset<T, EmailVerificationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more EmailVerifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmailVerificationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many EmailVerifications
     * const emailVerification = await prisma.emailVerification.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EmailVerificationUpdateManyArgs>(args: SelectSubset<T, EmailVerificationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one EmailVerification.
     * @param {EmailVerificationUpsertArgs} args - Arguments to update or create a EmailVerification.
     * @example
     * // Update or create a EmailVerification
     * const emailVerification = await prisma.emailVerification.upsert({
     *   create: {
     *     // ... data to create a EmailVerification
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the EmailVerification we want to update
     *   }
     * })
     */
    upsert<T extends EmailVerificationUpsertArgs>(args: SelectSubset<T, EmailVerificationUpsertArgs<ExtArgs>>): Prisma__EmailVerificationClient<$Result.GetResult<Prisma.$EmailVerificationPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of EmailVerifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmailVerificationCountArgs} args - Arguments to filter EmailVerifications to count.
     * @example
     * // Count the number of EmailVerifications
     * const count = await prisma.emailVerification.count({
     *   where: {
     *     // ... the filter for the EmailVerifications we want to count
     *   }
     * })
    **/
    count<T extends EmailVerificationCountArgs>(
      args?: Subset<T, EmailVerificationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EmailVerificationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a EmailVerification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmailVerificationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends EmailVerificationAggregateArgs>(args: Subset<T, EmailVerificationAggregateArgs>): Prisma.PrismaPromise<GetEmailVerificationAggregateType<T>>

    /**
     * Group by EmailVerification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmailVerificationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends EmailVerificationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EmailVerificationGroupByArgs['orderBy'] }
        : { orderBy?: EmailVerificationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, EmailVerificationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEmailVerificationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the EmailVerification model
   */
  readonly fields: EmailVerificationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for EmailVerification.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EmailVerificationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the EmailVerification model
   */ 
  interface EmailVerificationFieldRefs {
    readonly id: FieldRef<"EmailVerification", 'String'>
    readonly email: FieldRef<"EmailVerification", 'String'>
    readonly codeHash: FieldRef<"EmailVerification", 'String'>
    readonly attempts: FieldRef<"EmailVerification", 'Int'>
    readonly expiresAt: FieldRef<"EmailVerification", 'DateTime'>
    readonly verifiedAt: FieldRef<"EmailVerification", 'DateTime'>
    readonly createdAt: FieldRef<"EmailVerification", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * EmailVerification findUnique
   */
  export type EmailVerificationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailVerification
     */
    select?: EmailVerificationSelect<ExtArgs> | null
    /**
     * Filter, which EmailVerification to fetch.
     */
    where: EmailVerificationWhereUniqueInput
  }

  /**
   * EmailVerification findUniqueOrThrow
   */
  export type EmailVerificationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailVerification
     */
    select?: EmailVerificationSelect<ExtArgs> | null
    /**
     * Filter, which EmailVerification to fetch.
     */
    where: EmailVerificationWhereUniqueInput
  }

  /**
   * EmailVerification findFirst
   */
  export type EmailVerificationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailVerification
     */
    select?: EmailVerificationSelect<ExtArgs> | null
    /**
     * Filter, which EmailVerification to fetch.
     */
    where?: EmailVerificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EmailVerifications to fetch.
     */
    orderBy?: EmailVerificationOrderByWithRelationInput | EmailVerificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EmailVerifications.
     */
    cursor?: EmailVerificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EmailVerifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EmailVerifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EmailVerifications.
     */
    distinct?: EmailVerificationScalarFieldEnum | EmailVerificationScalarFieldEnum[]
  }

  /**
   * EmailVerification findFirstOrThrow
   */
  export type EmailVerificationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailVerification
     */
    select?: EmailVerificationSelect<ExtArgs> | null
    /**
     * Filter, which EmailVerification to fetch.
     */
    where?: EmailVerificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EmailVerifications to fetch.
     */
    orderBy?: EmailVerificationOrderByWithRelationInput | EmailVerificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EmailVerifications.
     */
    cursor?: EmailVerificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EmailVerifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EmailVerifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EmailVerifications.
     */
    distinct?: EmailVerificationScalarFieldEnum | EmailVerificationScalarFieldEnum[]
  }

  /**
   * EmailVerification findMany
   */
  export type EmailVerificationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailVerification
     */
    select?: EmailVerificationSelect<ExtArgs> | null
    /**
     * Filter, which EmailVerifications to fetch.
     */
    where?: EmailVerificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EmailVerifications to fetch.
     */
    orderBy?: EmailVerificationOrderByWithRelationInput | EmailVerificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing EmailVerifications.
     */
    cursor?: EmailVerificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EmailVerifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EmailVerifications.
     */
    skip?: number
    distinct?: EmailVerificationScalarFieldEnum | EmailVerificationScalarFieldEnum[]
  }

  /**
   * EmailVerification create
   */
  export type EmailVerificationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailVerification
     */
    select?: EmailVerificationSelect<ExtArgs> | null
    /**
     * The data needed to create a EmailVerification.
     */
    data: XOR<EmailVerificationCreateInput, EmailVerificationUncheckedCreateInput>
  }

  /**
   * EmailVerification createMany
   */
  export type EmailVerificationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many EmailVerifications.
     */
    data: EmailVerificationCreateManyInput | EmailVerificationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * EmailVerification createManyAndReturn
   */
  export type EmailVerificationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailVerification
     */
    select?: EmailVerificationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many EmailVerifications.
     */
    data: EmailVerificationCreateManyInput | EmailVerificationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * EmailVerification update
   */
  export type EmailVerificationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailVerification
     */
    select?: EmailVerificationSelect<ExtArgs> | null
    /**
     * The data needed to update a EmailVerification.
     */
    data: XOR<EmailVerificationUpdateInput, EmailVerificationUncheckedUpdateInput>
    /**
     * Choose, which EmailVerification to update.
     */
    where: EmailVerificationWhereUniqueInput
  }

  /**
   * EmailVerification updateMany
   */
  export type EmailVerificationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update EmailVerifications.
     */
    data: XOR<EmailVerificationUpdateManyMutationInput, EmailVerificationUncheckedUpdateManyInput>
    /**
     * Filter which EmailVerifications to update
     */
    where?: EmailVerificationWhereInput
  }

  /**
   * EmailVerification upsert
   */
  export type EmailVerificationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailVerification
     */
    select?: EmailVerificationSelect<ExtArgs> | null
    /**
     * The filter to search for the EmailVerification to update in case it exists.
     */
    where: EmailVerificationWhereUniqueInput
    /**
     * In case the EmailVerification found by the `where` argument doesn't exist, create a new EmailVerification with this data.
     */
    create: XOR<EmailVerificationCreateInput, EmailVerificationUncheckedCreateInput>
    /**
     * In case the EmailVerification was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EmailVerificationUpdateInput, EmailVerificationUncheckedUpdateInput>
  }

  /**
   * EmailVerification delete
   */
  export type EmailVerificationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailVerification
     */
    select?: EmailVerificationSelect<ExtArgs> | null
    /**
     * Filter which EmailVerification to delete.
     */
    where: EmailVerificationWhereUniqueInput
  }

  /**
   * EmailVerification deleteMany
   */
  export type EmailVerificationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EmailVerifications to delete
     */
    where?: EmailVerificationWhereInput
  }

  /**
   * EmailVerification without action
   */
  export type EmailVerificationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailVerification
     */
    select?: EmailVerificationSelect<ExtArgs> | null
  }


  /**
   * Model PasswordReset
   */

  export type AggregatePasswordReset = {
    _count: PasswordResetCountAggregateOutputType | null
    _min: PasswordResetMinAggregateOutputType | null
    _max: PasswordResetMaxAggregateOutputType | null
  }

  export type PasswordResetMinAggregateOutputType = {
    id: string | null
    email: string | null
    tokenHash: string | null
    expiresAt: Date | null
    usedAt: Date | null
    createdAt: Date | null
  }

  export type PasswordResetMaxAggregateOutputType = {
    id: string | null
    email: string | null
    tokenHash: string | null
    expiresAt: Date | null
    usedAt: Date | null
    createdAt: Date | null
  }

  export type PasswordResetCountAggregateOutputType = {
    id: number
    email: number
    tokenHash: number
    expiresAt: number
    usedAt: number
    createdAt: number
    _all: number
  }


  export type PasswordResetMinAggregateInputType = {
    id?: true
    email?: true
    tokenHash?: true
    expiresAt?: true
    usedAt?: true
    createdAt?: true
  }

  export type PasswordResetMaxAggregateInputType = {
    id?: true
    email?: true
    tokenHash?: true
    expiresAt?: true
    usedAt?: true
    createdAt?: true
  }

  export type PasswordResetCountAggregateInputType = {
    id?: true
    email?: true
    tokenHash?: true
    expiresAt?: true
    usedAt?: true
    createdAt?: true
    _all?: true
  }

  export type PasswordResetAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PasswordReset to aggregate.
     */
    where?: PasswordResetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PasswordResets to fetch.
     */
    orderBy?: PasswordResetOrderByWithRelationInput | PasswordResetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PasswordResetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PasswordResets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PasswordResets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PasswordResets
    **/
    _count?: true | PasswordResetCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PasswordResetMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PasswordResetMaxAggregateInputType
  }

  export type GetPasswordResetAggregateType<T extends PasswordResetAggregateArgs> = {
        [P in keyof T & keyof AggregatePasswordReset]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePasswordReset[P]>
      : GetScalarType<T[P], AggregatePasswordReset[P]>
  }




  export type PasswordResetGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PasswordResetWhereInput
    orderBy?: PasswordResetOrderByWithAggregationInput | PasswordResetOrderByWithAggregationInput[]
    by: PasswordResetScalarFieldEnum[] | PasswordResetScalarFieldEnum
    having?: PasswordResetScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PasswordResetCountAggregateInputType | true
    _min?: PasswordResetMinAggregateInputType
    _max?: PasswordResetMaxAggregateInputType
  }

  export type PasswordResetGroupByOutputType = {
    id: string
    email: string
    tokenHash: string
    expiresAt: Date
    usedAt: Date | null
    createdAt: Date
    _count: PasswordResetCountAggregateOutputType | null
    _min: PasswordResetMinAggregateOutputType | null
    _max: PasswordResetMaxAggregateOutputType | null
  }

  type GetPasswordResetGroupByPayload<T extends PasswordResetGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PasswordResetGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PasswordResetGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PasswordResetGroupByOutputType[P]>
            : GetScalarType<T[P], PasswordResetGroupByOutputType[P]>
        }
      >
    >


  export type PasswordResetSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    tokenHash?: boolean
    expiresAt?: boolean
    usedAt?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["passwordReset"]>

  export type PasswordResetSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    tokenHash?: boolean
    expiresAt?: boolean
    usedAt?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["passwordReset"]>

  export type PasswordResetSelectScalar = {
    id?: boolean
    email?: boolean
    tokenHash?: boolean
    expiresAt?: boolean
    usedAt?: boolean
    createdAt?: boolean
  }


  export type $PasswordResetPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PasswordReset"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      tokenHash: string
      expiresAt: Date
      usedAt: Date | null
      createdAt: Date
    }, ExtArgs["result"]["passwordReset"]>
    composites: {}
  }

  type PasswordResetGetPayload<S extends boolean | null | undefined | PasswordResetDefaultArgs> = $Result.GetResult<Prisma.$PasswordResetPayload, S>

  type PasswordResetCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<PasswordResetFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: PasswordResetCountAggregateInputType | true
    }

  export interface PasswordResetDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PasswordReset'], meta: { name: 'PasswordReset' } }
    /**
     * Find zero or one PasswordReset that matches the filter.
     * @param {PasswordResetFindUniqueArgs} args - Arguments to find a PasswordReset
     * @example
     * // Get one PasswordReset
     * const passwordReset = await prisma.passwordReset.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PasswordResetFindUniqueArgs>(args: SelectSubset<T, PasswordResetFindUniqueArgs<ExtArgs>>): Prisma__PasswordResetClient<$Result.GetResult<Prisma.$PasswordResetPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one PasswordReset that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {PasswordResetFindUniqueOrThrowArgs} args - Arguments to find a PasswordReset
     * @example
     * // Get one PasswordReset
     * const passwordReset = await prisma.passwordReset.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PasswordResetFindUniqueOrThrowArgs>(args: SelectSubset<T, PasswordResetFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PasswordResetClient<$Result.GetResult<Prisma.$PasswordResetPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first PasswordReset that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordResetFindFirstArgs} args - Arguments to find a PasswordReset
     * @example
     * // Get one PasswordReset
     * const passwordReset = await prisma.passwordReset.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PasswordResetFindFirstArgs>(args?: SelectSubset<T, PasswordResetFindFirstArgs<ExtArgs>>): Prisma__PasswordResetClient<$Result.GetResult<Prisma.$PasswordResetPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first PasswordReset that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordResetFindFirstOrThrowArgs} args - Arguments to find a PasswordReset
     * @example
     * // Get one PasswordReset
     * const passwordReset = await prisma.passwordReset.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PasswordResetFindFirstOrThrowArgs>(args?: SelectSubset<T, PasswordResetFindFirstOrThrowArgs<ExtArgs>>): Prisma__PasswordResetClient<$Result.GetResult<Prisma.$PasswordResetPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more PasswordResets that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordResetFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PasswordResets
     * const passwordResets = await prisma.passwordReset.findMany()
     * 
     * // Get first 10 PasswordResets
     * const passwordResets = await prisma.passwordReset.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const passwordResetWithIdOnly = await prisma.passwordReset.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PasswordResetFindManyArgs>(args?: SelectSubset<T, PasswordResetFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PasswordResetPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a PasswordReset.
     * @param {PasswordResetCreateArgs} args - Arguments to create a PasswordReset.
     * @example
     * // Create one PasswordReset
     * const PasswordReset = await prisma.passwordReset.create({
     *   data: {
     *     // ... data to create a PasswordReset
     *   }
     * })
     * 
     */
    create<T extends PasswordResetCreateArgs>(args: SelectSubset<T, PasswordResetCreateArgs<ExtArgs>>): Prisma__PasswordResetClient<$Result.GetResult<Prisma.$PasswordResetPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many PasswordResets.
     * @param {PasswordResetCreateManyArgs} args - Arguments to create many PasswordResets.
     * @example
     * // Create many PasswordResets
     * const passwordReset = await prisma.passwordReset.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PasswordResetCreateManyArgs>(args?: SelectSubset<T, PasswordResetCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PasswordResets and returns the data saved in the database.
     * @param {PasswordResetCreateManyAndReturnArgs} args - Arguments to create many PasswordResets.
     * @example
     * // Create many PasswordResets
     * const passwordReset = await prisma.passwordReset.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PasswordResets and only return the `id`
     * const passwordResetWithIdOnly = await prisma.passwordReset.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PasswordResetCreateManyAndReturnArgs>(args?: SelectSubset<T, PasswordResetCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PasswordResetPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a PasswordReset.
     * @param {PasswordResetDeleteArgs} args - Arguments to delete one PasswordReset.
     * @example
     * // Delete one PasswordReset
     * const PasswordReset = await prisma.passwordReset.delete({
     *   where: {
     *     // ... filter to delete one PasswordReset
     *   }
     * })
     * 
     */
    delete<T extends PasswordResetDeleteArgs>(args: SelectSubset<T, PasswordResetDeleteArgs<ExtArgs>>): Prisma__PasswordResetClient<$Result.GetResult<Prisma.$PasswordResetPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one PasswordReset.
     * @param {PasswordResetUpdateArgs} args - Arguments to update one PasswordReset.
     * @example
     * // Update one PasswordReset
     * const passwordReset = await prisma.passwordReset.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PasswordResetUpdateArgs>(args: SelectSubset<T, PasswordResetUpdateArgs<ExtArgs>>): Prisma__PasswordResetClient<$Result.GetResult<Prisma.$PasswordResetPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more PasswordResets.
     * @param {PasswordResetDeleteManyArgs} args - Arguments to filter PasswordResets to delete.
     * @example
     * // Delete a few PasswordResets
     * const { count } = await prisma.passwordReset.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PasswordResetDeleteManyArgs>(args?: SelectSubset<T, PasswordResetDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PasswordResets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordResetUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PasswordResets
     * const passwordReset = await prisma.passwordReset.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PasswordResetUpdateManyArgs>(args: SelectSubset<T, PasswordResetUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one PasswordReset.
     * @param {PasswordResetUpsertArgs} args - Arguments to update or create a PasswordReset.
     * @example
     * // Update or create a PasswordReset
     * const passwordReset = await prisma.passwordReset.upsert({
     *   create: {
     *     // ... data to create a PasswordReset
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PasswordReset we want to update
     *   }
     * })
     */
    upsert<T extends PasswordResetUpsertArgs>(args: SelectSubset<T, PasswordResetUpsertArgs<ExtArgs>>): Prisma__PasswordResetClient<$Result.GetResult<Prisma.$PasswordResetPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of PasswordResets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordResetCountArgs} args - Arguments to filter PasswordResets to count.
     * @example
     * // Count the number of PasswordResets
     * const count = await prisma.passwordReset.count({
     *   where: {
     *     // ... the filter for the PasswordResets we want to count
     *   }
     * })
    **/
    count<T extends PasswordResetCountArgs>(
      args?: Subset<T, PasswordResetCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PasswordResetCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PasswordReset.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordResetAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PasswordResetAggregateArgs>(args: Subset<T, PasswordResetAggregateArgs>): Prisma.PrismaPromise<GetPasswordResetAggregateType<T>>

    /**
     * Group by PasswordReset.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordResetGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PasswordResetGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PasswordResetGroupByArgs['orderBy'] }
        : { orderBy?: PasswordResetGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PasswordResetGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPasswordResetGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PasswordReset model
   */
  readonly fields: PasswordResetFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PasswordReset.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PasswordResetClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PasswordReset model
   */ 
  interface PasswordResetFieldRefs {
    readonly id: FieldRef<"PasswordReset", 'String'>
    readonly email: FieldRef<"PasswordReset", 'String'>
    readonly tokenHash: FieldRef<"PasswordReset", 'String'>
    readonly expiresAt: FieldRef<"PasswordReset", 'DateTime'>
    readonly usedAt: FieldRef<"PasswordReset", 'DateTime'>
    readonly createdAt: FieldRef<"PasswordReset", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PasswordReset findUnique
   */
  export type PasswordResetFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordReset
     */
    select?: PasswordResetSelect<ExtArgs> | null
    /**
     * Filter, which PasswordReset to fetch.
     */
    where: PasswordResetWhereUniqueInput
  }

  /**
   * PasswordReset findUniqueOrThrow
   */
  export type PasswordResetFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordReset
     */
    select?: PasswordResetSelect<ExtArgs> | null
    /**
     * Filter, which PasswordReset to fetch.
     */
    where: PasswordResetWhereUniqueInput
  }

  /**
   * PasswordReset findFirst
   */
  export type PasswordResetFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordReset
     */
    select?: PasswordResetSelect<ExtArgs> | null
    /**
     * Filter, which PasswordReset to fetch.
     */
    where?: PasswordResetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PasswordResets to fetch.
     */
    orderBy?: PasswordResetOrderByWithRelationInput | PasswordResetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PasswordResets.
     */
    cursor?: PasswordResetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PasswordResets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PasswordResets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PasswordResets.
     */
    distinct?: PasswordResetScalarFieldEnum | PasswordResetScalarFieldEnum[]
  }

  /**
   * PasswordReset findFirstOrThrow
   */
  export type PasswordResetFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordReset
     */
    select?: PasswordResetSelect<ExtArgs> | null
    /**
     * Filter, which PasswordReset to fetch.
     */
    where?: PasswordResetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PasswordResets to fetch.
     */
    orderBy?: PasswordResetOrderByWithRelationInput | PasswordResetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PasswordResets.
     */
    cursor?: PasswordResetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PasswordResets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PasswordResets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PasswordResets.
     */
    distinct?: PasswordResetScalarFieldEnum | PasswordResetScalarFieldEnum[]
  }

  /**
   * PasswordReset findMany
   */
  export type PasswordResetFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordReset
     */
    select?: PasswordResetSelect<ExtArgs> | null
    /**
     * Filter, which PasswordResets to fetch.
     */
    where?: PasswordResetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PasswordResets to fetch.
     */
    orderBy?: PasswordResetOrderByWithRelationInput | PasswordResetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PasswordResets.
     */
    cursor?: PasswordResetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PasswordResets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PasswordResets.
     */
    skip?: number
    distinct?: PasswordResetScalarFieldEnum | PasswordResetScalarFieldEnum[]
  }

  /**
   * PasswordReset create
   */
  export type PasswordResetCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordReset
     */
    select?: PasswordResetSelect<ExtArgs> | null
    /**
     * The data needed to create a PasswordReset.
     */
    data: XOR<PasswordResetCreateInput, PasswordResetUncheckedCreateInput>
  }

  /**
   * PasswordReset createMany
   */
  export type PasswordResetCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PasswordResets.
     */
    data: PasswordResetCreateManyInput | PasswordResetCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PasswordReset createManyAndReturn
   */
  export type PasswordResetCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordReset
     */
    select?: PasswordResetSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many PasswordResets.
     */
    data: PasswordResetCreateManyInput | PasswordResetCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PasswordReset update
   */
  export type PasswordResetUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordReset
     */
    select?: PasswordResetSelect<ExtArgs> | null
    /**
     * The data needed to update a PasswordReset.
     */
    data: XOR<PasswordResetUpdateInput, PasswordResetUncheckedUpdateInput>
    /**
     * Choose, which PasswordReset to update.
     */
    where: PasswordResetWhereUniqueInput
  }

  /**
   * PasswordReset updateMany
   */
  export type PasswordResetUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PasswordResets.
     */
    data: XOR<PasswordResetUpdateManyMutationInput, PasswordResetUncheckedUpdateManyInput>
    /**
     * Filter which PasswordResets to update
     */
    where?: PasswordResetWhereInput
  }

  /**
   * PasswordReset upsert
   */
  export type PasswordResetUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordReset
     */
    select?: PasswordResetSelect<ExtArgs> | null
    /**
     * The filter to search for the PasswordReset to update in case it exists.
     */
    where: PasswordResetWhereUniqueInput
    /**
     * In case the PasswordReset found by the `where` argument doesn't exist, create a new PasswordReset with this data.
     */
    create: XOR<PasswordResetCreateInput, PasswordResetUncheckedCreateInput>
    /**
     * In case the PasswordReset was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PasswordResetUpdateInput, PasswordResetUncheckedUpdateInput>
  }

  /**
   * PasswordReset delete
   */
  export type PasswordResetDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordReset
     */
    select?: PasswordResetSelect<ExtArgs> | null
    /**
     * Filter which PasswordReset to delete.
     */
    where: PasswordResetWhereUniqueInput
  }

  /**
   * PasswordReset deleteMany
   */
  export type PasswordResetDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PasswordResets to delete
     */
    where?: PasswordResetWhereInput
  }

  /**
   * PasswordReset without action
   */
  export type PasswordResetDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordReset
     */
    select?: PasswordResetSelect<ExtArgs> | null
  }


  /**
   * Model EmailNotificationLog
   */

  export type AggregateEmailNotificationLog = {
    _count: EmailNotificationLogCountAggregateOutputType | null
    _avg: EmailNotificationLogAvgAggregateOutputType | null
    _sum: EmailNotificationLogSumAggregateOutputType | null
    _min: EmailNotificationLogMinAggregateOutputType | null
    _max: EmailNotificationLogMaxAggregateOutputType | null
  }

  export type EmailNotificationLogAvgAggregateOutputType = {
    inquiryId: number | null
  }

  export type EmailNotificationLogSumAggregateOutputType = {
    inquiryId: number | null
  }

  export type EmailNotificationLogMinAggregateOutputType = {
    id: string | null
    inquiryId: number | null
    inquiryAppId: string | null
    recipient: string | null
    emailType: string | null
    subject: string | null
    status: string | null
    sentAt: Date | null
    errorMessage: string | null
    createdAt: Date | null
  }

  export type EmailNotificationLogMaxAggregateOutputType = {
    id: string | null
    inquiryId: number | null
    inquiryAppId: string | null
    recipient: string | null
    emailType: string | null
    subject: string | null
    status: string | null
    sentAt: Date | null
    errorMessage: string | null
    createdAt: Date | null
  }

  export type EmailNotificationLogCountAggregateOutputType = {
    id: number
    inquiryId: number
    inquiryAppId: number
    recipient: number
    emailType: number
    subject: number
    status: number
    sentAt: number
    errorMessage: number
    createdAt: number
    _all: number
  }


  export type EmailNotificationLogAvgAggregateInputType = {
    inquiryId?: true
  }

  export type EmailNotificationLogSumAggregateInputType = {
    inquiryId?: true
  }

  export type EmailNotificationLogMinAggregateInputType = {
    id?: true
    inquiryId?: true
    inquiryAppId?: true
    recipient?: true
    emailType?: true
    subject?: true
    status?: true
    sentAt?: true
    errorMessage?: true
    createdAt?: true
  }

  export type EmailNotificationLogMaxAggregateInputType = {
    id?: true
    inquiryId?: true
    inquiryAppId?: true
    recipient?: true
    emailType?: true
    subject?: true
    status?: true
    sentAt?: true
    errorMessage?: true
    createdAt?: true
  }

  export type EmailNotificationLogCountAggregateInputType = {
    id?: true
    inquiryId?: true
    inquiryAppId?: true
    recipient?: true
    emailType?: true
    subject?: true
    status?: true
    sentAt?: true
    errorMessage?: true
    createdAt?: true
    _all?: true
  }

  export type EmailNotificationLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EmailNotificationLog to aggregate.
     */
    where?: EmailNotificationLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EmailNotificationLogs to fetch.
     */
    orderBy?: EmailNotificationLogOrderByWithRelationInput | EmailNotificationLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EmailNotificationLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EmailNotificationLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EmailNotificationLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned EmailNotificationLogs
    **/
    _count?: true | EmailNotificationLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: EmailNotificationLogAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: EmailNotificationLogSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EmailNotificationLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EmailNotificationLogMaxAggregateInputType
  }

  export type GetEmailNotificationLogAggregateType<T extends EmailNotificationLogAggregateArgs> = {
        [P in keyof T & keyof AggregateEmailNotificationLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEmailNotificationLog[P]>
      : GetScalarType<T[P], AggregateEmailNotificationLog[P]>
  }




  export type EmailNotificationLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EmailNotificationLogWhereInput
    orderBy?: EmailNotificationLogOrderByWithAggregationInput | EmailNotificationLogOrderByWithAggregationInput[]
    by: EmailNotificationLogScalarFieldEnum[] | EmailNotificationLogScalarFieldEnum
    having?: EmailNotificationLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EmailNotificationLogCountAggregateInputType | true
    _avg?: EmailNotificationLogAvgAggregateInputType
    _sum?: EmailNotificationLogSumAggregateInputType
    _min?: EmailNotificationLogMinAggregateInputType
    _max?: EmailNotificationLogMaxAggregateInputType
  }

  export type EmailNotificationLogGroupByOutputType = {
    id: string
    inquiryId: number | null
    inquiryAppId: string | null
    recipient: string
    emailType: string
    subject: string
    status: string
    sentAt: Date | null
    errorMessage: string | null
    createdAt: Date
    _count: EmailNotificationLogCountAggregateOutputType | null
    _avg: EmailNotificationLogAvgAggregateOutputType | null
    _sum: EmailNotificationLogSumAggregateOutputType | null
    _min: EmailNotificationLogMinAggregateOutputType | null
    _max: EmailNotificationLogMaxAggregateOutputType | null
  }

  type GetEmailNotificationLogGroupByPayload<T extends EmailNotificationLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EmailNotificationLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EmailNotificationLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EmailNotificationLogGroupByOutputType[P]>
            : GetScalarType<T[P], EmailNotificationLogGroupByOutputType[P]>
        }
      >
    >


  export type EmailNotificationLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    inquiryId?: boolean
    inquiryAppId?: boolean
    recipient?: boolean
    emailType?: boolean
    subject?: boolean
    status?: boolean
    sentAt?: boolean
    errorMessage?: boolean
    createdAt?: boolean
    inquiry?: boolean | EmailNotificationLog$inquiryArgs<ExtArgs>
  }, ExtArgs["result"]["emailNotificationLog"]>

  export type EmailNotificationLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    inquiryId?: boolean
    inquiryAppId?: boolean
    recipient?: boolean
    emailType?: boolean
    subject?: boolean
    status?: boolean
    sentAt?: boolean
    errorMessage?: boolean
    createdAt?: boolean
    inquiry?: boolean | EmailNotificationLog$inquiryArgs<ExtArgs>
  }, ExtArgs["result"]["emailNotificationLog"]>

  export type EmailNotificationLogSelectScalar = {
    id?: boolean
    inquiryId?: boolean
    inquiryAppId?: boolean
    recipient?: boolean
    emailType?: boolean
    subject?: boolean
    status?: boolean
    sentAt?: boolean
    errorMessage?: boolean
    createdAt?: boolean
  }

  export type EmailNotificationLogInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    inquiry?: boolean | EmailNotificationLog$inquiryArgs<ExtArgs>
  }
  export type EmailNotificationLogIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    inquiry?: boolean | EmailNotificationLog$inquiryArgs<ExtArgs>
  }

  export type $EmailNotificationLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "EmailNotificationLog"
    objects: {
      inquiry: Prisma.$InquiriesPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      inquiryId: number | null
      inquiryAppId: string | null
      recipient: string
      emailType: string
      subject: string
      status: string
      sentAt: Date | null
      errorMessage: string | null
      createdAt: Date
    }, ExtArgs["result"]["emailNotificationLog"]>
    composites: {}
  }

  type EmailNotificationLogGetPayload<S extends boolean | null | undefined | EmailNotificationLogDefaultArgs> = $Result.GetResult<Prisma.$EmailNotificationLogPayload, S>

  type EmailNotificationLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<EmailNotificationLogFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: EmailNotificationLogCountAggregateInputType | true
    }

  export interface EmailNotificationLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['EmailNotificationLog'], meta: { name: 'EmailNotificationLog' } }
    /**
     * Find zero or one EmailNotificationLog that matches the filter.
     * @param {EmailNotificationLogFindUniqueArgs} args - Arguments to find a EmailNotificationLog
     * @example
     * // Get one EmailNotificationLog
     * const emailNotificationLog = await prisma.emailNotificationLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EmailNotificationLogFindUniqueArgs>(args: SelectSubset<T, EmailNotificationLogFindUniqueArgs<ExtArgs>>): Prisma__EmailNotificationLogClient<$Result.GetResult<Prisma.$EmailNotificationLogPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one EmailNotificationLog that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {EmailNotificationLogFindUniqueOrThrowArgs} args - Arguments to find a EmailNotificationLog
     * @example
     * // Get one EmailNotificationLog
     * const emailNotificationLog = await prisma.emailNotificationLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EmailNotificationLogFindUniqueOrThrowArgs>(args: SelectSubset<T, EmailNotificationLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EmailNotificationLogClient<$Result.GetResult<Prisma.$EmailNotificationLogPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first EmailNotificationLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmailNotificationLogFindFirstArgs} args - Arguments to find a EmailNotificationLog
     * @example
     * // Get one EmailNotificationLog
     * const emailNotificationLog = await prisma.emailNotificationLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EmailNotificationLogFindFirstArgs>(args?: SelectSubset<T, EmailNotificationLogFindFirstArgs<ExtArgs>>): Prisma__EmailNotificationLogClient<$Result.GetResult<Prisma.$EmailNotificationLogPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first EmailNotificationLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmailNotificationLogFindFirstOrThrowArgs} args - Arguments to find a EmailNotificationLog
     * @example
     * // Get one EmailNotificationLog
     * const emailNotificationLog = await prisma.emailNotificationLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EmailNotificationLogFindFirstOrThrowArgs>(args?: SelectSubset<T, EmailNotificationLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__EmailNotificationLogClient<$Result.GetResult<Prisma.$EmailNotificationLogPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more EmailNotificationLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmailNotificationLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all EmailNotificationLogs
     * const emailNotificationLogs = await prisma.emailNotificationLog.findMany()
     * 
     * // Get first 10 EmailNotificationLogs
     * const emailNotificationLogs = await prisma.emailNotificationLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const emailNotificationLogWithIdOnly = await prisma.emailNotificationLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends EmailNotificationLogFindManyArgs>(args?: SelectSubset<T, EmailNotificationLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EmailNotificationLogPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a EmailNotificationLog.
     * @param {EmailNotificationLogCreateArgs} args - Arguments to create a EmailNotificationLog.
     * @example
     * // Create one EmailNotificationLog
     * const EmailNotificationLog = await prisma.emailNotificationLog.create({
     *   data: {
     *     // ... data to create a EmailNotificationLog
     *   }
     * })
     * 
     */
    create<T extends EmailNotificationLogCreateArgs>(args: SelectSubset<T, EmailNotificationLogCreateArgs<ExtArgs>>): Prisma__EmailNotificationLogClient<$Result.GetResult<Prisma.$EmailNotificationLogPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many EmailNotificationLogs.
     * @param {EmailNotificationLogCreateManyArgs} args - Arguments to create many EmailNotificationLogs.
     * @example
     * // Create many EmailNotificationLogs
     * const emailNotificationLog = await prisma.emailNotificationLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EmailNotificationLogCreateManyArgs>(args?: SelectSubset<T, EmailNotificationLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many EmailNotificationLogs and returns the data saved in the database.
     * @param {EmailNotificationLogCreateManyAndReturnArgs} args - Arguments to create many EmailNotificationLogs.
     * @example
     * // Create many EmailNotificationLogs
     * const emailNotificationLog = await prisma.emailNotificationLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many EmailNotificationLogs and only return the `id`
     * const emailNotificationLogWithIdOnly = await prisma.emailNotificationLog.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends EmailNotificationLogCreateManyAndReturnArgs>(args?: SelectSubset<T, EmailNotificationLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EmailNotificationLogPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a EmailNotificationLog.
     * @param {EmailNotificationLogDeleteArgs} args - Arguments to delete one EmailNotificationLog.
     * @example
     * // Delete one EmailNotificationLog
     * const EmailNotificationLog = await prisma.emailNotificationLog.delete({
     *   where: {
     *     // ... filter to delete one EmailNotificationLog
     *   }
     * })
     * 
     */
    delete<T extends EmailNotificationLogDeleteArgs>(args: SelectSubset<T, EmailNotificationLogDeleteArgs<ExtArgs>>): Prisma__EmailNotificationLogClient<$Result.GetResult<Prisma.$EmailNotificationLogPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one EmailNotificationLog.
     * @param {EmailNotificationLogUpdateArgs} args - Arguments to update one EmailNotificationLog.
     * @example
     * // Update one EmailNotificationLog
     * const emailNotificationLog = await prisma.emailNotificationLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EmailNotificationLogUpdateArgs>(args: SelectSubset<T, EmailNotificationLogUpdateArgs<ExtArgs>>): Prisma__EmailNotificationLogClient<$Result.GetResult<Prisma.$EmailNotificationLogPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more EmailNotificationLogs.
     * @param {EmailNotificationLogDeleteManyArgs} args - Arguments to filter EmailNotificationLogs to delete.
     * @example
     * // Delete a few EmailNotificationLogs
     * const { count } = await prisma.emailNotificationLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EmailNotificationLogDeleteManyArgs>(args?: SelectSubset<T, EmailNotificationLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more EmailNotificationLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmailNotificationLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many EmailNotificationLogs
     * const emailNotificationLog = await prisma.emailNotificationLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EmailNotificationLogUpdateManyArgs>(args: SelectSubset<T, EmailNotificationLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one EmailNotificationLog.
     * @param {EmailNotificationLogUpsertArgs} args - Arguments to update or create a EmailNotificationLog.
     * @example
     * // Update or create a EmailNotificationLog
     * const emailNotificationLog = await prisma.emailNotificationLog.upsert({
     *   create: {
     *     // ... data to create a EmailNotificationLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the EmailNotificationLog we want to update
     *   }
     * })
     */
    upsert<T extends EmailNotificationLogUpsertArgs>(args: SelectSubset<T, EmailNotificationLogUpsertArgs<ExtArgs>>): Prisma__EmailNotificationLogClient<$Result.GetResult<Prisma.$EmailNotificationLogPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of EmailNotificationLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmailNotificationLogCountArgs} args - Arguments to filter EmailNotificationLogs to count.
     * @example
     * // Count the number of EmailNotificationLogs
     * const count = await prisma.emailNotificationLog.count({
     *   where: {
     *     // ... the filter for the EmailNotificationLogs we want to count
     *   }
     * })
    **/
    count<T extends EmailNotificationLogCountArgs>(
      args?: Subset<T, EmailNotificationLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EmailNotificationLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a EmailNotificationLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmailNotificationLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends EmailNotificationLogAggregateArgs>(args: Subset<T, EmailNotificationLogAggregateArgs>): Prisma.PrismaPromise<GetEmailNotificationLogAggregateType<T>>

    /**
     * Group by EmailNotificationLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmailNotificationLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends EmailNotificationLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EmailNotificationLogGroupByArgs['orderBy'] }
        : { orderBy?: EmailNotificationLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, EmailNotificationLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEmailNotificationLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the EmailNotificationLog model
   */
  readonly fields: EmailNotificationLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for EmailNotificationLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EmailNotificationLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    inquiry<T extends EmailNotificationLog$inquiryArgs<ExtArgs> = {}>(args?: Subset<T, EmailNotificationLog$inquiryArgs<ExtArgs>>): Prisma__InquiriesClient<$Result.GetResult<Prisma.$InquiriesPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the EmailNotificationLog model
   */ 
  interface EmailNotificationLogFieldRefs {
    readonly id: FieldRef<"EmailNotificationLog", 'String'>
    readonly inquiryId: FieldRef<"EmailNotificationLog", 'Int'>
    readonly inquiryAppId: FieldRef<"EmailNotificationLog", 'String'>
    readonly recipient: FieldRef<"EmailNotificationLog", 'String'>
    readonly emailType: FieldRef<"EmailNotificationLog", 'String'>
    readonly subject: FieldRef<"EmailNotificationLog", 'String'>
    readonly status: FieldRef<"EmailNotificationLog", 'String'>
    readonly sentAt: FieldRef<"EmailNotificationLog", 'DateTime'>
    readonly errorMessage: FieldRef<"EmailNotificationLog", 'String'>
    readonly createdAt: FieldRef<"EmailNotificationLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * EmailNotificationLog findUnique
   */
  export type EmailNotificationLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailNotificationLog
     */
    select?: EmailNotificationLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmailNotificationLogInclude<ExtArgs> | null
    /**
     * Filter, which EmailNotificationLog to fetch.
     */
    where: EmailNotificationLogWhereUniqueInput
  }

  /**
   * EmailNotificationLog findUniqueOrThrow
   */
  export type EmailNotificationLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailNotificationLog
     */
    select?: EmailNotificationLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmailNotificationLogInclude<ExtArgs> | null
    /**
     * Filter, which EmailNotificationLog to fetch.
     */
    where: EmailNotificationLogWhereUniqueInput
  }

  /**
   * EmailNotificationLog findFirst
   */
  export type EmailNotificationLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailNotificationLog
     */
    select?: EmailNotificationLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmailNotificationLogInclude<ExtArgs> | null
    /**
     * Filter, which EmailNotificationLog to fetch.
     */
    where?: EmailNotificationLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EmailNotificationLogs to fetch.
     */
    orderBy?: EmailNotificationLogOrderByWithRelationInput | EmailNotificationLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EmailNotificationLogs.
     */
    cursor?: EmailNotificationLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EmailNotificationLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EmailNotificationLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EmailNotificationLogs.
     */
    distinct?: EmailNotificationLogScalarFieldEnum | EmailNotificationLogScalarFieldEnum[]
  }

  /**
   * EmailNotificationLog findFirstOrThrow
   */
  export type EmailNotificationLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailNotificationLog
     */
    select?: EmailNotificationLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmailNotificationLogInclude<ExtArgs> | null
    /**
     * Filter, which EmailNotificationLog to fetch.
     */
    where?: EmailNotificationLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EmailNotificationLogs to fetch.
     */
    orderBy?: EmailNotificationLogOrderByWithRelationInput | EmailNotificationLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EmailNotificationLogs.
     */
    cursor?: EmailNotificationLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EmailNotificationLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EmailNotificationLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EmailNotificationLogs.
     */
    distinct?: EmailNotificationLogScalarFieldEnum | EmailNotificationLogScalarFieldEnum[]
  }

  /**
   * EmailNotificationLog findMany
   */
  export type EmailNotificationLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailNotificationLog
     */
    select?: EmailNotificationLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmailNotificationLogInclude<ExtArgs> | null
    /**
     * Filter, which EmailNotificationLogs to fetch.
     */
    where?: EmailNotificationLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EmailNotificationLogs to fetch.
     */
    orderBy?: EmailNotificationLogOrderByWithRelationInput | EmailNotificationLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing EmailNotificationLogs.
     */
    cursor?: EmailNotificationLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EmailNotificationLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EmailNotificationLogs.
     */
    skip?: number
    distinct?: EmailNotificationLogScalarFieldEnum | EmailNotificationLogScalarFieldEnum[]
  }

  /**
   * EmailNotificationLog create
   */
  export type EmailNotificationLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailNotificationLog
     */
    select?: EmailNotificationLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmailNotificationLogInclude<ExtArgs> | null
    /**
     * The data needed to create a EmailNotificationLog.
     */
    data: XOR<EmailNotificationLogCreateInput, EmailNotificationLogUncheckedCreateInput>
  }

  /**
   * EmailNotificationLog createMany
   */
  export type EmailNotificationLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many EmailNotificationLogs.
     */
    data: EmailNotificationLogCreateManyInput | EmailNotificationLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * EmailNotificationLog createManyAndReturn
   */
  export type EmailNotificationLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailNotificationLog
     */
    select?: EmailNotificationLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many EmailNotificationLogs.
     */
    data: EmailNotificationLogCreateManyInput | EmailNotificationLogCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmailNotificationLogIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * EmailNotificationLog update
   */
  export type EmailNotificationLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailNotificationLog
     */
    select?: EmailNotificationLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmailNotificationLogInclude<ExtArgs> | null
    /**
     * The data needed to update a EmailNotificationLog.
     */
    data: XOR<EmailNotificationLogUpdateInput, EmailNotificationLogUncheckedUpdateInput>
    /**
     * Choose, which EmailNotificationLog to update.
     */
    where: EmailNotificationLogWhereUniqueInput
  }

  /**
   * EmailNotificationLog updateMany
   */
  export type EmailNotificationLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update EmailNotificationLogs.
     */
    data: XOR<EmailNotificationLogUpdateManyMutationInput, EmailNotificationLogUncheckedUpdateManyInput>
    /**
     * Filter which EmailNotificationLogs to update
     */
    where?: EmailNotificationLogWhereInput
  }

  /**
   * EmailNotificationLog upsert
   */
  export type EmailNotificationLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailNotificationLog
     */
    select?: EmailNotificationLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmailNotificationLogInclude<ExtArgs> | null
    /**
     * The filter to search for the EmailNotificationLog to update in case it exists.
     */
    where: EmailNotificationLogWhereUniqueInput
    /**
     * In case the EmailNotificationLog found by the `where` argument doesn't exist, create a new EmailNotificationLog with this data.
     */
    create: XOR<EmailNotificationLogCreateInput, EmailNotificationLogUncheckedCreateInput>
    /**
     * In case the EmailNotificationLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EmailNotificationLogUpdateInput, EmailNotificationLogUncheckedUpdateInput>
  }

  /**
   * EmailNotificationLog delete
   */
  export type EmailNotificationLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailNotificationLog
     */
    select?: EmailNotificationLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmailNotificationLogInclude<ExtArgs> | null
    /**
     * Filter which EmailNotificationLog to delete.
     */
    where: EmailNotificationLogWhereUniqueInput
  }

  /**
   * EmailNotificationLog deleteMany
   */
  export type EmailNotificationLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EmailNotificationLogs to delete
     */
    where?: EmailNotificationLogWhereInput
  }

  /**
   * EmailNotificationLog.inquiry
   */
  export type EmailNotificationLog$inquiryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inquiries
     */
    select?: InquiriesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InquiriesInclude<ExtArgs> | null
    where?: InquiriesWhereInput
  }

  /**
   * EmailNotificationLog without action
   */
  export type EmailNotificationLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailNotificationLog
     */
    select?: EmailNotificationLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmailNotificationLogInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const AdminScalarFieldEnum: {
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

  export type AdminScalarFieldEnum = (typeof AdminScalarFieldEnum)[keyof typeof AdminScalarFieldEnum]


  export const DeceasedRecordScalarFieldEnum: {
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

  export type DeceasedRecordScalarFieldEnum = (typeof DeceasedRecordScalarFieldEnum)[keyof typeof DeceasedRecordScalarFieldEnum]


  export const PaymentRecordScalarFieldEnum: {
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

  export type PaymentRecordScalarFieldEnum = (typeof PaymentRecordScalarFieldEnum)[keyof typeof PaymentRecordScalarFieldEnum]


  export const InquiriesScalarFieldEnum: {
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

  export type InquiriesScalarFieldEnum = (typeof InquiriesScalarFieldEnum)[keyof typeof InquiriesScalarFieldEnum]


  export const AnnouncementScalarFieldEnum: {
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

  export type AnnouncementScalarFieldEnum = (typeof AnnouncementScalarFieldEnum)[keyof typeof AnnouncementScalarFieldEnum]


  export const SmsNotificationScalarFieldEnum: {
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

  export type SmsNotificationScalarFieldEnum = (typeof SmsNotificationScalarFieldEnum)[keyof typeof SmsNotificationScalarFieldEnum]


  export const SystemSettingScalarFieldEnum: {
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

  export type SystemSettingScalarFieldEnum = (typeof SystemSettingScalarFieldEnum)[keyof typeof SystemSettingScalarFieldEnum]


  export const AdminAuditLogScalarFieldEnum: {
    id: 'id',
    activity: 'activity',
    category: 'category',
    admin: 'admin',
    status: 'status',
    details: 'details',
    ipAddress: 'ipAddress',
    createdAt: 'createdAt'
  };

  export type AdminAuditLogScalarFieldEnum = (typeof AdminAuditLogScalarFieldEnum)[keyof typeof AdminAuditLogScalarFieldEnum]


  export const EmailVerificationScalarFieldEnum: {
    id: 'id',
    email: 'email',
    codeHash: 'codeHash',
    attempts: 'attempts',
    expiresAt: 'expiresAt',
    verifiedAt: 'verifiedAt',
    createdAt: 'createdAt'
  };

  export type EmailVerificationScalarFieldEnum = (typeof EmailVerificationScalarFieldEnum)[keyof typeof EmailVerificationScalarFieldEnum]


  export const PasswordResetScalarFieldEnum: {
    id: 'id',
    email: 'email',
    tokenHash: 'tokenHash',
    expiresAt: 'expiresAt',
    usedAt: 'usedAt',
    createdAt: 'createdAt'
  };

  export type PasswordResetScalarFieldEnum = (typeof PasswordResetScalarFieldEnum)[keyof typeof PasswordResetScalarFieldEnum]


  export const EmailNotificationLogScalarFieldEnum: {
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

  export type EmailNotificationLogScalarFieldEnum = (typeof EmailNotificationLogScalarFieldEnum)[keyof typeof EmailNotificationLogScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    
  /**
   * Deep Input Types
   */


  export type AdminWhereInput = {
    AND?: AdminWhereInput | AdminWhereInput[]
    OR?: AdminWhereInput[]
    NOT?: AdminWhereInput | AdminWhereInput[]
    id?: StringFilter<"Admin"> | string
    email?: StringFilter<"Admin"> | string
    password?: StringFilter<"Admin"> | string
    name?: StringNullableFilter<"Admin"> | string | null
    username?: StringNullableFilter<"Admin"> | string | null
    contactNumber?: StringNullableFilter<"Admin"> | string | null
    role?: StringFilter<"Admin"> | string
    avatar?: StringNullableFilter<"Admin"> | string | null
    department?: StringNullableFilter<"Admin"> | string | null
    sessionTimeout?: IntFilter<"Admin"> | number
    createdAt?: DateTimeFilter<"Admin"> | Date | string
    updatedAt?: DateTimeFilter<"Admin"> | Date | string
  }

  export type AdminOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    name?: SortOrderInput | SortOrder
    username?: SortOrderInput | SortOrder
    contactNumber?: SortOrderInput | SortOrder
    role?: SortOrder
    avatar?: SortOrderInput | SortOrder
    department?: SortOrderInput | SortOrder
    sessionTimeout?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AdminWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    username?: string
    AND?: AdminWhereInput | AdminWhereInput[]
    OR?: AdminWhereInput[]
    NOT?: AdminWhereInput | AdminWhereInput[]
    password?: StringFilter<"Admin"> | string
    name?: StringNullableFilter<"Admin"> | string | null
    contactNumber?: StringNullableFilter<"Admin"> | string | null
    role?: StringFilter<"Admin"> | string
    avatar?: StringNullableFilter<"Admin"> | string | null
    department?: StringNullableFilter<"Admin"> | string | null
    sessionTimeout?: IntFilter<"Admin"> | number
    createdAt?: DateTimeFilter<"Admin"> | Date | string
    updatedAt?: DateTimeFilter<"Admin"> | Date | string
  }, "id" | "email" | "username">

  export type AdminOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    name?: SortOrderInput | SortOrder
    username?: SortOrderInput | SortOrder
    contactNumber?: SortOrderInput | SortOrder
    role?: SortOrder
    avatar?: SortOrderInput | SortOrder
    department?: SortOrderInput | SortOrder
    sessionTimeout?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AdminCountOrderByAggregateInput
    _avg?: AdminAvgOrderByAggregateInput
    _max?: AdminMaxOrderByAggregateInput
    _min?: AdminMinOrderByAggregateInput
    _sum?: AdminSumOrderByAggregateInput
  }

  export type AdminScalarWhereWithAggregatesInput = {
    AND?: AdminScalarWhereWithAggregatesInput | AdminScalarWhereWithAggregatesInput[]
    OR?: AdminScalarWhereWithAggregatesInput[]
    NOT?: AdminScalarWhereWithAggregatesInput | AdminScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Admin"> | string
    email?: StringWithAggregatesFilter<"Admin"> | string
    password?: StringWithAggregatesFilter<"Admin"> | string
    name?: StringNullableWithAggregatesFilter<"Admin"> | string | null
    username?: StringNullableWithAggregatesFilter<"Admin"> | string | null
    contactNumber?: StringNullableWithAggregatesFilter<"Admin"> | string | null
    role?: StringWithAggregatesFilter<"Admin"> | string
    avatar?: StringNullableWithAggregatesFilter<"Admin"> | string | null
    department?: StringNullableWithAggregatesFilter<"Admin"> | string | null
    sessionTimeout?: IntWithAggregatesFilter<"Admin"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Admin"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Admin"> | Date | string
  }

  export type DeceasedRecordWhereInput = {
    AND?: DeceasedRecordWhereInput | DeceasedRecordWhereInput[]
    OR?: DeceasedRecordWhereInput[]
    NOT?: DeceasedRecordWhereInput | DeceasedRecordWhereInput[]
    id?: StringFilter<"DeceasedRecord"> | string
    REF_NO?: StringFilter<"DeceasedRecord"> | string
    PAYORS_NAME?: StringFilter<"DeceasedRecord"> | string
    CONTACT_NO?: StringFilter<"DeceasedRecord"> | string
    NAME_OF_DECEASED?: StringFilter<"DeceasedRecord"> | string
    ADDRESS?: StringFilter<"DeceasedRecord"> | string
    DATE_OF_BIRTH?: DateTimeFilter<"DeceasedRecord"> | Date | string
    DATE_OF_DEATH?: DateTimeFilter<"DeceasedRecord"> | Date | string
    YEAR?: IntFilter<"DeceasedRecord"> | number
    TOTAL_DUE?: FloatFilter<"DeceasedRecord"> | number
    PAID?: FloatFilter<"DeceasedRecord"> | number
    BALANCE?: FloatFilter<"DeceasedRecord"> | number
    STATUS?: StringFilter<"DeceasedRecord"> | string
    REMARKS?: StringNullableFilter<"DeceasedRecord"> | string | null
    isArchived?: BoolFilter<"DeceasedRecord"> | boolean
    archivedAt?: DateTimeNullableFilter<"DeceasedRecord"> | Date | string | null
    archiveReason?: StringNullableFilter<"DeceasedRecord"> | string | null
    createdAt?: DateTimeFilter<"DeceasedRecord"> | Date | string
    updatedAt?: DateTimeFilter<"DeceasedRecord"> | Date | string
    payments?: PaymentRecordListRelationFilter
  }

  export type DeceasedRecordOrderByWithRelationInput = {
    id?: SortOrder
    REF_NO?: SortOrder
    PAYORS_NAME?: SortOrder
    CONTACT_NO?: SortOrder
    NAME_OF_DECEASED?: SortOrder
    ADDRESS?: SortOrder
    DATE_OF_BIRTH?: SortOrder
    DATE_OF_DEATH?: SortOrder
    YEAR?: SortOrder
    TOTAL_DUE?: SortOrder
    PAID?: SortOrder
    BALANCE?: SortOrder
    STATUS?: SortOrder
    REMARKS?: SortOrderInput | SortOrder
    isArchived?: SortOrder
    archivedAt?: SortOrderInput | SortOrder
    archiveReason?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    payments?: PaymentRecordOrderByRelationAggregateInput
  }

  export type DeceasedRecordWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    REF_NO?: string
    AND?: DeceasedRecordWhereInput | DeceasedRecordWhereInput[]
    OR?: DeceasedRecordWhereInput[]
    NOT?: DeceasedRecordWhereInput | DeceasedRecordWhereInput[]
    PAYORS_NAME?: StringFilter<"DeceasedRecord"> | string
    CONTACT_NO?: StringFilter<"DeceasedRecord"> | string
    NAME_OF_DECEASED?: StringFilter<"DeceasedRecord"> | string
    ADDRESS?: StringFilter<"DeceasedRecord"> | string
    DATE_OF_BIRTH?: DateTimeFilter<"DeceasedRecord"> | Date | string
    DATE_OF_DEATH?: DateTimeFilter<"DeceasedRecord"> | Date | string
    YEAR?: IntFilter<"DeceasedRecord"> | number
    TOTAL_DUE?: FloatFilter<"DeceasedRecord"> | number
    PAID?: FloatFilter<"DeceasedRecord"> | number
    BALANCE?: FloatFilter<"DeceasedRecord"> | number
    STATUS?: StringFilter<"DeceasedRecord"> | string
    REMARKS?: StringNullableFilter<"DeceasedRecord"> | string | null
    isArchived?: BoolFilter<"DeceasedRecord"> | boolean
    archivedAt?: DateTimeNullableFilter<"DeceasedRecord"> | Date | string | null
    archiveReason?: StringNullableFilter<"DeceasedRecord"> | string | null
    createdAt?: DateTimeFilter<"DeceasedRecord"> | Date | string
    updatedAt?: DateTimeFilter<"DeceasedRecord"> | Date | string
    payments?: PaymentRecordListRelationFilter
  }, "id" | "REF_NO">

  export type DeceasedRecordOrderByWithAggregationInput = {
    id?: SortOrder
    REF_NO?: SortOrder
    PAYORS_NAME?: SortOrder
    CONTACT_NO?: SortOrder
    NAME_OF_DECEASED?: SortOrder
    ADDRESS?: SortOrder
    DATE_OF_BIRTH?: SortOrder
    DATE_OF_DEATH?: SortOrder
    YEAR?: SortOrder
    TOTAL_DUE?: SortOrder
    PAID?: SortOrder
    BALANCE?: SortOrder
    STATUS?: SortOrder
    REMARKS?: SortOrderInput | SortOrder
    isArchived?: SortOrder
    archivedAt?: SortOrderInput | SortOrder
    archiveReason?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: DeceasedRecordCountOrderByAggregateInput
    _avg?: DeceasedRecordAvgOrderByAggregateInput
    _max?: DeceasedRecordMaxOrderByAggregateInput
    _min?: DeceasedRecordMinOrderByAggregateInput
    _sum?: DeceasedRecordSumOrderByAggregateInput
  }

  export type DeceasedRecordScalarWhereWithAggregatesInput = {
    AND?: DeceasedRecordScalarWhereWithAggregatesInput | DeceasedRecordScalarWhereWithAggregatesInput[]
    OR?: DeceasedRecordScalarWhereWithAggregatesInput[]
    NOT?: DeceasedRecordScalarWhereWithAggregatesInput | DeceasedRecordScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"DeceasedRecord"> | string
    REF_NO?: StringWithAggregatesFilter<"DeceasedRecord"> | string
    PAYORS_NAME?: StringWithAggregatesFilter<"DeceasedRecord"> | string
    CONTACT_NO?: StringWithAggregatesFilter<"DeceasedRecord"> | string
    NAME_OF_DECEASED?: StringWithAggregatesFilter<"DeceasedRecord"> | string
    ADDRESS?: StringWithAggregatesFilter<"DeceasedRecord"> | string
    DATE_OF_BIRTH?: DateTimeWithAggregatesFilter<"DeceasedRecord"> | Date | string
    DATE_OF_DEATH?: DateTimeWithAggregatesFilter<"DeceasedRecord"> | Date | string
    YEAR?: IntWithAggregatesFilter<"DeceasedRecord"> | number
    TOTAL_DUE?: FloatWithAggregatesFilter<"DeceasedRecord"> | number
    PAID?: FloatWithAggregatesFilter<"DeceasedRecord"> | number
    BALANCE?: FloatWithAggregatesFilter<"DeceasedRecord"> | number
    STATUS?: StringWithAggregatesFilter<"DeceasedRecord"> | string
    REMARKS?: StringNullableWithAggregatesFilter<"DeceasedRecord"> | string | null
    isArchived?: BoolWithAggregatesFilter<"DeceasedRecord"> | boolean
    archivedAt?: DateTimeNullableWithAggregatesFilter<"DeceasedRecord"> | Date | string | null
    archiveReason?: StringNullableWithAggregatesFilter<"DeceasedRecord"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"DeceasedRecord"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"DeceasedRecord"> | Date | string
  }

  export type PaymentRecordWhereInput = {
    AND?: PaymentRecordWhereInput | PaymentRecordWhereInput[]
    OR?: PaymentRecordWhereInput[]
    NOT?: PaymentRecordWhereInput | PaymentRecordWhereInput[]
    id?: StringFilter<"PaymentRecord"> | string
    REF_NO?: StringFilter<"PaymentRecord"> | string
    PAYORS_NAME?: StringFilter<"PaymentRecord"> | string
    CONTACT_NO?: StringNullableFilter<"PaymentRecord"> | string | null
    NAME_OF_DECEASED?: StringFilter<"PaymentRecord"> | string
    ADDRESS?: StringNullableFilter<"PaymentRecord"> | string | null
    DATE_OF_BIRTH?: DateTimeNullableFilter<"PaymentRecord"> | Date | string | null
    DATE_OF_DEATH?: DateTimeNullableFilter<"PaymentRecord"> | Date | string | null
    YEAR?: IntFilter<"PaymentRecord"> | number
    TOTAL_DUE?: FloatFilter<"PaymentRecord"> | number
    PAID?: FloatFilter<"PaymentRecord"> | number
    BALANCE?: FloatFilter<"PaymentRecord"> | number
    STATUS?: StringFilter<"PaymentRecord"> | string
    REMARKS?: StringNullableFilter<"PaymentRecord"> | string | null
    OR_NO?: StringNullableFilter<"PaymentRecord"> | string | null
    DATE_PAID?: StringNullableFilter<"PaymentRecord"> | string | null
    METHOD?: StringNullableFilter<"PaymentRecord"> | string | null
    DUE_DATE?: StringNullableFilter<"PaymentRecord"> | string | null
    deceasedRecordId?: StringNullableFilter<"PaymentRecord"> | string | null
    isArchived?: BoolFilter<"PaymentRecord"> | boolean
    archivedAt?: DateTimeNullableFilter<"PaymentRecord"> | Date | string | null
    archiveReason?: StringNullableFilter<"PaymentRecord"> | string | null
    createdAt?: DateTimeFilter<"PaymentRecord"> | Date | string
    updatedAt?: DateTimeFilter<"PaymentRecord"> | Date | string
    deceasedRecord?: XOR<DeceasedRecordNullableRelationFilter, DeceasedRecordWhereInput> | null
  }

  export type PaymentRecordOrderByWithRelationInput = {
    id?: SortOrder
    REF_NO?: SortOrder
    PAYORS_NAME?: SortOrder
    CONTACT_NO?: SortOrderInput | SortOrder
    NAME_OF_DECEASED?: SortOrder
    ADDRESS?: SortOrderInput | SortOrder
    DATE_OF_BIRTH?: SortOrderInput | SortOrder
    DATE_OF_DEATH?: SortOrderInput | SortOrder
    YEAR?: SortOrder
    TOTAL_DUE?: SortOrder
    PAID?: SortOrder
    BALANCE?: SortOrder
    STATUS?: SortOrder
    REMARKS?: SortOrderInput | SortOrder
    OR_NO?: SortOrderInput | SortOrder
    DATE_PAID?: SortOrderInput | SortOrder
    METHOD?: SortOrderInput | SortOrder
    DUE_DATE?: SortOrderInput | SortOrder
    deceasedRecordId?: SortOrderInput | SortOrder
    isArchived?: SortOrder
    archivedAt?: SortOrderInput | SortOrder
    archiveReason?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deceasedRecord?: DeceasedRecordOrderByWithRelationInput
  }

  export type PaymentRecordWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    REF_NO?: string
    AND?: PaymentRecordWhereInput | PaymentRecordWhereInput[]
    OR?: PaymentRecordWhereInput[]
    NOT?: PaymentRecordWhereInput | PaymentRecordWhereInput[]
    PAYORS_NAME?: StringFilter<"PaymentRecord"> | string
    CONTACT_NO?: StringNullableFilter<"PaymentRecord"> | string | null
    NAME_OF_DECEASED?: StringFilter<"PaymentRecord"> | string
    ADDRESS?: StringNullableFilter<"PaymentRecord"> | string | null
    DATE_OF_BIRTH?: DateTimeNullableFilter<"PaymentRecord"> | Date | string | null
    DATE_OF_DEATH?: DateTimeNullableFilter<"PaymentRecord"> | Date | string | null
    YEAR?: IntFilter<"PaymentRecord"> | number
    TOTAL_DUE?: FloatFilter<"PaymentRecord"> | number
    PAID?: FloatFilter<"PaymentRecord"> | number
    BALANCE?: FloatFilter<"PaymentRecord"> | number
    STATUS?: StringFilter<"PaymentRecord"> | string
    REMARKS?: StringNullableFilter<"PaymentRecord"> | string | null
    OR_NO?: StringNullableFilter<"PaymentRecord"> | string | null
    DATE_PAID?: StringNullableFilter<"PaymentRecord"> | string | null
    METHOD?: StringNullableFilter<"PaymentRecord"> | string | null
    DUE_DATE?: StringNullableFilter<"PaymentRecord"> | string | null
    deceasedRecordId?: StringNullableFilter<"PaymentRecord"> | string | null
    isArchived?: BoolFilter<"PaymentRecord"> | boolean
    archivedAt?: DateTimeNullableFilter<"PaymentRecord"> | Date | string | null
    archiveReason?: StringNullableFilter<"PaymentRecord"> | string | null
    createdAt?: DateTimeFilter<"PaymentRecord"> | Date | string
    updatedAt?: DateTimeFilter<"PaymentRecord"> | Date | string
    deceasedRecord?: XOR<DeceasedRecordNullableRelationFilter, DeceasedRecordWhereInput> | null
  }, "id" | "REF_NO">

  export type PaymentRecordOrderByWithAggregationInput = {
    id?: SortOrder
    REF_NO?: SortOrder
    PAYORS_NAME?: SortOrder
    CONTACT_NO?: SortOrderInput | SortOrder
    NAME_OF_DECEASED?: SortOrder
    ADDRESS?: SortOrderInput | SortOrder
    DATE_OF_BIRTH?: SortOrderInput | SortOrder
    DATE_OF_DEATH?: SortOrderInput | SortOrder
    YEAR?: SortOrder
    TOTAL_DUE?: SortOrder
    PAID?: SortOrder
    BALANCE?: SortOrder
    STATUS?: SortOrder
    REMARKS?: SortOrderInput | SortOrder
    OR_NO?: SortOrderInput | SortOrder
    DATE_PAID?: SortOrderInput | SortOrder
    METHOD?: SortOrderInput | SortOrder
    DUE_DATE?: SortOrderInput | SortOrder
    deceasedRecordId?: SortOrderInput | SortOrder
    isArchived?: SortOrder
    archivedAt?: SortOrderInput | SortOrder
    archiveReason?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PaymentRecordCountOrderByAggregateInput
    _avg?: PaymentRecordAvgOrderByAggregateInput
    _max?: PaymentRecordMaxOrderByAggregateInput
    _min?: PaymentRecordMinOrderByAggregateInput
    _sum?: PaymentRecordSumOrderByAggregateInput
  }

  export type PaymentRecordScalarWhereWithAggregatesInput = {
    AND?: PaymentRecordScalarWhereWithAggregatesInput | PaymentRecordScalarWhereWithAggregatesInput[]
    OR?: PaymentRecordScalarWhereWithAggregatesInput[]
    NOT?: PaymentRecordScalarWhereWithAggregatesInput | PaymentRecordScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PaymentRecord"> | string
    REF_NO?: StringWithAggregatesFilter<"PaymentRecord"> | string
    PAYORS_NAME?: StringWithAggregatesFilter<"PaymentRecord"> | string
    CONTACT_NO?: StringNullableWithAggregatesFilter<"PaymentRecord"> | string | null
    NAME_OF_DECEASED?: StringWithAggregatesFilter<"PaymentRecord"> | string
    ADDRESS?: StringNullableWithAggregatesFilter<"PaymentRecord"> | string | null
    DATE_OF_BIRTH?: DateTimeNullableWithAggregatesFilter<"PaymentRecord"> | Date | string | null
    DATE_OF_DEATH?: DateTimeNullableWithAggregatesFilter<"PaymentRecord"> | Date | string | null
    YEAR?: IntWithAggregatesFilter<"PaymentRecord"> | number
    TOTAL_DUE?: FloatWithAggregatesFilter<"PaymentRecord"> | number
    PAID?: FloatWithAggregatesFilter<"PaymentRecord"> | number
    BALANCE?: FloatWithAggregatesFilter<"PaymentRecord"> | number
    STATUS?: StringWithAggregatesFilter<"PaymentRecord"> | string
    REMARKS?: StringNullableWithAggregatesFilter<"PaymentRecord"> | string | null
    OR_NO?: StringNullableWithAggregatesFilter<"PaymentRecord"> | string | null
    DATE_PAID?: StringNullableWithAggregatesFilter<"PaymentRecord"> | string | null
    METHOD?: StringNullableWithAggregatesFilter<"PaymentRecord"> | string | null
    DUE_DATE?: StringNullableWithAggregatesFilter<"PaymentRecord"> | string | null
    deceasedRecordId?: StringNullableWithAggregatesFilter<"PaymentRecord"> | string | null
    isArchived?: BoolWithAggregatesFilter<"PaymentRecord"> | boolean
    archivedAt?: DateTimeNullableWithAggregatesFilter<"PaymentRecord"> | Date | string | null
    archiveReason?: StringNullableWithAggregatesFilter<"PaymentRecord"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"PaymentRecord"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"PaymentRecord"> | Date | string
  }

  export type InquiriesWhereInput = {
    AND?: InquiriesWhereInput | InquiriesWhereInput[]
    OR?: InquiriesWhereInput[]
    NOT?: InquiriesWhereInput | InquiriesWhereInput[]
    id?: IntFilter<"Inquiries"> | number
    APP_ID?: StringFilter<"Inquiries"> | string
    FAMILY_NAME?: StringFilter<"Inquiries"> | string
    DECEASED?: StringNullableFilter<"Inquiries"> | string | null
    REQUESTED_PLOT?: StringNullableFilter<"Inquiries"> | string | null
    BURIAL_DATE?: DateTimeNullableFilter<"Inquiries"> | Date | string | null
    TIME?: StringNullableFilter<"Inquiries"> | string | null
    CONTACT?: StringFilter<"Inquiries"> | string
    STATUS?: StringFilter<"Inquiries"> | string
    email?: StringFilter<"Inquiries"> | string
    emailVerified?: BoolFilter<"Inquiries"> | boolean
    emailVerifiedAt?: DateTimeNullableFilter<"Inquiries"> | Date | string | null
    relationship?: StringFilter<"Inquiries"> | string
    address?: StringNullableFilter<"Inquiries"> | string | null
    reason?: StringFilter<"Inquiries"> | string
    notes?: StringNullableFilter<"Inquiries"> | string | null
    remarks?: StringNullableFilter<"Inquiries"> | string | null
    createdAt?: DateTimeFilter<"Inquiries"> | Date | string
    updatedAt?: DateTimeFilter<"Inquiries"> | Date | string
    emailLogs?: EmailNotificationLogListRelationFilter
  }

  export type InquiriesOrderByWithRelationInput = {
    id?: SortOrder
    APP_ID?: SortOrder
    FAMILY_NAME?: SortOrder
    DECEASED?: SortOrderInput | SortOrder
    REQUESTED_PLOT?: SortOrderInput | SortOrder
    BURIAL_DATE?: SortOrderInput | SortOrder
    TIME?: SortOrderInput | SortOrder
    CONTACT?: SortOrder
    STATUS?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    emailVerifiedAt?: SortOrderInput | SortOrder
    relationship?: SortOrder
    address?: SortOrderInput | SortOrder
    reason?: SortOrder
    notes?: SortOrderInput | SortOrder
    remarks?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    emailLogs?: EmailNotificationLogOrderByRelationAggregateInput
  }

  export type InquiriesWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    APP_ID?: string
    AND?: InquiriesWhereInput | InquiriesWhereInput[]
    OR?: InquiriesWhereInput[]
    NOT?: InquiriesWhereInput | InquiriesWhereInput[]
    FAMILY_NAME?: StringFilter<"Inquiries"> | string
    DECEASED?: StringNullableFilter<"Inquiries"> | string | null
    REQUESTED_PLOT?: StringNullableFilter<"Inquiries"> | string | null
    BURIAL_DATE?: DateTimeNullableFilter<"Inquiries"> | Date | string | null
    TIME?: StringNullableFilter<"Inquiries"> | string | null
    CONTACT?: StringFilter<"Inquiries"> | string
    STATUS?: StringFilter<"Inquiries"> | string
    email?: StringFilter<"Inquiries"> | string
    emailVerified?: BoolFilter<"Inquiries"> | boolean
    emailVerifiedAt?: DateTimeNullableFilter<"Inquiries"> | Date | string | null
    relationship?: StringFilter<"Inquiries"> | string
    address?: StringNullableFilter<"Inquiries"> | string | null
    reason?: StringFilter<"Inquiries"> | string
    notes?: StringNullableFilter<"Inquiries"> | string | null
    remarks?: StringNullableFilter<"Inquiries"> | string | null
    createdAt?: DateTimeFilter<"Inquiries"> | Date | string
    updatedAt?: DateTimeFilter<"Inquiries"> | Date | string
    emailLogs?: EmailNotificationLogListRelationFilter
  }, "id" | "APP_ID">

  export type InquiriesOrderByWithAggregationInput = {
    id?: SortOrder
    APP_ID?: SortOrder
    FAMILY_NAME?: SortOrder
    DECEASED?: SortOrderInput | SortOrder
    REQUESTED_PLOT?: SortOrderInput | SortOrder
    BURIAL_DATE?: SortOrderInput | SortOrder
    TIME?: SortOrderInput | SortOrder
    CONTACT?: SortOrder
    STATUS?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    emailVerifiedAt?: SortOrderInput | SortOrder
    relationship?: SortOrder
    address?: SortOrderInput | SortOrder
    reason?: SortOrder
    notes?: SortOrderInput | SortOrder
    remarks?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: InquiriesCountOrderByAggregateInput
    _avg?: InquiriesAvgOrderByAggregateInput
    _max?: InquiriesMaxOrderByAggregateInput
    _min?: InquiriesMinOrderByAggregateInput
    _sum?: InquiriesSumOrderByAggregateInput
  }

  export type InquiriesScalarWhereWithAggregatesInput = {
    AND?: InquiriesScalarWhereWithAggregatesInput | InquiriesScalarWhereWithAggregatesInput[]
    OR?: InquiriesScalarWhereWithAggregatesInput[]
    NOT?: InquiriesScalarWhereWithAggregatesInput | InquiriesScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Inquiries"> | number
    APP_ID?: StringWithAggregatesFilter<"Inquiries"> | string
    FAMILY_NAME?: StringWithAggregatesFilter<"Inquiries"> | string
    DECEASED?: StringNullableWithAggregatesFilter<"Inquiries"> | string | null
    REQUESTED_PLOT?: StringNullableWithAggregatesFilter<"Inquiries"> | string | null
    BURIAL_DATE?: DateTimeNullableWithAggregatesFilter<"Inquiries"> | Date | string | null
    TIME?: StringNullableWithAggregatesFilter<"Inquiries"> | string | null
    CONTACT?: StringWithAggregatesFilter<"Inquiries"> | string
    STATUS?: StringWithAggregatesFilter<"Inquiries"> | string
    email?: StringWithAggregatesFilter<"Inquiries"> | string
    emailVerified?: BoolWithAggregatesFilter<"Inquiries"> | boolean
    emailVerifiedAt?: DateTimeNullableWithAggregatesFilter<"Inquiries"> | Date | string | null
    relationship?: StringWithAggregatesFilter<"Inquiries"> | string
    address?: StringNullableWithAggregatesFilter<"Inquiries"> | string | null
    reason?: StringWithAggregatesFilter<"Inquiries"> | string
    notes?: StringNullableWithAggregatesFilter<"Inquiries"> | string | null
    remarks?: StringNullableWithAggregatesFilter<"Inquiries"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Inquiries"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Inquiries"> | Date | string
  }

  export type AnnouncementWhereInput = {
    AND?: AnnouncementWhereInput | AnnouncementWhereInput[]
    OR?: AnnouncementWhereInput[]
    NOT?: AnnouncementWhereInput | AnnouncementWhereInput[]
    id?: IntFilter<"Announcement"> | number
    title?: StringFilter<"Announcement"> | string
    content?: StringFilter<"Announcement"> | string
    category?: StringFilter<"Announcement"> | string
    badge?: StringNullableFilter<"Announcement"> | string | null
    visibility?: StringFilter<"Announcement"> | string
    status?: StringFilter<"Announcement"> | string
    date?: DateTimeFilter<"Announcement"> | Date | string
    validFrom?: StringNullableFilter<"Announcement"> | string | null
    validUntil?: StringNullableFilter<"Announcement"> | string | null
    views?: IntFilter<"Announcement"> | number
  }

  export type AnnouncementOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    content?: SortOrder
    category?: SortOrder
    badge?: SortOrderInput | SortOrder
    visibility?: SortOrder
    status?: SortOrder
    date?: SortOrder
    validFrom?: SortOrderInput | SortOrder
    validUntil?: SortOrderInput | SortOrder
    views?: SortOrder
  }

  export type AnnouncementWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: AnnouncementWhereInput | AnnouncementWhereInput[]
    OR?: AnnouncementWhereInput[]
    NOT?: AnnouncementWhereInput | AnnouncementWhereInput[]
    title?: StringFilter<"Announcement"> | string
    content?: StringFilter<"Announcement"> | string
    category?: StringFilter<"Announcement"> | string
    badge?: StringNullableFilter<"Announcement"> | string | null
    visibility?: StringFilter<"Announcement"> | string
    status?: StringFilter<"Announcement"> | string
    date?: DateTimeFilter<"Announcement"> | Date | string
    validFrom?: StringNullableFilter<"Announcement"> | string | null
    validUntil?: StringNullableFilter<"Announcement"> | string | null
    views?: IntFilter<"Announcement"> | number
  }, "id">

  export type AnnouncementOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    content?: SortOrder
    category?: SortOrder
    badge?: SortOrderInput | SortOrder
    visibility?: SortOrder
    status?: SortOrder
    date?: SortOrder
    validFrom?: SortOrderInput | SortOrder
    validUntil?: SortOrderInput | SortOrder
    views?: SortOrder
    _count?: AnnouncementCountOrderByAggregateInput
    _avg?: AnnouncementAvgOrderByAggregateInput
    _max?: AnnouncementMaxOrderByAggregateInput
    _min?: AnnouncementMinOrderByAggregateInput
    _sum?: AnnouncementSumOrderByAggregateInput
  }

  export type AnnouncementScalarWhereWithAggregatesInput = {
    AND?: AnnouncementScalarWhereWithAggregatesInput | AnnouncementScalarWhereWithAggregatesInput[]
    OR?: AnnouncementScalarWhereWithAggregatesInput[]
    NOT?: AnnouncementScalarWhereWithAggregatesInput | AnnouncementScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Announcement"> | number
    title?: StringWithAggregatesFilter<"Announcement"> | string
    content?: StringWithAggregatesFilter<"Announcement"> | string
    category?: StringWithAggregatesFilter<"Announcement"> | string
    badge?: StringNullableWithAggregatesFilter<"Announcement"> | string | null
    visibility?: StringWithAggregatesFilter<"Announcement"> | string
    status?: StringWithAggregatesFilter<"Announcement"> | string
    date?: DateTimeWithAggregatesFilter<"Announcement"> | Date | string
    validFrom?: StringNullableWithAggregatesFilter<"Announcement"> | string | null
    validUntil?: StringNullableWithAggregatesFilter<"Announcement"> | string | null
    views?: IntWithAggregatesFilter<"Announcement"> | number
  }

  export type SmsNotificationWhereInput = {
    AND?: SmsNotificationWhereInput | SmsNotificationWhereInput[]
    OR?: SmsNotificationWhereInput[]
    NOT?: SmsNotificationWhereInput | SmsNotificationWhereInput[]
    id?: StringFilter<"SmsNotification"> | string
    recipient?: StringFilter<"SmsNotification"> | string
    recipientName?: StringNullableFilter<"SmsNotification"> | string | null
    message?: StringFilter<"SmsNotification"> | string
    semaphoreId?: StringNullableFilter<"SmsNotification"> | string | null
    status?: StringFilter<"SmsNotification"> | string
    type?: StringNullableFilter<"SmsNotification"> | string | null
    senderName?: StringNullableFilter<"SmsNotification"> | string | null
    sentBy?: StringNullableFilter<"SmsNotification"> | string | null
    errorMessage?: StringNullableFilter<"SmsNotification"> | string | null
    createdAt?: DateTimeFilter<"SmsNotification"> | Date | string
    updatedAt?: DateTimeFilter<"SmsNotification"> | Date | string
  }

  export type SmsNotificationOrderByWithRelationInput = {
    id?: SortOrder
    recipient?: SortOrder
    recipientName?: SortOrderInput | SortOrder
    message?: SortOrder
    semaphoreId?: SortOrderInput | SortOrder
    status?: SortOrder
    type?: SortOrderInput | SortOrder
    senderName?: SortOrderInput | SortOrder
    sentBy?: SortOrderInput | SortOrder
    errorMessage?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SmsNotificationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SmsNotificationWhereInput | SmsNotificationWhereInput[]
    OR?: SmsNotificationWhereInput[]
    NOT?: SmsNotificationWhereInput | SmsNotificationWhereInput[]
    recipient?: StringFilter<"SmsNotification"> | string
    recipientName?: StringNullableFilter<"SmsNotification"> | string | null
    message?: StringFilter<"SmsNotification"> | string
    semaphoreId?: StringNullableFilter<"SmsNotification"> | string | null
    status?: StringFilter<"SmsNotification"> | string
    type?: StringNullableFilter<"SmsNotification"> | string | null
    senderName?: StringNullableFilter<"SmsNotification"> | string | null
    sentBy?: StringNullableFilter<"SmsNotification"> | string | null
    errorMessage?: StringNullableFilter<"SmsNotification"> | string | null
    createdAt?: DateTimeFilter<"SmsNotification"> | Date | string
    updatedAt?: DateTimeFilter<"SmsNotification"> | Date | string
  }, "id">

  export type SmsNotificationOrderByWithAggregationInput = {
    id?: SortOrder
    recipient?: SortOrder
    recipientName?: SortOrderInput | SortOrder
    message?: SortOrder
    semaphoreId?: SortOrderInput | SortOrder
    status?: SortOrder
    type?: SortOrderInput | SortOrder
    senderName?: SortOrderInput | SortOrder
    sentBy?: SortOrderInput | SortOrder
    errorMessage?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SmsNotificationCountOrderByAggregateInput
    _max?: SmsNotificationMaxOrderByAggregateInput
    _min?: SmsNotificationMinOrderByAggregateInput
  }

  export type SmsNotificationScalarWhereWithAggregatesInput = {
    AND?: SmsNotificationScalarWhereWithAggregatesInput | SmsNotificationScalarWhereWithAggregatesInput[]
    OR?: SmsNotificationScalarWhereWithAggregatesInput[]
    NOT?: SmsNotificationScalarWhereWithAggregatesInput | SmsNotificationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SmsNotification"> | string
    recipient?: StringWithAggregatesFilter<"SmsNotification"> | string
    recipientName?: StringNullableWithAggregatesFilter<"SmsNotification"> | string | null
    message?: StringWithAggregatesFilter<"SmsNotification"> | string
    semaphoreId?: StringNullableWithAggregatesFilter<"SmsNotification"> | string | null
    status?: StringWithAggregatesFilter<"SmsNotification"> | string
    type?: StringNullableWithAggregatesFilter<"SmsNotification"> | string | null
    senderName?: StringNullableWithAggregatesFilter<"SmsNotification"> | string | null
    sentBy?: StringNullableWithAggregatesFilter<"SmsNotification"> | string | null
    errorMessage?: StringNullableWithAggregatesFilter<"SmsNotification"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"SmsNotification"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"SmsNotification"> | Date | string
  }

  export type SystemSettingWhereInput = {
    AND?: SystemSettingWhereInput | SystemSettingWhereInput[]
    OR?: SystemSettingWhereInput[]
    NOT?: SystemSettingWhereInput | SystemSettingWhereInput[]
    id?: StringFilter<"SystemSetting"> | string
    systemName?: StringFilter<"SystemSetting"> | string
    systemDescription?: StringFilter<"SystemSetting"> | string
    systemLogo?: StringNullableFilter<"SystemSetting"> | string | null
    contactNumber?: StringFilter<"SystemSetting"> | string
    officialEmail?: StringFilter<"SystemSetting"> | string
    officeAddress?: StringFilter<"SystemSetting"> | string
    timeZone?: StringFilter<"SystemSetting"> | string
    dateFormat?: StringFilter<"SystemSetting"> | string
    timeFormat?: StringFilter<"SystemSetting"> | string
    notifNewInquiry?: BoolFilter<"SystemSetting"> | boolean
    notifInquiryAccepted?: BoolFilter<"SystemSetting"> | boolean
    notifInquiryRejected?: BoolFilter<"SystemSetting"> | boolean
    notifPayment?: BoolFilter<"SystemSetting"> | boolean
    notifOverduePayment?: BoolFilter<"SystemSetting"> | boolean
    notifAnnouncement?: BoolFilter<"SystemSetting"> | boolean
    notifGraveLocator?: BoolFilter<"SystemSetting"> | boolean
    notifSystem?: BoolFilter<"SystemSetting"> | boolean
    smsEnabled?: BoolFilter<"SystemSetting"> | boolean
    smsProvider?: StringFilter<"SystemSetting"> | string
    smsSenderName?: StringFilter<"SystemSetting"> | string
    emailEnabled?: BoolFilter<"SystemSetting"> | boolean
    emailSenderName?: StringFilter<"SystemSetting"> | string
    emailSenderAddress?: StringFilter<"SystemSetting"> | string
    userAccessEnabled?: BoolFilter<"SystemSetting"> | boolean
    mobileAppEnabled?: BoolFilter<"SystemSetting"> | boolean
    inquiriesEnabled?: BoolFilter<"SystemSetting"> | boolean
    announcementsEnabled?: BoolFilter<"SystemSetting"> | boolean
    graveLocatorEnabled?: BoolFilter<"SystemSetting"> | boolean
    maintenanceMode?: BoolFilter<"SystemSetting"> | boolean
    maintenanceMessage?: StringFilter<"SystemSetting"> | string
    defaultTheme?: StringFilter<"SystemSetting"> | string
    sidebarBehavior?: StringFilter<"SystemSetting"> | string
    layoutDensity?: StringFilter<"SystemSetting"> | string
    itemsPerPage?: IntFilter<"SystemSetting"> | number
    defaultDashboardPage?: StringFilter<"SystemSetting"> | string
    language?: StringFilter<"SystemSetting"> | string
    lastBackupAt?: DateTimeNullableFilter<"SystemSetting"> | Date | string | null
    lastBackupFile?: StringNullableFilter<"SystemSetting"> | string | null
    backupStatus?: StringFilter<"SystemSetting"> | string
    autoBackupEnabled?: BoolFilter<"SystemSetting"> | boolean
    backupFrequency?: StringFilter<"SystemSetting"> | string
    sessionTimeout?: IntFilter<"SystemSetting"> | number
    updatedAt?: DateTimeFilter<"SystemSetting"> | Date | string
    createdAt?: DateTimeFilter<"SystemSetting"> | Date | string
  }

  export type SystemSettingOrderByWithRelationInput = {
    id?: SortOrder
    systemName?: SortOrder
    systemDescription?: SortOrder
    systemLogo?: SortOrderInput | SortOrder
    contactNumber?: SortOrder
    officialEmail?: SortOrder
    officeAddress?: SortOrder
    timeZone?: SortOrder
    dateFormat?: SortOrder
    timeFormat?: SortOrder
    notifNewInquiry?: SortOrder
    notifInquiryAccepted?: SortOrder
    notifInquiryRejected?: SortOrder
    notifPayment?: SortOrder
    notifOverduePayment?: SortOrder
    notifAnnouncement?: SortOrder
    notifGraveLocator?: SortOrder
    notifSystem?: SortOrder
    smsEnabled?: SortOrder
    smsProvider?: SortOrder
    smsSenderName?: SortOrder
    emailEnabled?: SortOrder
    emailSenderName?: SortOrder
    emailSenderAddress?: SortOrder
    userAccessEnabled?: SortOrder
    mobileAppEnabled?: SortOrder
    inquiriesEnabled?: SortOrder
    announcementsEnabled?: SortOrder
    graveLocatorEnabled?: SortOrder
    maintenanceMode?: SortOrder
    maintenanceMessage?: SortOrder
    defaultTheme?: SortOrder
    sidebarBehavior?: SortOrder
    layoutDensity?: SortOrder
    itemsPerPage?: SortOrder
    defaultDashboardPage?: SortOrder
    language?: SortOrder
    lastBackupAt?: SortOrderInput | SortOrder
    lastBackupFile?: SortOrderInput | SortOrder
    backupStatus?: SortOrder
    autoBackupEnabled?: SortOrder
    backupFrequency?: SortOrder
    sessionTimeout?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type SystemSettingWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SystemSettingWhereInput | SystemSettingWhereInput[]
    OR?: SystemSettingWhereInput[]
    NOT?: SystemSettingWhereInput | SystemSettingWhereInput[]
    systemName?: StringFilter<"SystemSetting"> | string
    systemDescription?: StringFilter<"SystemSetting"> | string
    systemLogo?: StringNullableFilter<"SystemSetting"> | string | null
    contactNumber?: StringFilter<"SystemSetting"> | string
    officialEmail?: StringFilter<"SystemSetting"> | string
    officeAddress?: StringFilter<"SystemSetting"> | string
    timeZone?: StringFilter<"SystemSetting"> | string
    dateFormat?: StringFilter<"SystemSetting"> | string
    timeFormat?: StringFilter<"SystemSetting"> | string
    notifNewInquiry?: BoolFilter<"SystemSetting"> | boolean
    notifInquiryAccepted?: BoolFilter<"SystemSetting"> | boolean
    notifInquiryRejected?: BoolFilter<"SystemSetting"> | boolean
    notifPayment?: BoolFilter<"SystemSetting"> | boolean
    notifOverduePayment?: BoolFilter<"SystemSetting"> | boolean
    notifAnnouncement?: BoolFilter<"SystemSetting"> | boolean
    notifGraveLocator?: BoolFilter<"SystemSetting"> | boolean
    notifSystem?: BoolFilter<"SystemSetting"> | boolean
    smsEnabled?: BoolFilter<"SystemSetting"> | boolean
    smsProvider?: StringFilter<"SystemSetting"> | string
    smsSenderName?: StringFilter<"SystemSetting"> | string
    emailEnabled?: BoolFilter<"SystemSetting"> | boolean
    emailSenderName?: StringFilter<"SystemSetting"> | string
    emailSenderAddress?: StringFilter<"SystemSetting"> | string
    userAccessEnabled?: BoolFilter<"SystemSetting"> | boolean
    mobileAppEnabled?: BoolFilter<"SystemSetting"> | boolean
    inquiriesEnabled?: BoolFilter<"SystemSetting"> | boolean
    announcementsEnabled?: BoolFilter<"SystemSetting"> | boolean
    graveLocatorEnabled?: BoolFilter<"SystemSetting"> | boolean
    maintenanceMode?: BoolFilter<"SystemSetting"> | boolean
    maintenanceMessage?: StringFilter<"SystemSetting"> | string
    defaultTheme?: StringFilter<"SystemSetting"> | string
    sidebarBehavior?: StringFilter<"SystemSetting"> | string
    layoutDensity?: StringFilter<"SystemSetting"> | string
    itemsPerPage?: IntFilter<"SystemSetting"> | number
    defaultDashboardPage?: StringFilter<"SystemSetting"> | string
    language?: StringFilter<"SystemSetting"> | string
    lastBackupAt?: DateTimeNullableFilter<"SystemSetting"> | Date | string | null
    lastBackupFile?: StringNullableFilter<"SystemSetting"> | string | null
    backupStatus?: StringFilter<"SystemSetting"> | string
    autoBackupEnabled?: BoolFilter<"SystemSetting"> | boolean
    backupFrequency?: StringFilter<"SystemSetting"> | string
    sessionTimeout?: IntFilter<"SystemSetting"> | number
    updatedAt?: DateTimeFilter<"SystemSetting"> | Date | string
    createdAt?: DateTimeFilter<"SystemSetting"> | Date | string
  }, "id">

  export type SystemSettingOrderByWithAggregationInput = {
    id?: SortOrder
    systemName?: SortOrder
    systemDescription?: SortOrder
    systemLogo?: SortOrderInput | SortOrder
    contactNumber?: SortOrder
    officialEmail?: SortOrder
    officeAddress?: SortOrder
    timeZone?: SortOrder
    dateFormat?: SortOrder
    timeFormat?: SortOrder
    notifNewInquiry?: SortOrder
    notifInquiryAccepted?: SortOrder
    notifInquiryRejected?: SortOrder
    notifPayment?: SortOrder
    notifOverduePayment?: SortOrder
    notifAnnouncement?: SortOrder
    notifGraveLocator?: SortOrder
    notifSystem?: SortOrder
    smsEnabled?: SortOrder
    smsProvider?: SortOrder
    smsSenderName?: SortOrder
    emailEnabled?: SortOrder
    emailSenderName?: SortOrder
    emailSenderAddress?: SortOrder
    userAccessEnabled?: SortOrder
    mobileAppEnabled?: SortOrder
    inquiriesEnabled?: SortOrder
    announcementsEnabled?: SortOrder
    graveLocatorEnabled?: SortOrder
    maintenanceMode?: SortOrder
    maintenanceMessage?: SortOrder
    defaultTheme?: SortOrder
    sidebarBehavior?: SortOrder
    layoutDensity?: SortOrder
    itemsPerPage?: SortOrder
    defaultDashboardPage?: SortOrder
    language?: SortOrder
    lastBackupAt?: SortOrderInput | SortOrder
    lastBackupFile?: SortOrderInput | SortOrder
    backupStatus?: SortOrder
    autoBackupEnabled?: SortOrder
    backupFrequency?: SortOrder
    sessionTimeout?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
    _count?: SystemSettingCountOrderByAggregateInput
    _avg?: SystemSettingAvgOrderByAggregateInput
    _max?: SystemSettingMaxOrderByAggregateInput
    _min?: SystemSettingMinOrderByAggregateInput
    _sum?: SystemSettingSumOrderByAggregateInput
  }

  export type SystemSettingScalarWhereWithAggregatesInput = {
    AND?: SystemSettingScalarWhereWithAggregatesInput | SystemSettingScalarWhereWithAggregatesInput[]
    OR?: SystemSettingScalarWhereWithAggregatesInput[]
    NOT?: SystemSettingScalarWhereWithAggregatesInput | SystemSettingScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SystemSetting"> | string
    systemName?: StringWithAggregatesFilter<"SystemSetting"> | string
    systemDescription?: StringWithAggregatesFilter<"SystemSetting"> | string
    systemLogo?: StringNullableWithAggregatesFilter<"SystemSetting"> | string | null
    contactNumber?: StringWithAggregatesFilter<"SystemSetting"> | string
    officialEmail?: StringWithAggregatesFilter<"SystemSetting"> | string
    officeAddress?: StringWithAggregatesFilter<"SystemSetting"> | string
    timeZone?: StringWithAggregatesFilter<"SystemSetting"> | string
    dateFormat?: StringWithAggregatesFilter<"SystemSetting"> | string
    timeFormat?: StringWithAggregatesFilter<"SystemSetting"> | string
    notifNewInquiry?: BoolWithAggregatesFilter<"SystemSetting"> | boolean
    notifInquiryAccepted?: BoolWithAggregatesFilter<"SystemSetting"> | boolean
    notifInquiryRejected?: BoolWithAggregatesFilter<"SystemSetting"> | boolean
    notifPayment?: BoolWithAggregatesFilter<"SystemSetting"> | boolean
    notifOverduePayment?: BoolWithAggregatesFilter<"SystemSetting"> | boolean
    notifAnnouncement?: BoolWithAggregatesFilter<"SystemSetting"> | boolean
    notifGraveLocator?: BoolWithAggregatesFilter<"SystemSetting"> | boolean
    notifSystem?: BoolWithAggregatesFilter<"SystemSetting"> | boolean
    smsEnabled?: BoolWithAggregatesFilter<"SystemSetting"> | boolean
    smsProvider?: StringWithAggregatesFilter<"SystemSetting"> | string
    smsSenderName?: StringWithAggregatesFilter<"SystemSetting"> | string
    emailEnabled?: BoolWithAggregatesFilter<"SystemSetting"> | boolean
    emailSenderName?: StringWithAggregatesFilter<"SystemSetting"> | string
    emailSenderAddress?: StringWithAggregatesFilter<"SystemSetting"> | string
    userAccessEnabled?: BoolWithAggregatesFilter<"SystemSetting"> | boolean
    mobileAppEnabled?: BoolWithAggregatesFilter<"SystemSetting"> | boolean
    inquiriesEnabled?: BoolWithAggregatesFilter<"SystemSetting"> | boolean
    announcementsEnabled?: BoolWithAggregatesFilter<"SystemSetting"> | boolean
    graveLocatorEnabled?: BoolWithAggregatesFilter<"SystemSetting"> | boolean
    maintenanceMode?: BoolWithAggregatesFilter<"SystemSetting"> | boolean
    maintenanceMessage?: StringWithAggregatesFilter<"SystemSetting"> | string
    defaultTheme?: StringWithAggregatesFilter<"SystemSetting"> | string
    sidebarBehavior?: StringWithAggregatesFilter<"SystemSetting"> | string
    layoutDensity?: StringWithAggregatesFilter<"SystemSetting"> | string
    itemsPerPage?: IntWithAggregatesFilter<"SystemSetting"> | number
    defaultDashboardPage?: StringWithAggregatesFilter<"SystemSetting"> | string
    language?: StringWithAggregatesFilter<"SystemSetting"> | string
    lastBackupAt?: DateTimeNullableWithAggregatesFilter<"SystemSetting"> | Date | string | null
    lastBackupFile?: StringNullableWithAggregatesFilter<"SystemSetting"> | string | null
    backupStatus?: StringWithAggregatesFilter<"SystemSetting"> | string
    autoBackupEnabled?: BoolWithAggregatesFilter<"SystemSetting"> | boolean
    backupFrequency?: StringWithAggregatesFilter<"SystemSetting"> | string
    sessionTimeout?: IntWithAggregatesFilter<"SystemSetting"> | number
    updatedAt?: DateTimeWithAggregatesFilter<"SystemSetting"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"SystemSetting"> | Date | string
  }

  export type AdminAuditLogWhereInput = {
    AND?: AdminAuditLogWhereInput | AdminAuditLogWhereInput[]
    OR?: AdminAuditLogWhereInput[]
    NOT?: AdminAuditLogWhereInput | AdminAuditLogWhereInput[]
    id?: StringFilter<"AdminAuditLog"> | string
    activity?: StringFilter<"AdminAuditLog"> | string
    category?: StringFilter<"AdminAuditLog"> | string
    admin?: StringFilter<"AdminAuditLog"> | string
    status?: StringFilter<"AdminAuditLog"> | string
    details?: StringNullableFilter<"AdminAuditLog"> | string | null
    ipAddress?: StringNullableFilter<"AdminAuditLog"> | string | null
    createdAt?: DateTimeFilter<"AdminAuditLog"> | Date | string
  }

  export type AdminAuditLogOrderByWithRelationInput = {
    id?: SortOrder
    activity?: SortOrder
    category?: SortOrder
    admin?: SortOrder
    status?: SortOrder
    details?: SortOrderInput | SortOrder
    ipAddress?: SortOrderInput | SortOrder
    createdAt?: SortOrder
  }

  export type AdminAuditLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AdminAuditLogWhereInput | AdminAuditLogWhereInput[]
    OR?: AdminAuditLogWhereInput[]
    NOT?: AdminAuditLogWhereInput | AdminAuditLogWhereInput[]
    activity?: StringFilter<"AdminAuditLog"> | string
    category?: StringFilter<"AdminAuditLog"> | string
    admin?: StringFilter<"AdminAuditLog"> | string
    status?: StringFilter<"AdminAuditLog"> | string
    details?: StringNullableFilter<"AdminAuditLog"> | string | null
    ipAddress?: StringNullableFilter<"AdminAuditLog"> | string | null
    createdAt?: DateTimeFilter<"AdminAuditLog"> | Date | string
  }, "id">

  export type AdminAuditLogOrderByWithAggregationInput = {
    id?: SortOrder
    activity?: SortOrder
    category?: SortOrder
    admin?: SortOrder
    status?: SortOrder
    details?: SortOrderInput | SortOrder
    ipAddress?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: AdminAuditLogCountOrderByAggregateInput
    _max?: AdminAuditLogMaxOrderByAggregateInput
    _min?: AdminAuditLogMinOrderByAggregateInput
  }

  export type AdminAuditLogScalarWhereWithAggregatesInput = {
    AND?: AdminAuditLogScalarWhereWithAggregatesInput | AdminAuditLogScalarWhereWithAggregatesInput[]
    OR?: AdminAuditLogScalarWhereWithAggregatesInput[]
    NOT?: AdminAuditLogScalarWhereWithAggregatesInput | AdminAuditLogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AdminAuditLog"> | string
    activity?: StringWithAggregatesFilter<"AdminAuditLog"> | string
    category?: StringWithAggregatesFilter<"AdminAuditLog"> | string
    admin?: StringWithAggregatesFilter<"AdminAuditLog"> | string
    status?: StringWithAggregatesFilter<"AdminAuditLog"> | string
    details?: StringNullableWithAggregatesFilter<"AdminAuditLog"> | string | null
    ipAddress?: StringNullableWithAggregatesFilter<"AdminAuditLog"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"AdminAuditLog"> | Date | string
  }

  export type EmailVerificationWhereInput = {
    AND?: EmailVerificationWhereInput | EmailVerificationWhereInput[]
    OR?: EmailVerificationWhereInput[]
    NOT?: EmailVerificationWhereInput | EmailVerificationWhereInput[]
    id?: StringFilter<"EmailVerification"> | string
    email?: StringFilter<"EmailVerification"> | string
    codeHash?: StringFilter<"EmailVerification"> | string
    attempts?: IntFilter<"EmailVerification"> | number
    expiresAt?: DateTimeFilter<"EmailVerification"> | Date | string
    verifiedAt?: DateTimeNullableFilter<"EmailVerification"> | Date | string | null
    createdAt?: DateTimeFilter<"EmailVerification"> | Date | string
  }

  export type EmailVerificationOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    codeHash?: SortOrder
    attempts?: SortOrder
    expiresAt?: SortOrder
    verifiedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
  }

  export type EmailVerificationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: EmailVerificationWhereInput | EmailVerificationWhereInput[]
    OR?: EmailVerificationWhereInput[]
    NOT?: EmailVerificationWhereInput | EmailVerificationWhereInput[]
    email?: StringFilter<"EmailVerification"> | string
    codeHash?: StringFilter<"EmailVerification"> | string
    attempts?: IntFilter<"EmailVerification"> | number
    expiresAt?: DateTimeFilter<"EmailVerification"> | Date | string
    verifiedAt?: DateTimeNullableFilter<"EmailVerification"> | Date | string | null
    createdAt?: DateTimeFilter<"EmailVerification"> | Date | string
  }, "id">

  export type EmailVerificationOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    codeHash?: SortOrder
    attempts?: SortOrder
    expiresAt?: SortOrder
    verifiedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: EmailVerificationCountOrderByAggregateInput
    _avg?: EmailVerificationAvgOrderByAggregateInput
    _max?: EmailVerificationMaxOrderByAggregateInput
    _min?: EmailVerificationMinOrderByAggregateInput
    _sum?: EmailVerificationSumOrderByAggregateInput
  }

  export type EmailVerificationScalarWhereWithAggregatesInput = {
    AND?: EmailVerificationScalarWhereWithAggregatesInput | EmailVerificationScalarWhereWithAggregatesInput[]
    OR?: EmailVerificationScalarWhereWithAggregatesInput[]
    NOT?: EmailVerificationScalarWhereWithAggregatesInput | EmailVerificationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"EmailVerification"> | string
    email?: StringWithAggregatesFilter<"EmailVerification"> | string
    codeHash?: StringWithAggregatesFilter<"EmailVerification"> | string
    attempts?: IntWithAggregatesFilter<"EmailVerification"> | number
    expiresAt?: DateTimeWithAggregatesFilter<"EmailVerification"> | Date | string
    verifiedAt?: DateTimeNullableWithAggregatesFilter<"EmailVerification"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"EmailVerification"> | Date | string
  }

  export type PasswordResetWhereInput = {
    AND?: PasswordResetWhereInput | PasswordResetWhereInput[]
    OR?: PasswordResetWhereInput[]
    NOT?: PasswordResetWhereInput | PasswordResetWhereInput[]
    id?: StringFilter<"PasswordReset"> | string
    email?: StringFilter<"PasswordReset"> | string
    tokenHash?: StringFilter<"PasswordReset"> | string
    expiresAt?: DateTimeFilter<"PasswordReset"> | Date | string
    usedAt?: DateTimeNullableFilter<"PasswordReset"> | Date | string | null
    createdAt?: DateTimeFilter<"PasswordReset"> | Date | string
  }

  export type PasswordResetOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    tokenHash?: SortOrder
    expiresAt?: SortOrder
    usedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
  }

  export type PasswordResetWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    tokenHash?: string
    AND?: PasswordResetWhereInput | PasswordResetWhereInput[]
    OR?: PasswordResetWhereInput[]
    NOT?: PasswordResetWhereInput | PasswordResetWhereInput[]
    email?: StringFilter<"PasswordReset"> | string
    expiresAt?: DateTimeFilter<"PasswordReset"> | Date | string
    usedAt?: DateTimeNullableFilter<"PasswordReset"> | Date | string | null
    createdAt?: DateTimeFilter<"PasswordReset"> | Date | string
  }, "id" | "tokenHash">

  export type PasswordResetOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    tokenHash?: SortOrder
    expiresAt?: SortOrder
    usedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: PasswordResetCountOrderByAggregateInput
    _max?: PasswordResetMaxOrderByAggregateInput
    _min?: PasswordResetMinOrderByAggregateInput
  }

  export type PasswordResetScalarWhereWithAggregatesInput = {
    AND?: PasswordResetScalarWhereWithAggregatesInput | PasswordResetScalarWhereWithAggregatesInput[]
    OR?: PasswordResetScalarWhereWithAggregatesInput[]
    NOT?: PasswordResetScalarWhereWithAggregatesInput | PasswordResetScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PasswordReset"> | string
    email?: StringWithAggregatesFilter<"PasswordReset"> | string
    tokenHash?: StringWithAggregatesFilter<"PasswordReset"> | string
    expiresAt?: DateTimeWithAggregatesFilter<"PasswordReset"> | Date | string
    usedAt?: DateTimeNullableWithAggregatesFilter<"PasswordReset"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"PasswordReset"> | Date | string
  }

  export type EmailNotificationLogWhereInput = {
    AND?: EmailNotificationLogWhereInput | EmailNotificationLogWhereInput[]
    OR?: EmailNotificationLogWhereInput[]
    NOT?: EmailNotificationLogWhereInput | EmailNotificationLogWhereInput[]
    id?: StringFilter<"EmailNotificationLog"> | string
    inquiryId?: IntNullableFilter<"EmailNotificationLog"> | number | null
    inquiryAppId?: StringNullableFilter<"EmailNotificationLog"> | string | null
    recipient?: StringFilter<"EmailNotificationLog"> | string
    emailType?: StringFilter<"EmailNotificationLog"> | string
    subject?: StringFilter<"EmailNotificationLog"> | string
    status?: StringFilter<"EmailNotificationLog"> | string
    sentAt?: DateTimeNullableFilter<"EmailNotificationLog"> | Date | string | null
    errorMessage?: StringNullableFilter<"EmailNotificationLog"> | string | null
    createdAt?: DateTimeFilter<"EmailNotificationLog"> | Date | string
    inquiry?: XOR<InquiriesNullableRelationFilter, InquiriesWhereInput> | null
  }

  export type EmailNotificationLogOrderByWithRelationInput = {
    id?: SortOrder
    inquiryId?: SortOrderInput | SortOrder
    inquiryAppId?: SortOrderInput | SortOrder
    recipient?: SortOrder
    emailType?: SortOrder
    subject?: SortOrder
    status?: SortOrder
    sentAt?: SortOrderInput | SortOrder
    errorMessage?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    inquiry?: InquiriesOrderByWithRelationInput
  }

  export type EmailNotificationLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: EmailNotificationLogWhereInput | EmailNotificationLogWhereInput[]
    OR?: EmailNotificationLogWhereInput[]
    NOT?: EmailNotificationLogWhereInput | EmailNotificationLogWhereInput[]
    inquiryId?: IntNullableFilter<"EmailNotificationLog"> | number | null
    inquiryAppId?: StringNullableFilter<"EmailNotificationLog"> | string | null
    recipient?: StringFilter<"EmailNotificationLog"> | string
    emailType?: StringFilter<"EmailNotificationLog"> | string
    subject?: StringFilter<"EmailNotificationLog"> | string
    status?: StringFilter<"EmailNotificationLog"> | string
    sentAt?: DateTimeNullableFilter<"EmailNotificationLog"> | Date | string | null
    errorMessage?: StringNullableFilter<"EmailNotificationLog"> | string | null
    createdAt?: DateTimeFilter<"EmailNotificationLog"> | Date | string
    inquiry?: XOR<InquiriesNullableRelationFilter, InquiriesWhereInput> | null
  }, "id">

  export type EmailNotificationLogOrderByWithAggregationInput = {
    id?: SortOrder
    inquiryId?: SortOrderInput | SortOrder
    inquiryAppId?: SortOrderInput | SortOrder
    recipient?: SortOrder
    emailType?: SortOrder
    subject?: SortOrder
    status?: SortOrder
    sentAt?: SortOrderInput | SortOrder
    errorMessage?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: EmailNotificationLogCountOrderByAggregateInput
    _avg?: EmailNotificationLogAvgOrderByAggregateInput
    _max?: EmailNotificationLogMaxOrderByAggregateInput
    _min?: EmailNotificationLogMinOrderByAggregateInput
    _sum?: EmailNotificationLogSumOrderByAggregateInput
  }

  export type EmailNotificationLogScalarWhereWithAggregatesInput = {
    AND?: EmailNotificationLogScalarWhereWithAggregatesInput | EmailNotificationLogScalarWhereWithAggregatesInput[]
    OR?: EmailNotificationLogScalarWhereWithAggregatesInput[]
    NOT?: EmailNotificationLogScalarWhereWithAggregatesInput | EmailNotificationLogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"EmailNotificationLog"> | string
    inquiryId?: IntNullableWithAggregatesFilter<"EmailNotificationLog"> | number | null
    inquiryAppId?: StringNullableWithAggregatesFilter<"EmailNotificationLog"> | string | null
    recipient?: StringWithAggregatesFilter<"EmailNotificationLog"> | string
    emailType?: StringWithAggregatesFilter<"EmailNotificationLog"> | string
    subject?: StringWithAggregatesFilter<"EmailNotificationLog"> | string
    status?: StringWithAggregatesFilter<"EmailNotificationLog"> | string
    sentAt?: DateTimeNullableWithAggregatesFilter<"EmailNotificationLog"> | Date | string | null
    errorMessage?: StringNullableWithAggregatesFilter<"EmailNotificationLog"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"EmailNotificationLog"> | Date | string
  }

  export type AdminCreateInput = {
    id?: string
    email: string
    password: string
    name?: string | null
    username?: string | null
    contactNumber?: string | null
    role?: string
    avatar?: string | null
    department?: string | null
    sessionTimeout?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AdminUncheckedCreateInput = {
    id?: string
    email: string
    password: string
    name?: string | null
    username?: string | null
    contactNumber?: string | null
    role?: string
    avatar?: string | null
    department?: string | null
    sessionTimeout?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AdminUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    contactNumber?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    department?: NullableStringFieldUpdateOperationsInput | string | null
    sessionTimeout?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AdminUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    contactNumber?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    department?: NullableStringFieldUpdateOperationsInput | string | null
    sessionTimeout?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AdminCreateManyInput = {
    id?: string
    email: string
    password: string
    name?: string | null
    username?: string | null
    contactNumber?: string | null
    role?: string
    avatar?: string | null
    department?: string | null
    sessionTimeout?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AdminUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    contactNumber?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    department?: NullableStringFieldUpdateOperationsInput | string | null
    sessionTimeout?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AdminUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    contactNumber?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    department?: NullableStringFieldUpdateOperationsInput | string | null
    sessionTimeout?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DeceasedRecordCreateInput = {
    id?: string
    REF_NO: string
    PAYORS_NAME: string
    CONTACT_NO: string
    NAME_OF_DECEASED: string
    ADDRESS: string
    DATE_OF_BIRTH: Date | string
    DATE_OF_DEATH: Date | string
    YEAR: number
    TOTAL_DUE: number
    PAID: number
    BALANCE: number
    STATUS: string
    REMARKS?: string | null
    isArchived?: boolean
    archivedAt?: Date | string | null
    archiveReason?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    payments?: PaymentRecordCreateNestedManyWithoutDeceasedRecordInput
  }

  export type DeceasedRecordUncheckedCreateInput = {
    id?: string
    REF_NO: string
    PAYORS_NAME: string
    CONTACT_NO: string
    NAME_OF_DECEASED: string
    ADDRESS: string
    DATE_OF_BIRTH: Date | string
    DATE_OF_DEATH: Date | string
    YEAR: number
    TOTAL_DUE: number
    PAID: number
    BALANCE: number
    STATUS: string
    REMARKS?: string | null
    isArchived?: boolean
    archivedAt?: Date | string | null
    archiveReason?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    payments?: PaymentRecordUncheckedCreateNestedManyWithoutDeceasedRecordInput
  }

  export type DeceasedRecordUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    REF_NO?: StringFieldUpdateOperationsInput | string
    PAYORS_NAME?: StringFieldUpdateOperationsInput | string
    CONTACT_NO?: StringFieldUpdateOperationsInput | string
    NAME_OF_DECEASED?: StringFieldUpdateOperationsInput | string
    ADDRESS?: StringFieldUpdateOperationsInput | string
    DATE_OF_BIRTH?: DateTimeFieldUpdateOperationsInput | Date | string
    DATE_OF_DEATH?: DateTimeFieldUpdateOperationsInput | Date | string
    YEAR?: IntFieldUpdateOperationsInput | number
    TOTAL_DUE?: FloatFieldUpdateOperationsInput | number
    PAID?: FloatFieldUpdateOperationsInput | number
    BALANCE?: FloatFieldUpdateOperationsInput | number
    STATUS?: StringFieldUpdateOperationsInput | string
    REMARKS?: NullableStringFieldUpdateOperationsInput | string | null
    isArchived?: BoolFieldUpdateOperationsInput | boolean
    archivedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    archiveReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    payments?: PaymentRecordUpdateManyWithoutDeceasedRecordNestedInput
  }

  export type DeceasedRecordUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    REF_NO?: StringFieldUpdateOperationsInput | string
    PAYORS_NAME?: StringFieldUpdateOperationsInput | string
    CONTACT_NO?: StringFieldUpdateOperationsInput | string
    NAME_OF_DECEASED?: StringFieldUpdateOperationsInput | string
    ADDRESS?: StringFieldUpdateOperationsInput | string
    DATE_OF_BIRTH?: DateTimeFieldUpdateOperationsInput | Date | string
    DATE_OF_DEATH?: DateTimeFieldUpdateOperationsInput | Date | string
    YEAR?: IntFieldUpdateOperationsInput | number
    TOTAL_DUE?: FloatFieldUpdateOperationsInput | number
    PAID?: FloatFieldUpdateOperationsInput | number
    BALANCE?: FloatFieldUpdateOperationsInput | number
    STATUS?: StringFieldUpdateOperationsInput | string
    REMARKS?: NullableStringFieldUpdateOperationsInput | string | null
    isArchived?: BoolFieldUpdateOperationsInput | boolean
    archivedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    archiveReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    payments?: PaymentRecordUncheckedUpdateManyWithoutDeceasedRecordNestedInput
  }

  export type DeceasedRecordCreateManyInput = {
    id?: string
    REF_NO: string
    PAYORS_NAME: string
    CONTACT_NO: string
    NAME_OF_DECEASED: string
    ADDRESS: string
    DATE_OF_BIRTH: Date | string
    DATE_OF_DEATH: Date | string
    YEAR: number
    TOTAL_DUE: number
    PAID: number
    BALANCE: number
    STATUS: string
    REMARKS?: string | null
    isArchived?: boolean
    archivedAt?: Date | string | null
    archiveReason?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DeceasedRecordUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    REF_NO?: StringFieldUpdateOperationsInput | string
    PAYORS_NAME?: StringFieldUpdateOperationsInput | string
    CONTACT_NO?: StringFieldUpdateOperationsInput | string
    NAME_OF_DECEASED?: StringFieldUpdateOperationsInput | string
    ADDRESS?: StringFieldUpdateOperationsInput | string
    DATE_OF_BIRTH?: DateTimeFieldUpdateOperationsInput | Date | string
    DATE_OF_DEATH?: DateTimeFieldUpdateOperationsInput | Date | string
    YEAR?: IntFieldUpdateOperationsInput | number
    TOTAL_DUE?: FloatFieldUpdateOperationsInput | number
    PAID?: FloatFieldUpdateOperationsInput | number
    BALANCE?: FloatFieldUpdateOperationsInput | number
    STATUS?: StringFieldUpdateOperationsInput | string
    REMARKS?: NullableStringFieldUpdateOperationsInput | string | null
    isArchived?: BoolFieldUpdateOperationsInput | boolean
    archivedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    archiveReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DeceasedRecordUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    REF_NO?: StringFieldUpdateOperationsInput | string
    PAYORS_NAME?: StringFieldUpdateOperationsInput | string
    CONTACT_NO?: StringFieldUpdateOperationsInput | string
    NAME_OF_DECEASED?: StringFieldUpdateOperationsInput | string
    ADDRESS?: StringFieldUpdateOperationsInput | string
    DATE_OF_BIRTH?: DateTimeFieldUpdateOperationsInput | Date | string
    DATE_OF_DEATH?: DateTimeFieldUpdateOperationsInput | Date | string
    YEAR?: IntFieldUpdateOperationsInput | number
    TOTAL_DUE?: FloatFieldUpdateOperationsInput | number
    PAID?: FloatFieldUpdateOperationsInput | number
    BALANCE?: FloatFieldUpdateOperationsInput | number
    STATUS?: StringFieldUpdateOperationsInput | string
    REMARKS?: NullableStringFieldUpdateOperationsInput | string | null
    isArchived?: BoolFieldUpdateOperationsInput | boolean
    archivedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    archiveReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentRecordCreateInput = {
    id?: string
    REF_NO: string
    PAYORS_NAME: string
    CONTACT_NO?: string | null
    NAME_OF_DECEASED: string
    ADDRESS?: string | null
    DATE_OF_BIRTH?: Date | string | null
    DATE_OF_DEATH?: Date | string | null
    YEAR: number
    TOTAL_DUE?: number
    PAID?: number
    BALANCE?: number
    STATUS?: string
    REMARKS?: string | null
    OR_NO?: string | null
    DATE_PAID?: string | null
    METHOD?: string | null
    DUE_DATE?: string | null
    isArchived?: boolean
    archivedAt?: Date | string | null
    archiveReason?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deceasedRecord?: DeceasedRecordCreateNestedOneWithoutPaymentsInput
  }

  export type PaymentRecordUncheckedCreateInput = {
    id?: string
    REF_NO: string
    PAYORS_NAME: string
    CONTACT_NO?: string | null
    NAME_OF_DECEASED: string
    ADDRESS?: string | null
    DATE_OF_BIRTH?: Date | string | null
    DATE_OF_DEATH?: Date | string | null
    YEAR: number
    TOTAL_DUE?: number
    PAID?: number
    BALANCE?: number
    STATUS?: string
    REMARKS?: string | null
    OR_NO?: string | null
    DATE_PAID?: string | null
    METHOD?: string | null
    DUE_DATE?: string | null
    deceasedRecordId?: string | null
    isArchived?: boolean
    archivedAt?: Date | string | null
    archiveReason?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PaymentRecordUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    REF_NO?: StringFieldUpdateOperationsInput | string
    PAYORS_NAME?: StringFieldUpdateOperationsInput | string
    CONTACT_NO?: NullableStringFieldUpdateOperationsInput | string | null
    NAME_OF_DECEASED?: StringFieldUpdateOperationsInput | string
    ADDRESS?: NullableStringFieldUpdateOperationsInput | string | null
    DATE_OF_BIRTH?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    DATE_OF_DEATH?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    YEAR?: IntFieldUpdateOperationsInput | number
    TOTAL_DUE?: FloatFieldUpdateOperationsInput | number
    PAID?: FloatFieldUpdateOperationsInput | number
    BALANCE?: FloatFieldUpdateOperationsInput | number
    STATUS?: StringFieldUpdateOperationsInput | string
    REMARKS?: NullableStringFieldUpdateOperationsInput | string | null
    OR_NO?: NullableStringFieldUpdateOperationsInput | string | null
    DATE_PAID?: NullableStringFieldUpdateOperationsInput | string | null
    METHOD?: NullableStringFieldUpdateOperationsInput | string | null
    DUE_DATE?: NullableStringFieldUpdateOperationsInput | string | null
    isArchived?: BoolFieldUpdateOperationsInput | boolean
    archivedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    archiveReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deceasedRecord?: DeceasedRecordUpdateOneWithoutPaymentsNestedInput
  }

  export type PaymentRecordUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    REF_NO?: StringFieldUpdateOperationsInput | string
    PAYORS_NAME?: StringFieldUpdateOperationsInput | string
    CONTACT_NO?: NullableStringFieldUpdateOperationsInput | string | null
    NAME_OF_DECEASED?: StringFieldUpdateOperationsInput | string
    ADDRESS?: NullableStringFieldUpdateOperationsInput | string | null
    DATE_OF_BIRTH?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    DATE_OF_DEATH?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    YEAR?: IntFieldUpdateOperationsInput | number
    TOTAL_DUE?: FloatFieldUpdateOperationsInput | number
    PAID?: FloatFieldUpdateOperationsInput | number
    BALANCE?: FloatFieldUpdateOperationsInput | number
    STATUS?: StringFieldUpdateOperationsInput | string
    REMARKS?: NullableStringFieldUpdateOperationsInput | string | null
    OR_NO?: NullableStringFieldUpdateOperationsInput | string | null
    DATE_PAID?: NullableStringFieldUpdateOperationsInput | string | null
    METHOD?: NullableStringFieldUpdateOperationsInput | string | null
    DUE_DATE?: NullableStringFieldUpdateOperationsInput | string | null
    deceasedRecordId?: NullableStringFieldUpdateOperationsInput | string | null
    isArchived?: BoolFieldUpdateOperationsInput | boolean
    archivedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    archiveReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentRecordCreateManyInput = {
    id?: string
    REF_NO: string
    PAYORS_NAME: string
    CONTACT_NO?: string | null
    NAME_OF_DECEASED: string
    ADDRESS?: string | null
    DATE_OF_BIRTH?: Date | string | null
    DATE_OF_DEATH?: Date | string | null
    YEAR: number
    TOTAL_DUE?: number
    PAID?: number
    BALANCE?: number
    STATUS?: string
    REMARKS?: string | null
    OR_NO?: string | null
    DATE_PAID?: string | null
    METHOD?: string | null
    DUE_DATE?: string | null
    deceasedRecordId?: string | null
    isArchived?: boolean
    archivedAt?: Date | string | null
    archiveReason?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PaymentRecordUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    REF_NO?: StringFieldUpdateOperationsInput | string
    PAYORS_NAME?: StringFieldUpdateOperationsInput | string
    CONTACT_NO?: NullableStringFieldUpdateOperationsInput | string | null
    NAME_OF_DECEASED?: StringFieldUpdateOperationsInput | string
    ADDRESS?: NullableStringFieldUpdateOperationsInput | string | null
    DATE_OF_BIRTH?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    DATE_OF_DEATH?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    YEAR?: IntFieldUpdateOperationsInput | number
    TOTAL_DUE?: FloatFieldUpdateOperationsInput | number
    PAID?: FloatFieldUpdateOperationsInput | number
    BALANCE?: FloatFieldUpdateOperationsInput | number
    STATUS?: StringFieldUpdateOperationsInput | string
    REMARKS?: NullableStringFieldUpdateOperationsInput | string | null
    OR_NO?: NullableStringFieldUpdateOperationsInput | string | null
    DATE_PAID?: NullableStringFieldUpdateOperationsInput | string | null
    METHOD?: NullableStringFieldUpdateOperationsInput | string | null
    DUE_DATE?: NullableStringFieldUpdateOperationsInput | string | null
    isArchived?: BoolFieldUpdateOperationsInput | boolean
    archivedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    archiveReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentRecordUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    REF_NO?: StringFieldUpdateOperationsInput | string
    PAYORS_NAME?: StringFieldUpdateOperationsInput | string
    CONTACT_NO?: NullableStringFieldUpdateOperationsInput | string | null
    NAME_OF_DECEASED?: StringFieldUpdateOperationsInput | string
    ADDRESS?: NullableStringFieldUpdateOperationsInput | string | null
    DATE_OF_BIRTH?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    DATE_OF_DEATH?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    YEAR?: IntFieldUpdateOperationsInput | number
    TOTAL_DUE?: FloatFieldUpdateOperationsInput | number
    PAID?: FloatFieldUpdateOperationsInput | number
    BALANCE?: FloatFieldUpdateOperationsInput | number
    STATUS?: StringFieldUpdateOperationsInput | string
    REMARKS?: NullableStringFieldUpdateOperationsInput | string | null
    OR_NO?: NullableStringFieldUpdateOperationsInput | string | null
    DATE_PAID?: NullableStringFieldUpdateOperationsInput | string | null
    METHOD?: NullableStringFieldUpdateOperationsInput | string | null
    DUE_DATE?: NullableStringFieldUpdateOperationsInput | string | null
    deceasedRecordId?: NullableStringFieldUpdateOperationsInput | string | null
    isArchived?: BoolFieldUpdateOperationsInput | boolean
    archivedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    archiveReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InquiriesCreateInput = {
    APP_ID: string
    FAMILY_NAME: string
    DECEASED?: string | null
    REQUESTED_PLOT?: string | null
    BURIAL_DATE?: Date | string | null
    TIME?: string | null
    CONTACT: string
    STATUS?: string
    email: string
    emailVerified?: boolean
    emailVerifiedAt?: Date | string | null
    relationship: string
    address?: string | null
    reason: string
    notes?: string | null
    remarks?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    emailLogs?: EmailNotificationLogCreateNestedManyWithoutInquiryInput
  }

  export type InquiriesUncheckedCreateInput = {
    id?: number
    APP_ID: string
    FAMILY_NAME: string
    DECEASED?: string | null
    REQUESTED_PLOT?: string | null
    BURIAL_DATE?: Date | string | null
    TIME?: string | null
    CONTACT: string
    STATUS?: string
    email: string
    emailVerified?: boolean
    emailVerifiedAt?: Date | string | null
    relationship: string
    address?: string | null
    reason: string
    notes?: string | null
    remarks?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    emailLogs?: EmailNotificationLogUncheckedCreateNestedManyWithoutInquiryInput
  }

  export type InquiriesUpdateInput = {
    APP_ID?: StringFieldUpdateOperationsInput | string
    FAMILY_NAME?: StringFieldUpdateOperationsInput | string
    DECEASED?: NullableStringFieldUpdateOperationsInput | string | null
    REQUESTED_PLOT?: NullableStringFieldUpdateOperationsInput | string | null
    BURIAL_DATE?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    TIME?: NullableStringFieldUpdateOperationsInput | string | null
    CONTACT?: StringFieldUpdateOperationsInput | string
    STATUS?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    emailVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    relationship?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    reason?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    emailLogs?: EmailNotificationLogUpdateManyWithoutInquiryNestedInput
  }

  export type InquiriesUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    APP_ID?: StringFieldUpdateOperationsInput | string
    FAMILY_NAME?: StringFieldUpdateOperationsInput | string
    DECEASED?: NullableStringFieldUpdateOperationsInput | string | null
    REQUESTED_PLOT?: NullableStringFieldUpdateOperationsInput | string | null
    BURIAL_DATE?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    TIME?: NullableStringFieldUpdateOperationsInput | string | null
    CONTACT?: StringFieldUpdateOperationsInput | string
    STATUS?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    emailVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    relationship?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    reason?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    emailLogs?: EmailNotificationLogUncheckedUpdateManyWithoutInquiryNestedInput
  }

  export type InquiriesCreateManyInput = {
    id?: number
    APP_ID: string
    FAMILY_NAME: string
    DECEASED?: string | null
    REQUESTED_PLOT?: string | null
    BURIAL_DATE?: Date | string | null
    TIME?: string | null
    CONTACT: string
    STATUS?: string
    email: string
    emailVerified?: boolean
    emailVerifiedAt?: Date | string | null
    relationship: string
    address?: string | null
    reason: string
    notes?: string | null
    remarks?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type InquiriesUpdateManyMutationInput = {
    APP_ID?: StringFieldUpdateOperationsInput | string
    FAMILY_NAME?: StringFieldUpdateOperationsInput | string
    DECEASED?: NullableStringFieldUpdateOperationsInput | string | null
    REQUESTED_PLOT?: NullableStringFieldUpdateOperationsInput | string | null
    BURIAL_DATE?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    TIME?: NullableStringFieldUpdateOperationsInput | string | null
    CONTACT?: StringFieldUpdateOperationsInput | string
    STATUS?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    emailVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    relationship?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    reason?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InquiriesUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    APP_ID?: StringFieldUpdateOperationsInput | string
    FAMILY_NAME?: StringFieldUpdateOperationsInput | string
    DECEASED?: NullableStringFieldUpdateOperationsInput | string | null
    REQUESTED_PLOT?: NullableStringFieldUpdateOperationsInput | string | null
    BURIAL_DATE?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    TIME?: NullableStringFieldUpdateOperationsInput | string | null
    CONTACT?: StringFieldUpdateOperationsInput | string
    STATUS?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    emailVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    relationship?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    reason?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AnnouncementCreateInput = {
    title: string
    content: string
    category: string
    badge?: string | null
    visibility: string
    status?: string
    date?: Date | string
    validFrom?: string | null
    validUntil?: string | null
    views?: number
  }

  export type AnnouncementUncheckedCreateInput = {
    id?: number
    title: string
    content: string
    category: string
    badge?: string | null
    visibility: string
    status?: string
    date?: Date | string
    validFrom?: string | null
    validUntil?: string | null
    views?: number
  }

  export type AnnouncementUpdateInput = {
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    badge?: NullableStringFieldUpdateOperationsInput | string | null
    visibility?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    validFrom?: NullableStringFieldUpdateOperationsInput | string | null
    validUntil?: NullableStringFieldUpdateOperationsInput | string | null
    views?: IntFieldUpdateOperationsInput | number
  }

  export type AnnouncementUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    badge?: NullableStringFieldUpdateOperationsInput | string | null
    visibility?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    validFrom?: NullableStringFieldUpdateOperationsInput | string | null
    validUntil?: NullableStringFieldUpdateOperationsInput | string | null
    views?: IntFieldUpdateOperationsInput | number
  }

  export type AnnouncementCreateManyInput = {
    id?: number
    title: string
    content: string
    category: string
    badge?: string | null
    visibility: string
    status?: string
    date?: Date | string
    validFrom?: string | null
    validUntil?: string | null
    views?: number
  }

  export type AnnouncementUpdateManyMutationInput = {
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    badge?: NullableStringFieldUpdateOperationsInput | string | null
    visibility?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    validFrom?: NullableStringFieldUpdateOperationsInput | string | null
    validUntil?: NullableStringFieldUpdateOperationsInput | string | null
    views?: IntFieldUpdateOperationsInput | number
  }

  export type AnnouncementUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    badge?: NullableStringFieldUpdateOperationsInput | string | null
    visibility?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    validFrom?: NullableStringFieldUpdateOperationsInput | string | null
    validUntil?: NullableStringFieldUpdateOperationsInput | string | null
    views?: IntFieldUpdateOperationsInput | number
  }

  export type SmsNotificationCreateInput = {
    id?: string
    recipient: string
    recipientName?: string | null
    message: string
    semaphoreId?: string | null
    status?: string
    type?: string | null
    senderName?: string | null
    sentBy?: string | null
    errorMessage?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SmsNotificationUncheckedCreateInput = {
    id?: string
    recipient: string
    recipientName?: string | null
    message: string
    semaphoreId?: string | null
    status?: string
    type?: string | null
    senderName?: string | null
    sentBy?: string | null
    errorMessage?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SmsNotificationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    recipient?: StringFieldUpdateOperationsInput | string
    recipientName?: NullableStringFieldUpdateOperationsInput | string | null
    message?: StringFieldUpdateOperationsInput | string
    semaphoreId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    type?: NullableStringFieldUpdateOperationsInput | string | null
    senderName?: NullableStringFieldUpdateOperationsInput | string | null
    sentBy?: NullableStringFieldUpdateOperationsInput | string | null
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SmsNotificationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    recipient?: StringFieldUpdateOperationsInput | string
    recipientName?: NullableStringFieldUpdateOperationsInput | string | null
    message?: StringFieldUpdateOperationsInput | string
    semaphoreId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    type?: NullableStringFieldUpdateOperationsInput | string | null
    senderName?: NullableStringFieldUpdateOperationsInput | string | null
    sentBy?: NullableStringFieldUpdateOperationsInput | string | null
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SmsNotificationCreateManyInput = {
    id?: string
    recipient: string
    recipientName?: string | null
    message: string
    semaphoreId?: string | null
    status?: string
    type?: string | null
    senderName?: string | null
    sentBy?: string | null
    errorMessage?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SmsNotificationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    recipient?: StringFieldUpdateOperationsInput | string
    recipientName?: NullableStringFieldUpdateOperationsInput | string | null
    message?: StringFieldUpdateOperationsInput | string
    semaphoreId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    type?: NullableStringFieldUpdateOperationsInput | string | null
    senderName?: NullableStringFieldUpdateOperationsInput | string | null
    sentBy?: NullableStringFieldUpdateOperationsInput | string | null
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SmsNotificationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    recipient?: StringFieldUpdateOperationsInput | string
    recipientName?: NullableStringFieldUpdateOperationsInput | string | null
    message?: StringFieldUpdateOperationsInput | string
    semaphoreId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    type?: NullableStringFieldUpdateOperationsInput | string | null
    senderName?: NullableStringFieldUpdateOperationsInput | string | null
    sentBy?: NullableStringFieldUpdateOperationsInput | string | null
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SystemSettingCreateInput = {
    id?: string
    systemName?: string
    systemDescription?: string
    systemLogo?: string | null
    contactNumber?: string
    officialEmail?: string
    officeAddress?: string
    timeZone?: string
    dateFormat?: string
    timeFormat?: string
    notifNewInquiry?: boolean
    notifInquiryAccepted?: boolean
    notifInquiryRejected?: boolean
    notifPayment?: boolean
    notifOverduePayment?: boolean
    notifAnnouncement?: boolean
    notifGraveLocator?: boolean
    notifSystem?: boolean
    smsEnabled?: boolean
    smsProvider?: string
    smsSenderName?: string
    emailEnabled?: boolean
    emailSenderName?: string
    emailSenderAddress?: string
    userAccessEnabled?: boolean
    mobileAppEnabled?: boolean
    inquiriesEnabled?: boolean
    announcementsEnabled?: boolean
    graveLocatorEnabled?: boolean
    maintenanceMode?: boolean
    maintenanceMessage?: string
    defaultTheme?: string
    sidebarBehavior?: string
    layoutDensity?: string
    itemsPerPage?: number
    defaultDashboardPage?: string
    language?: string
    lastBackupAt?: Date | string | null
    lastBackupFile?: string | null
    backupStatus?: string
    autoBackupEnabled?: boolean
    backupFrequency?: string
    sessionTimeout?: number
    updatedAt?: Date | string
    createdAt?: Date | string
  }

  export type SystemSettingUncheckedCreateInput = {
    id?: string
    systemName?: string
    systemDescription?: string
    systemLogo?: string | null
    contactNumber?: string
    officialEmail?: string
    officeAddress?: string
    timeZone?: string
    dateFormat?: string
    timeFormat?: string
    notifNewInquiry?: boolean
    notifInquiryAccepted?: boolean
    notifInquiryRejected?: boolean
    notifPayment?: boolean
    notifOverduePayment?: boolean
    notifAnnouncement?: boolean
    notifGraveLocator?: boolean
    notifSystem?: boolean
    smsEnabled?: boolean
    smsProvider?: string
    smsSenderName?: string
    emailEnabled?: boolean
    emailSenderName?: string
    emailSenderAddress?: string
    userAccessEnabled?: boolean
    mobileAppEnabled?: boolean
    inquiriesEnabled?: boolean
    announcementsEnabled?: boolean
    graveLocatorEnabled?: boolean
    maintenanceMode?: boolean
    maintenanceMessage?: string
    defaultTheme?: string
    sidebarBehavior?: string
    layoutDensity?: string
    itemsPerPage?: number
    defaultDashboardPage?: string
    language?: string
    lastBackupAt?: Date | string | null
    lastBackupFile?: string | null
    backupStatus?: string
    autoBackupEnabled?: boolean
    backupFrequency?: string
    sessionTimeout?: number
    updatedAt?: Date | string
    createdAt?: Date | string
  }

  export type SystemSettingUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    systemName?: StringFieldUpdateOperationsInput | string
    systemDescription?: StringFieldUpdateOperationsInput | string
    systemLogo?: NullableStringFieldUpdateOperationsInput | string | null
    contactNumber?: StringFieldUpdateOperationsInput | string
    officialEmail?: StringFieldUpdateOperationsInput | string
    officeAddress?: StringFieldUpdateOperationsInput | string
    timeZone?: StringFieldUpdateOperationsInput | string
    dateFormat?: StringFieldUpdateOperationsInput | string
    timeFormat?: StringFieldUpdateOperationsInput | string
    notifNewInquiry?: BoolFieldUpdateOperationsInput | boolean
    notifInquiryAccepted?: BoolFieldUpdateOperationsInput | boolean
    notifInquiryRejected?: BoolFieldUpdateOperationsInput | boolean
    notifPayment?: BoolFieldUpdateOperationsInput | boolean
    notifOverduePayment?: BoolFieldUpdateOperationsInput | boolean
    notifAnnouncement?: BoolFieldUpdateOperationsInput | boolean
    notifGraveLocator?: BoolFieldUpdateOperationsInput | boolean
    notifSystem?: BoolFieldUpdateOperationsInput | boolean
    smsEnabled?: BoolFieldUpdateOperationsInput | boolean
    smsProvider?: StringFieldUpdateOperationsInput | string
    smsSenderName?: StringFieldUpdateOperationsInput | string
    emailEnabled?: BoolFieldUpdateOperationsInput | boolean
    emailSenderName?: StringFieldUpdateOperationsInput | string
    emailSenderAddress?: StringFieldUpdateOperationsInput | string
    userAccessEnabled?: BoolFieldUpdateOperationsInput | boolean
    mobileAppEnabled?: BoolFieldUpdateOperationsInput | boolean
    inquiriesEnabled?: BoolFieldUpdateOperationsInput | boolean
    announcementsEnabled?: BoolFieldUpdateOperationsInput | boolean
    graveLocatorEnabled?: BoolFieldUpdateOperationsInput | boolean
    maintenanceMode?: BoolFieldUpdateOperationsInput | boolean
    maintenanceMessage?: StringFieldUpdateOperationsInput | string
    defaultTheme?: StringFieldUpdateOperationsInput | string
    sidebarBehavior?: StringFieldUpdateOperationsInput | string
    layoutDensity?: StringFieldUpdateOperationsInput | string
    itemsPerPage?: IntFieldUpdateOperationsInput | number
    defaultDashboardPage?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    lastBackupAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastBackupFile?: NullableStringFieldUpdateOperationsInput | string | null
    backupStatus?: StringFieldUpdateOperationsInput | string
    autoBackupEnabled?: BoolFieldUpdateOperationsInput | boolean
    backupFrequency?: StringFieldUpdateOperationsInput | string
    sessionTimeout?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SystemSettingUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    systemName?: StringFieldUpdateOperationsInput | string
    systemDescription?: StringFieldUpdateOperationsInput | string
    systemLogo?: NullableStringFieldUpdateOperationsInput | string | null
    contactNumber?: StringFieldUpdateOperationsInput | string
    officialEmail?: StringFieldUpdateOperationsInput | string
    officeAddress?: StringFieldUpdateOperationsInput | string
    timeZone?: StringFieldUpdateOperationsInput | string
    dateFormat?: StringFieldUpdateOperationsInput | string
    timeFormat?: StringFieldUpdateOperationsInput | string
    notifNewInquiry?: BoolFieldUpdateOperationsInput | boolean
    notifInquiryAccepted?: BoolFieldUpdateOperationsInput | boolean
    notifInquiryRejected?: BoolFieldUpdateOperationsInput | boolean
    notifPayment?: BoolFieldUpdateOperationsInput | boolean
    notifOverduePayment?: BoolFieldUpdateOperationsInput | boolean
    notifAnnouncement?: BoolFieldUpdateOperationsInput | boolean
    notifGraveLocator?: BoolFieldUpdateOperationsInput | boolean
    notifSystem?: BoolFieldUpdateOperationsInput | boolean
    smsEnabled?: BoolFieldUpdateOperationsInput | boolean
    smsProvider?: StringFieldUpdateOperationsInput | string
    smsSenderName?: StringFieldUpdateOperationsInput | string
    emailEnabled?: BoolFieldUpdateOperationsInput | boolean
    emailSenderName?: StringFieldUpdateOperationsInput | string
    emailSenderAddress?: StringFieldUpdateOperationsInput | string
    userAccessEnabled?: BoolFieldUpdateOperationsInput | boolean
    mobileAppEnabled?: BoolFieldUpdateOperationsInput | boolean
    inquiriesEnabled?: BoolFieldUpdateOperationsInput | boolean
    announcementsEnabled?: BoolFieldUpdateOperationsInput | boolean
    graveLocatorEnabled?: BoolFieldUpdateOperationsInput | boolean
    maintenanceMode?: BoolFieldUpdateOperationsInput | boolean
    maintenanceMessage?: StringFieldUpdateOperationsInput | string
    defaultTheme?: StringFieldUpdateOperationsInput | string
    sidebarBehavior?: StringFieldUpdateOperationsInput | string
    layoutDensity?: StringFieldUpdateOperationsInput | string
    itemsPerPage?: IntFieldUpdateOperationsInput | number
    defaultDashboardPage?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    lastBackupAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastBackupFile?: NullableStringFieldUpdateOperationsInput | string | null
    backupStatus?: StringFieldUpdateOperationsInput | string
    autoBackupEnabled?: BoolFieldUpdateOperationsInput | boolean
    backupFrequency?: StringFieldUpdateOperationsInput | string
    sessionTimeout?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SystemSettingCreateManyInput = {
    id?: string
    systemName?: string
    systemDescription?: string
    systemLogo?: string | null
    contactNumber?: string
    officialEmail?: string
    officeAddress?: string
    timeZone?: string
    dateFormat?: string
    timeFormat?: string
    notifNewInquiry?: boolean
    notifInquiryAccepted?: boolean
    notifInquiryRejected?: boolean
    notifPayment?: boolean
    notifOverduePayment?: boolean
    notifAnnouncement?: boolean
    notifGraveLocator?: boolean
    notifSystem?: boolean
    smsEnabled?: boolean
    smsProvider?: string
    smsSenderName?: string
    emailEnabled?: boolean
    emailSenderName?: string
    emailSenderAddress?: string
    userAccessEnabled?: boolean
    mobileAppEnabled?: boolean
    inquiriesEnabled?: boolean
    announcementsEnabled?: boolean
    graveLocatorEnabled?: boolean
    maintenanceMode?: boolean
    maintenanceMessage?: string
    defaultTheme?: string
    sidebarBehavior?: string
    layoutDensity?: string
    itemsPerPage?: number
    defaultDashboardPage?: string
    language?: string
    lastBackupAt?: Date | string | null
    lastBackupFile?: string | null
    backupStatus?: string
    autoBackupEnabled?: boolean
    backupFrequency?: string
    sessionTimeout?: number
    updatedAt?: Date | string
    createdAt?: Date | string
  }

  export type SystemSettingUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    systemName?: StringFieldUpdateOperationsInput | string
    systemDescription?: StringFieldUpdateOperationsInput | string
    systemLogo?: NullableStringFieldUpdateOperationsInput | string | null
    contactNumber?: StringFieldUpdateOperationsInput | string
    officialEmail?: StringFieldUpdateOperationsInput | string
    officeAddress?: StringFieldUpdateOperationsInput | string
    timeZone?: StringFieldUpdateOperationsInput | string
    dateFormat?: StringFieldUpdateOperationsInput | string
    timeFormat?: StringFieldUpdateOperationsInput | string
    notifNewInquiry?: BoolFieldUpdateOperationsInput | boolean
    notifInquiryAccepted?: BoolFieldUpdateOperationsInput | boolean
    notifInquiryRejected?: BoolFieldUpdateOperationsInput | boolean
    notifPayment?: BoolFieldUpdateOperationsInput | boolean
    notifOverduePayment?: BoolFieldUpdateOperationsInput | boolean
    notifAnnouncement?: BoolFieldUpdateOperationsInput | boolean
    notifGraveLocator?: BoolFieldUpdateOperationsInput | boolean
    notifSystem?: BoolFieldUpdateOperationsInput | boolean
    smsEnabled?: BoolFieldUpdateOperationsInput | boolean
    smsProvider?: StringFieldUpdateOperationsInput | string
    smsSenderName?: StringFieldUpdateOperationsInput | string
    emailEnabled?: BoolFieldUpdateOperationsInput | boolean
    emailSenderName?: StringFieldUpdateOperationsInput | string
    emailSenderAddress?: StringFieldUpdateOperationsInput | string
    userAccessEnabled?: BoolFieldUpdateOperationsInput | boolean
    mobileAppEnabled?: BoolFieldUpdateOperationsInput | boolean
    inquiriesEnabled?: BoolFieldUpdateOperationsInput | boolean
    announcementsEnabled?: BoolFieldUpdateOperationsInput | boolean
    graveLocatorEnabled?: BoolFieldUpdateOperationsInput | boolean
    maintenanceMode?: BoolFieldUpdateOperationsInput | boolean
    maintenanceMessage?: StringFieldUpdateOperationsInput | string
    defaultTheme?: StringFieldUpdateOperationsInput | string
    sidebarBehavior?: StringFieldUpdateOperationsInput | string
    layoutDensity?: StringFieldUpdateOperationsInput | string
    itemsPerPage?: IntFieldUpdateOperationsInput | number
    defaultDashboardPage?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    lastBackupAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastBackupFile?: NullableStringFieldUpdateOperationsInput | string | null
    backupStatus?: StringFieldUpdateOperationsInput | string
    autoBackupEnabled?: BoolFieldUpdateOperationsInput | boolean
    backupFrequency?: StringFieldUpdateOperationsInput | string
    sessionTimeout?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SystemSettingUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    systemName?: StringFieldUpdateOperationsInput | string
    systemDescription?: StringFieldUpdateOperationsInput | string
    systemLogo?: NullableStringFieldUpdateOperationsInput | string | null
    contactNumber?: StringFieldUpdateOperationsInput | string
    officialEmail?: StringFieldUpdateOperationsInput | string
    officeAddress?: StringFieldUpdateOperationsInput | string
    timeZone?: StringFieldUpdateOperationsInput | string
    dateFormat?: StringFieldUpdateOperationsInput | string
    timeFormat?: StringFieldUpdateOperationsInput | string
    notifNewInquiry?: BoolFieldUpdateOperationsInput | boolean
    notifInquiryAccepted?: BoolFieldUpdateOperationsInput | boolean
    notifInquiryRejected?: BoolFieldUpdateOperationsInput | boolean
    notifPayment?: BoolFieldUpdateOperationsInput | boolean
    notifOverduePayment?: BoolFieldUpdateOperationsInput | boolean
    notifAnnouncement?: BoolFieldUpdateOperationsInput | boolean
    notifGraveLocator?: BoolFieldUpdateOperationsInput | boolean
    notifSystem?: BoolFieldUpdateOperationsInput | boolean
    smsEnabled?: BoolFieldUpdateOperationsInput | boolean
    smsProvider?: StringFieldUpdateOperationsInput | string
    smsSenderName?: StringFieldUpdateOperationsInput | string
    emailEnabled?: BoolFieldUpdateOperationsInput | boolean
    emailSenderName?: StringFieldUpdateOperationsInput | string
    emailSenderAddress?: StringFieldUpdateOperationsInput | string
    userAccessEnabled?: BoolFieldUpdateOperationsInput | boolean
    mobileAppEnabled?: BoolFieldUpdateOperationsInput | boolean
    inquiriesEnabled?: BoolFieldUpdateOperationsInput | boolean
    announcementsEnabled?: BoolFieldUpdateOperationsInput | boolean
    graveLocatorEnabled?: BoolFieldUpdateOperationsInput | boolean
    maintenanceMode?: BoolFieldUpdateOperationsInput | boolean
    maintenanceMessage?: StringFieldUpdateOperationsInput | string
    defaultTheme?: StringFieldUpdateOperationsInput | string
    sidebarBehavior?: StringFieldUpdateOperationsInput | string
    layoutDensity?: StringFieldUpdateOperationsInput | string
    itemsPerPage?: IntFieldUpdateOperationsInput | number
    defaultDashboardPage?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    lastBackupAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastBackupFile?: NullableStringFieldUpdateOperationsInput | string | null
    backupStatus?: StringFieldUpdateOperationsInput | string
    autoBackupEnabled?: BoolFieldUpdateOperationsInput | boolean
    backupFrequency?: StringFieldUpdateOperationsInput | string
    sessionTimeout?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AdminAuditLogCreateInput = {
    id?: string
    activity: string
    category: string
    admin: string
    status?: string
    details?: string | null
    ipAddress?: string | null
    createdAt?: Date | string
  }

  export type AdminAuditLogUncheckedCreateInput = {
    id?: string
    activity: string
    category: string
    admin: string
    status?: string
    details?: string | null
    ipAddress?: string | null
    createdAt?: Date | string
  }

  export type AdminAuditLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    activity?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    admin?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    details?: NullableStringFieldUpdateOperationsInput | string | null
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AdminAuditLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    activity?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    admin?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    details?: NullableStringFieldUpdateOperationsInput | string | null
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AdminAuditLogCreateManyInput = {
    id?: string
    activity: string
    category: string
    admin: string
    status?: string
    details?: string | null
    ipAddress?: string | null
    createdAt?: Date | string
  }

  export type AdminAuditLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    activity?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    admin?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    details?: NullableStringFieldUpdateOperationsInput | string | null
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AdminAuditLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    activity?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    admin?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    details?: NullableStringFieldUpdateOperationsInput | string | null
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EmailVerificationCreateInput = {
    id?: string
    email: string
    codeHash: string
    attempts?: number
    expiresAt: Date | string
    verifiedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type EmailVerificationUncheckedCreateInput = {
    id?: string
    email: string
    codeHash: string
    attempts?: number
    expiresAt: Date | string
    verifiedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type EmailVerificationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    codeHash?: StringFieldUpdateOperationsInput | string
    attempts?: IntFieldUpdateOperationsInput | number
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EmailVerificationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    codeHash?: StringFieldUpdateOperationsInput | string
    attempts?: IntFieldUpdateOperationsInput | number
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EmailVerificationCreateManyInput = {
    id?: string
    email: string
    codeHash: string
    attempts?: number
    expiresAt: Date | string
    verifiedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type EmailVerificationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    codeHash?: StringFieldUpdateOperationsInput | string
    attempts?: IntFieldUpdateOperationsInput | number
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EmailVerificationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    codeHash?: StringFieldUpdateOperationsInput | string
    attempts?: IntFieldUpdateOperationsInput | number
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PasswordResetCreateInput = {
    id?: string
    email: string
    tokenHash: string
    expiresAt: Date | string
    usedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type PasswordResetUncheckedCreateInput = {
    id?: string
    email: string
    tokenHash: string
    expiresAt: Date | string
    usedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type PasswordResetUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    tokenHash?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PasswordResetUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    tokenHash?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PasswordResetCreateManyInput = {
    id?: string
    email: string
    tokenHash: string
    expiresAt: Date | string
    usedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type PasswordResetUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    tokenHash?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PasswordResetUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    tokenHash?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EmailNotificationLogCreateInput = {
    id?: string
    inquiryAppId?: string | null
    recipient: string
    emailType: string
    subject: string
    status?: string
    sentAt?: Date | string | null
    errorMessage?: string | null
    createdAt?: Date | string
    inquiry?: InquiriesCreateNestedOneWithoutEmailLogsInput
  }

  export type EmailNotificationLogUncheckedCreateInput = {
    id?: string
    inquiryId?: number | null
    inquiryAppId?: string | null
    recipient: string
    emailType: string
    subject: string
    status?: string
    sentAt?: Date | string | null
    errorMessage?: string | null
    createdAt?: Date | string
  }

  export type EmailNotificationLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    inquiryAppId?: NullableStringFieldUpdateOperationsInput | string | null
    recipient?: StringFieldUpdateOperationsInput | string
    emailType?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    sentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    inquiry?: InquiriesUpdateOneWithoutEmailLogsNestedInput
  }

  export type EmailNotificationLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    inquiryId?: NullableIntFieldUpdateOperationsInput | number | null
    inquiryAppId?: NullableStringFieldUpdateOperationsInput | string | null
    recipient?: StringFieldUpdateOperationsInput | string
    emailType?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    sentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EmailNotificationLogCreateManyInput = {
    id?: string
    inquiryId?: number | null
    inquiryAppId?: string | null
    recipient: string
    emailType: string
    subject: string
    status?: string
    sentAt?: Date | string | null
    errorMessage?: string | null
    createdAt?: Date | string
  }

  export type EmailNotificationLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    inquiryAppId?: NullableStringFieldUpdateOperationsInput | string | null
    recipient?: StringFieldUpdateOperationsInput | string
    emailType?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    sentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EmailNotificationLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    inquiryId?: NullableIntFieldUpdateOperationsInput | number | null
    inquiryAppId?: NullableStringFieldUpdateOperationsInput | string | null
    recipient?: StringFieldUpdateOperationsInput | string
    emailType?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    sentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type AdminCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    name?: SortOrder
    username?: SortOrder
    contactNumber?: SortOrder
    role?: SortOrder
    avatar?: SortOrder
    department?: SortOrder
    sessionTimeout?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AdminAvgOrderByAggregateInput = {
    sessionTimeout?: SortOrder
  }

  export type AdminMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    name?: SortOrder
    username?: SortOrder
    contactNumber?: SortOrder
    role?: SortOrder
    avatar?: SortOrder
    department?: SortOrder
    sessionTimeout?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AdminMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    name?: SortOrder
    username?: SortOrder
    contactNumber?: SortOrder
    role?: SortOrder
    avatar?: SortOrder
    department?: SortOrder
    sessionTimeout?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AdminSumOrderByAggregateInput = {
    sessionTimeout?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type PaymentRecordListRelationFilter = {
    every?: PaymentRecordWhereInput
    some?: PaymentRecordWhereInput
    none?: PaymentRecordWhereInput
  }

  export type PaymentRecordOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type DeceasedRecordCountOrderByAggregateInput = {
    id?: SortOrder
    REF_NO?: SortOrder
    PAYORS_NAME?: SortOrder
    CONTACT_NO?: SortOrder
    NAME_OF_DECEASED?: SortOrder
    ADDRESS?: SortOrder
    DATE_OF_BIRTH?: SortOrder
    DATE_OF_DEATH?: SortOrder
    YEAR?: SortOrder
    TOTAL_DUE?: SortOrder
    PAID?: SortOrder
    BALANCE?: SortOrder
    STATUS?: SortOrder
    REMARKS?: SortOrder
    isArchived?: SortOrder
    archivedAt?: SortOrder
    archiveReason?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DeceasedRecordAvgOrderByAggregateInput = {
    YEAR?: SortOrder
    TOTAL_DUE?: SortOrder
    PAID?: SortOrder
    BALANCE?: SortOrder
  }

  export type DeceasedRecordMaxOrderByAggregateInput = {
    id?: SortOrder
    REF_NO?: SortOrder
    PAYORS_NAME?: SortOrder
    CONTACT_NO?: SortOrder
    NAME_OF_DECEASED?: SortOrder
    ADDRESS?: SortOrder
    DATE_OF_BIRTH?: SortOrder
    DATE_OF_DEATH?: SortOrder
    YEAR?: SortOrder
    TOTAL_DUE?: SortOrder
    PAID?: SortOrder
    BALANCE?: SortOrder
    STATUS?: SortOrder
    REMARKS?: SortOrder
    isArchived?: SortOrder
    archivedAt?: SortOrder
    archiveReason?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DeceasedRecordMinOrderByAggregateInput = {
    id?: SortOrder
    REF_NO?: SortOrder
    PAYORS_NAME?: SortOrder
    CONTACT_NO?: SortOrder
    NAME_OF_DECEASED?: SortOrder
    ADDRESS?: SortOrder
    DATE_OF_BIRTH?: SortOrder
    DATE_OF_DEATH?: SortOrder
    YEAR?: SortOrder
    TOTAL_DUE?: SortOrder
    PAID?: SortOrder
    BALANCE?: SortOrder
    STATUS?: SortOrder
    REMARKS?: SortOrder
    isArchived?: SortOrder
    archivedAt?: SortOrder
    archiveReason?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DeceasedRecordSumOrderByAggregateInput = {
    YEAR?: SortOrder
    TOTAL_DUE?: SortOrder
    PAID?: SortOrder
    BALANCE?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type DeceasedRecordNullableRelationFilter = {
    is?: DeceasedRecordWhereInput | null
    isNot?: DeceasedRecordWhereInput | null
  }

  export type PaymentRecordCountOrderByAggregateInput = {
    id?: SortOrder
    REF_NO?: SortOrder
    PAYORS_NAME?: SortOrder
    CONTACT_NO?: SortOrder
    NAME_OF_DECEASED?: SortOrder
    ADDRESS?: SortOrder
    DATE_OF_BIRTH?: SortOrder
    DATE_OF_DEATH?: SortOrder
    YEAR?: SortOrder
    TOTAL_DUE?: SortOrder
    PAID?: SortOrder
    BALANCE?: SortOrder
    STATUS?: SortOrder
    REMARKS?: SortOrder
    OR_NO?: SortOrder
    DATE_PAID?: SortOrder
    METHOD?: SortOrder
    DUE_DATE?: SortOrder
    deceasedRecordId?: SortOrder
    isArchived?: SortOrder
    archivedAt?: SortOrder
    archiveReason?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PaymentRecordAvgOrderByAggregateInput = {
    YEAR?: SortOrder
    TOTAL_DUE?: SortOrder
    PAID?: SortOrder
    BALANCE?: SortOrder
  }

  export type PaymentRecordMaxOrderByAggregateInput = {
    id?: SortOrder
    REF_NO?: SortOrder
    PAYORS_NAME?: SortOrder
    CONTACT_NO?: SortOrder
    NAME_OF_DECEASED?: SortOrder
    ADDRESS?: SortOrder
    DATE_OF_BIRTH?: SortOrder
    DATE_OF_DEATH?: SortOrder
    YEAR?: SortOrder
    TOTAL_DUE?: SortOrder
    PAID?: SortOrder
    BALANCE?: SortOrder
    STATUS?: SortOrder
    REMARKS?: SortOrder
    OR_NO?: SortOrder
    DATE_PAID?: SortOrder
    METHOD?: SortOrder
    DUE_DATE?: SortOrder
    deceasedRecordId?: SortOrder
    isArchived?: SortOrder
    archivedAt?: SortOrder
    archiveReason?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PaymentRecordMinOrderByAggregateInput = {
    id?: SortOrder
    REF_NO?: SortOrder
    PAYORS_NAME?: SortOrder
    CONTACT_NO?: SortOrder
    NAME_OF_DECEASED?: SortOrder
    ADDRESS?: SortOrder
    DATE_OF_BIRTH?: SortOrder
    DATE_OF_DEATH?: SortOrder
    YEAR?: SortOrder
    TOTAL_DUE?: SortOrder
    PAID?: SortOrder
    BALANCE?: SortOrder
    STATUS?: SortOrder
    REMARKS?: SortOrder
    OR_NO?: SortOrder
    DATE_PAID?: SortOrder
    METHOD?: SortOrder
    DUE_DATE?: SortOrder
    deceasedRecordId?: SortOrder
    isArchived?: SortOrder
    archivedAt?: SortOrder
    archiveReason?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PaymentRecordSumOrderByAggregateInput = {
    YEAR?: SortOrder
    TOTAL_DUE?: SortOrder
    PAID?: SortOrder
    BALANCE?: SortOrder
  }

  export type EmailNotificationLogListRelationFilter = {
    every?: EmailNotificationLogWhereInput
    some?: EmailNotificationLogWhereInput
    none?: EmailNotificationLogWhereInput
  }

  export type EmailNotificationLogOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type InquiriesCountOrderByAggregateInput = {
    id?: SortOrder
    APP_ID?: SortOrder
    FAMILY_NAME?: SortOrder
    DECEASED?: SortOrder
    REQUESTED_PLOT?: SortOrder
    BURIAL_DATE?: SortOrder
    TIME?: SortOrder
    CONTACT?: SortOrder
    STATUS?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    emailVerifiedAt?: SortOrder
    relationship?: SortOrder
    address?: SortOrder
    reason?: SortOrder
    notes?: SortOrder
    remarks?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type InquiriesAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type InquiriesMaxOrderByAggregateInput = {
    id?: SortOrder
    APP_ID?: SortOrder
    FAMILY_NAME?: SortOrder
    DECEASED?: SortOrder
    REQUESTED_PLOT?: SortOrder
    BURIAL_DATE?: SortOrder
    TIME?: SortOrder
    CONTACT?: SortOrder
    STATUS?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    emailVerifiedAt?: SortOrder
    relationship?: SortOrder
    address?: SortOrder
    reason?: SortOrder
    notes?: SortOrder
    remarks?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type InquiriesMinOrderByAggregateInput = {
    id?: SortOrder
    APP_ID?: SortOrder
    FAMILY_NAME?: SortOrder
    DECEASED?: SortOrder
    REQUESTED_PLOT?: SortOrder
    BURIAL_DATE?: SortOrder
    TIME?: SortOrder
    CONTACT?: SortOrder
    STATUS?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    emailVerifiedAt?: SortOrder
    relationship?: SortOrder
    address?: SortOrder
    reason?: SortOrder
    notes?: SortOrder
    remarks?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type InquiriesSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type AnnouncementCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    content?: SortOrder
    category?: SortOrder
    badge?: SortOrder
    visibility?: SortOrder
    status?: SortOrder
    date?: SortOrder
    validFrom?: SortOrder
    validUntil?: SortOrder
    views?: SortOrder
  }

  export type AnnouncementAvgOrderByAggregateInput = {
    id?: SortOrder
    views?: SortOrder
  }

  export type AnnouncementMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    content?: SortOrder
    category?: SortOrder
    badge?: SortOrder
    visibility?: SortOrder
    status?: SortOrder
    date?: SortOrder
    validFrom?: SortOrder
    validUntil?: SortOrder
    views?: SortOrder
  }

  export type AnnouncementMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    content?: SortOrder
    category?: SortOrder
    badge?: SortOrder
    visibility?: SortOrder
    status?: SortOrder
    date?: SortOrder
    validFrom?: SortOrder
    validUntil?: SortOrder
    views?: SortOrder
  }

  export type AnnouncementSumOrderByAggregateInput = {
    id?: SortOrder
    views?: SortOrder
  }

  export type SmsNotificationCountOrderByAggregateInput = {
    id?: SortOrder
    recipient?: SortOrder
    recipientName?: SortOrder
    message?: SortOrder
    semaphoreId?: SortOrder
    status?: SortOrder
    type?: SortOrder
    senderName?: SortOrder
    sentBy?: SortOrder
    errorMessage?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SmsNotificationMaxOrderByAggregateInput = {
    id?: SortOrder
    recipient?: SortOrder
    recipientName?: SortOrder
    message?: SortOrder
    semaphoreId?: SortOrder
    status?: SortOrder
    type?: SortOrder
    senderName?: SortOrder
    sentBy?: SortOrder
    errorMessage?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SmsNotificationMinOrderByAggregateInput = {
    id?: SortOrder
    recipient?: SortOrder
    recipientName?: SortOrder
    message?: SortOrder
    semaphoreId?: SortOrder
    status?: SortOrder
    type?: SortOrder
    senderName?: SortOrder
    sentBy?: SortOrder
    errorMessage?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SystemSettingCountOrderByAggregateInput = {
    id?: SortOrder
    systemName?: SortOrder
    systemDescription?: SortOrder
    systemLogo?: SortOrder
    contactNumber?: SortOrder
    officialEmail?: SortOrder
    officeAddress?: SortOrder
    timeZone?: SortOrder
    dateFormat?: SortOrder
    timeFormat?: SortOrder
    notifNewInquiry?: SortOrder
    notifInquiryAccepted?: SortOrder
    notifInquiryRejected?: SortOrder
    notifPayment?: SortOrder
    notifOverduePayment?: SortOrder
    notifAnnouncement?: SortOrder
    notifGraveLocator?: SortOrder
    notifSystem?: SortOrder
    smsEnabled?: SortOrder
    smsProvider?: SortOrder
    smsSenderName?: SortOrder
    emailEnabled?: SortOrder
    emailSenderName?: SortOrder
    emailSenderAddress?: SortOrder
    userAccessEnabled?: SortOrder
    mobileAppEnabled?: SortOrder
    inquiriesEnabled?: SortOrder
    announcementsEnabled?: SortOrder
    graveLocatorEnabled?: SortOrder
    maintenanceMode?: SortOrder
    maintenanceMessage?: SortOrder
    defaultTheme?: SortOrder
    sidebarBehavior?: SortOrder
    layoutDensity?: SortOrder
    itemsPerPage?: SortOrder
    defaultDashboardPage?: SortOrder
    language?: SortOrder
    lastBackupAt?: SortOrder
    lastBackupFile?: SortOrder
    backupStatus?: SortOrder
    autoBackupEnabled?: SortOrder
    backupFrequency?: SortOrder
    sessionTimeout?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type SystemSettingAvgOrderByAggregateInput = {
    itemsPerPage?: SortOrder
    sessionTimeout?: SortOrder
  }

  export type SystemSettingMaxOrderByAggregateInput = {
    id?: SortOrder
    systemName?: SortOrder
    systemDescription?: SortOrder
    systemLogo?: SortOrder
    contactNumber?: SortOrder
    officialEmail?: SortOrder
    officeAddress?: SortOrder
    timeZone?: SortOrder
    dateFormat?: SortOrder
    timeFormat?: SortOrder
    notifNewInquiry?: SortOrder
    notifInquiryAccepted?: SortOrder
    notifInquiryRejected?: SortOrder
    notifPayment?: SortOrder
    notifOverduePayment?: SortOrder
    notifAnnouncement?: SortOrder
    notifGraveLocator?: SortOrder
    notifSystem?: SortOrder
    smsEnabled?: SortOrder
    smsProvider?: SortOrder
    smsSenderName?: SortOrder
    emailEnabled?: SortOrder
    emailSenderName?: SortOrder
    emailSenderAddress?: SortOrder
    userAccessEnabled?: SortOrder
    mobileAppEnabled?: SortOrder
    inquiriesEnabled?: SortOrder
    announcementsEnabled?: SortOrder
    graveLocatorEnabled?: SortOrder
    maintenanceMode?: SortOrder
    maintenanceMessage?: SortOrder
    defaultTheme?: SortOrder
    sidebarBehavior?: SortOrder
    layoutDensity?: SortOrder
    itemsPerPage?: SortOrder
    defaultDashboardPage?: SortOrder
    language?: SortOrder
    lastBackupAt?: SortOrder
    lastBackupFile?: SortOrder
    backupStatus?: SortOrder
    autoBackupEnabled?: SortOrder
    backupFrequency?: SortOrder
    sessionTimeout?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type SystemSettingMinOrderByAggregateInput = {
    id?: SortOrder
    systemName?: SortOrder
    systemDescription?: SortOrder
    systemLogo?: SortOrder
    contactNumber?: SortOrder
    officialEmail?: SortOrder
    officeAddress?: SortOrder
    timeZone?: SortOrder
    dateFormat?: SortOrder
    timeFormat?: SortOrder
    notifNewInquiry?: SortOrder
    notifInquiryAccepted?: SortOrder
    notifInquiryRejected?: SortOrder
    notifPayment?: SortOrder
    notifOverduePayment?: SortOrder
    notifAnnouncement?: SortOrder
    notifGraveLocator?: SortOrder
    notifSystem?: SortOrder
    smsEnabled?: SortOrder
    smsProvider?: SortOrder
    smsSenderName?: SortOrder
    emailEnabled?: SortOrder
    emailSenderName?: SortOrder
    emailSenderAddress?: SortOrder
    userAccessEnabled?: SortOrder
    mobileAppEnabled?: SortOrder
    inquiriesEnabled?: SortOrder
    announcementsEnabled?: SortOrder
    graveLocatorEnabled?: SortOrder
    maintenanceMode?: SortOrder
    maintenanceMessage?: SortOrder
    defaultTheme?: SortOrder
    sidebarBehavior?: SortOrder
    layoutDensity?: SortOrder
    itemsPerPage?: SortOrder
    defaultDashboardPage?: SortOrder
    language?: SortOrder
    lastBackupAt?: SortOrder
    lastBackupFile?: SortOrder
    backupStatus?: SortOrder
    autoBackupEnabled?: SortOrder
    backupFrequency?: SortOrder
    sessionTimeout?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type SystemSettingSumOrderByAggregateInput = {
    itemsPerPage?: SortOrder
    sessionTimeout?: SortOrder
  }

  export type AdminAuditLogCountOrderByAggregateInput = {
    id?: SortOrder
    activity?: SortOrder
    category?: SortOrder
    admin?: SortOrder
    status?: SortOrder
    details?: SortOrder
    ipAddress?: SortOrder
    createdAt?: SortOrder
  }

  export type AdminAuditLogMaxOrderByAggregateInput = {
    id?: SortOrder
    activity?: SortOrder
    category?: SortOrder
    admin?: SortOrder
    status?: SortOrder
    details?: SortOrder
    ipAddress?: SortOrder
    createdAt?: SortOrder
  }

  export type AdminAuditLogMinOrderByAggregateInput = {
    id?: SortOrder
    activity?: SortOrder
    category?: SortOrder
    admin?: SortOrder
    status?: SortOrder
    details?: SortOrder
    ipAddress?: SortOrder
    createdAt?: SortOrder
  }

  export type EmailVerificationCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    codeHash?: SortOrder
    attempts?: SortOrder
    expiresAt?: SortOrder
    verifiedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type EmailVerificationAvgOrderByAggregateInput = {
    attempts?: SortOrder
  }

  export type EmailVerificationMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    codeHash?: SortOrder
    attempts?: SortOrder
    expiresAt?: SortOrder
    verifiedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type EmailVerificationMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    codeHash?: SortOrder
    attempts?: SortOrder
    expiresAt?: SortOrder
    verifiedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type EmailVerificationSumOrderByAggregateInput = {
    attempts?: SortOrder
  }

  export type PasswordResetCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    tokenHash?: SortOrder
    expiresAt?: SortOrder
    usedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type PasswordResetMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    tokenHash?: SortOrder
    expiresAt?: SortOrder
    usedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type PasswordResetMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    tokenHash?: SortOrder
    expiresAt?: SortOrder
    usedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type InquiriesNullableRelationFilter = {
    is?: InquiriesWhereInput | null
    isNot?: InquiriesWhereInput | null
  }

  export type EmailNotificationLogCountOrderByAggregateInput = {
    id?: SortOrder
    inquiryId?: SortOrder
    inquiryAppId?: SortOrder
    recipient?: SortOrder
    emailType?: SortOrder
    subject?: SortOrder
    status?: SortOrder
    sentAt?: SortOrder
    errorMessage?: SortOrder
    createdAt?: SortOrder
  }

  export type EmailNotificationLogAvgOrderByAggregateInput = {
    inquiryId?: SortOrder
  }

  export type EmailNotificationLogMaxOrderByAggregateInput = {
    id?: SortOrder
    inquiryId?: SortOrder
    inquiryAppId?: SortOrder
    recipient?: SortOrder
    emailType?: SortOrder
    subject?: SortOrder
    status?: SortOrder
    sentAt?: SortOrder
    errorMessage?: SortOrder
    createdAt?: SortOrder
  }

  export type EmailNotificationLogMinOrderByAggregateInput = {
    id?: SortOrder
    inquiryId?: SortOrder
    inquiryAppId?: SortOrder
    recipient?: SortOrder
    emailType?: SortOrder
    subject?: SortOrder
    status?: SortOrder
    sentAt?: SortOrder
    errorMessage?: SortOrder
    createdAt?: SortOrder
  }

  export type EmailNotificationLogSumOrderByAggregateInput = {
    inquiryId?: SortOrder
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type PaymentRecordCreateNestedManyWithoutDeceasedRecordInput = {
    create?: XOR<PaymentRecordCreateWithoutDeceasedRecordInput, PaymentRecordUncheckedCreateWithoutDeceasedRecordInput> | PaymentRecordCreateWithoutDeceasedRecordInput[] | PaymentRecordUncheckedCreateWithoutDeceasedRecordInput[]
    connectOrCreate?: PaymentRecordCreateOrConnectWithoutDeceasedRecordInput | PaymentRecordCreateOrConnectWithoutDeceasedRecordInput[]
    createMany?: PaymentRecordCreateManyDeceasedRecordInputEnvelope
    connect?: PaymentRecordWhereUniqueInput | PaymentRecordWhereUniqueInput[]
  }

  export type PaymentRecordUncheckedCreateNestedManyWithoutDeceasedRecordInput = {
    create?: XOR<PaymentRecordCreateWithoutDeceasedRecordInput, PaymentRecordUncheckedCreateWithoutDeceasedRecordInput> | PaymentRecordCreateWithoutDeceasedRecordInput[] | PaymentRecordUncheckedCreateWithoutDeceasedRecordInput[]
    connectOrCreate?: PaymentRecordCreateOrConnectWithoutDeceasedRecordInput | PaymentRecordCreateOrConnectWithoutDeceasedRecordInput[]
    createMany?: PaymentRecordCreateManyDeceasedRecordInputEnvelope
    connect?: PaymentRecordWhereUniqueInput | PaymentRecordWhereUniqueInput[]
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type PaymentRecordUpdateManyWithoutDeceasedRecordNestedInput = {
    create?: XOR<PaymentRecordCreateWithoutDeceasedRecordInput, PaymentRecordUncheckedCreateWithoutDeceasedRecordInput> | PaymentRecordCreateWithoutDeceasedRecordInput[] | PaymentRecordUncheckedCreateWithoutDeceasedRecordInput[]
    connectOrCreate?: PaymentRecordCreateOrConnectWithoutDeceasedRecordInput | PaymentRecordCreateOrConnectWithoutDeceasedRecordInput[]
    upsert?: PaymentRecordUpsertWithWhereUniqueWithoutDeceasedRecordInput | PaymentRecordUpsertWithWhereUniqueWithoutDeceasedRecordInput[]
    createMany?: PaymentRecordCreateManyDeceasedRecordInputEnvelope
    set?: PaymentRecordWhereUniqueInput | PaymentRecordWhereUniqueInput[]
    disconnect?: PaymentRecordWhereUniqueInput | PaymentRecordWhereUniqueInput[]
    delete?: PaymentRecordWhereUniqueInput | PaymentRecordWhereUniqueInput[]
    connect?: PaymentRecordWhereUniqueInput | PaymentRecordWhereUniqueInput[]
    update?: PaymentRecordUpdateWithWhereUniqueWithoutDeceasedRecordInput | PaymentRecordUpdateWithWhereUniqueWithoutDeceasedRecordInput[]
    updateMany?: PaymentRecordUpdateManyWithWhereWithoutDeceasedRecordInput | PaymentRecordUpdateManyWithWhereWithoutDeceasedRecordInput[]
    deleteMany?: PaymentRecordScalarWhereInput | PaymentRecordScalarWhereInput[]
  }

  export type PaymentRecordUncheckedUpdateManyWithoutDeceasedRecordNestedInput = {
    create?: XOR<PaymentRecordCreateWithoutDeceasedRecordInput, PaymentRecordUncheckedCreateWithoutDeceasedRecordInput> | PaymentRecordCreateWithoutDeceasedRecordInput[] | PaymentRecordUncheckedCreateWithoutDeceasedRecordInput[]
    connectOrCreate?: PaymentRecordCreateOrConnectWithoutDeceasedRecordInput | PaymentRecordCreateOrConnectWithoutDeceasedRecordInput[]
    upsert?: PaymentRecordUpsertWithWhereUniqueWithoutDeceasedRecordInput | PaymentRecordUpsertWithWhereUniqueWithoutDeceasedRecordInput[]
    createMany?: PaymentRecordCreateManyDeceasedRecordInputEnvelope
    set?: PaymentRecordWhereUniqueInput | PaymentRecordWhereUniqueInput[]
    disconnect?: PaymentRecordWhereUniqueInput | PaymentRecordWhereUniqueInput[]
    delete?: PaymentRecordWhereUniqueInput | PaymentRecordWhereUniqueInput[]
    connect?: PaymentRecordWhereUniqueInput | PaymentRecordWhereUniqueInput[]
    update?: PaymentRecordUpdateWithWhereUniqueWithoutDeceasedRecordInput | PaymentRecordUpdateWithWhereUniqueWithoutDeceasedRecordInput[]
    updateMany?: PaymentRecordUpdateManyWithWhereWithoutDeceasedRecordInput | PaymentRecordUpdateManyWithWhereWithoutDeceasedRecordInput[]
    deleteMany?: PaymentRecordScalarWhereInput | PaymentRecordScalarWhereInput[]
  }

  export type DeceasedRecordCreateNestedOneWithoutPaymentsInput = {
    create?: XOR<DeceasedRecordCreateWithoutPaymentsInput, DeceasedRecordUncheckedCreateWithoutPaymentsInput>
    connectOrCreate?: DeceasedRecordCreateOrConnectWithoutPaymentsInput
    connect?: DeceasedRecordWhereUniqueInput
  }

  export type DeceasedRecordUpdateOneWithoutPaymentsNestedInput = {
    create?: XOR<DeceasedRecordCreateWithoutPaymentsInput, DeceasedRecordUncheckedCreateWithoutPaymentsInput>
    connectOrCreate?: DeceasedRecordCreateOrConnectWithoutPaymentsInput
    upsert?: DeceasedRecordUpsertWithoutPaymentsInput
    disconnect?: DeceasedRecordWhereInput | boolean
    delete?: DeceasedRecordWhereInput | boolean
    connect?: DeceasedRecordWhereUniqueInput
    update?: XOR<XOR<DeceasedRecordUpdateToOneWithWhereWithoutPaymentsInput, DeceasedRecordUpdateWithoutPaymentsInput>, DeceasedRecordUncheckedUpdateWithoutPaymentsInput>
  }

  export type EmailNotificationLogCreateNestedManyWithoutInquiryInput = {
    create?: XOR<EmailNotificationLogCreateWithoutInquiryInput, EmailNotificationLogUncheckedCreateWithoutInquiryInput> | EmailNotificationLogCreateWithoutInquiryInput[] | EmailNotificationLogUncheckedCreateWithoutInquiryInput[]
    connectOrCreate?: EmailNotificationLogCreateOrConnectWithoutInquiryInput | EmailNotificationLogCreateOrConnectWithoutInquiryInput[]
    createMany?: EmailNotificationLogCreateManyInquiryInputEnvelope
    connect?: EmailNotificationLogWhereUniqueInput | EmailNotificationLogWhereUniqueInput[]
  }

  export type EmailNotificationLogUncheckedCreateNestedManyWithoutInquiryInput = {
    create?: XOR<EmailNotificationLogCreateWithoutInquiryInput, EmailNotificationLogUncheckedCreateWithoutInquiryInput> | EmailNotificationLogCreateWithoutInquiryInput[] | EmailNotificationLogUncheckedCreateWithoutInquiryInput[]
    connectOrCreate?: EmailNotificationLogCreateOrConnectWithoutInquiryInput | EmailNotificationLogCreateOrConnectWithoutInquiryInput[]
    createMany?: EmailNotificationLogCreateManyInquiryInputEnvelope
    connect?: EmailNotificationLogWhereUniqueInput | EmailNotificationLogWhereUniqueInput[]
  }

  export type EmailNotificationLogUpdateManyWithoutInquiryNestedInput = {
    create?: XOR<EmailNotificationLogCreateWithoutInquiryInput, EmailNotificationLogUncheckedCreateWithoutInquiryInput> | EmailNotificationLogCreateWithoutInquiryInput[] | EmailNotificationLogUncheckedCreateWithoutInquiryInput[]
    connectOrCreate?: EmailNotificationLogCreateOrConnectWithoutInquiryInput | EmailNotificationLogCreateOrConnectWithoutInquiryInput[]
    upsert?: EmailNotificationLogUpsertWithWhereUniqueWithoutInquiryInput | EmailNotificationLogUpsertWithWhereUniqueWithoutInquiryInput[]
    createMany?: EmailNotificationLogCreateManyInquiryInputEnvelope
    set?: EmailNotificationLogWhereUniqueInput | EmailNotificationLogWhereUniqueInput[]
    disconnect?: EmailNotificationLogWhereUniqueInput | EmailNotificationLogWhereUniqueInput[]
    delete?: EmailNotificationLogWhereUniqueInput | EmailNotificationLogWhereUniqueInput[]
    connect?: EmailNotificationLogWhereUniqueInput | EmailNotificationLogWhereUniqueInput[]
    update?: EmailNotificationLogUpdateWithWhereUniqueWithoutInquiryInput | EmailNotificationLogUpdateWithWhereUniqueWithoutInquiryInput[]
    updateMany?: EmailNotificationLogUpdateManyWithWhereWithoutInquiryInput | EmailNotificationLogUpdateManyWithWhereWithoutInquiryInput[]
    deleteMany?: EmailNotificationLogScalarWhereInput | EmailNotificationLogScalarWhereInput[]
  }

  export type EmailNotificationLogUncheckedUpdateManyWithoutInquiryNestedInput = {
    create?: XOR<EmailNotificationLogCreateWithoutInquiryInput, EmailNotificationLogUncheckedCreateWithoutInquiryInput> | EmailNotificationLogCreateWithoutInquiryInput[] | EmailNotificationLogUncheckedCreateWithoutInquiryInput[]
    connectOrCreate?: EmailNotificationLogCreateOrConnectWithoutInquiryInput | EmailNotificationLogCreateOrConnectWithoutInquiryInput[]
    upsert?: EmailNotificationLogUpsertWithWhereUniqueWithoutInquiryInput | EmailNotificationLogUpsertWithWhereUniqueWithoutInquiryInput[]
    createMany?: EmailNotificationLogCreateManyInquiryInputEnvelope
    set?: EmailNotificationLogWhereUniqueInput | EmailNotificationLogWhereUniqueInput[]
    disconnect?: EmailNotificationLogWhereUniqueInput | EmailNotificationLogWhereUniqueInput[]
    delete?: EmailNotificationLogWhereUniqueInput | EmailNotificationLogWhereUniqueInput[]
    connect?: EmailNotificationLogWhereUniqueInput | EmailNotificationLogWhereUniqueInput[]
    update?: EmailNotificationLogUpdateWithWhereUniqueWithoutInquiryInput | EmailNotificationLogUpdateWithWhereUniqueWithoutInquiryInput[]
    updateMany?: EmailNotificationLogUpdateManyWithWhereWithoutInquiryInput | EmailNotificationLogUpdateManyWithWhereWithoutInquiryInput[]
    deleteMany?: EmailNotificationLogScalarWhereInput | EmailNotificationLogScalarWhereInput[]
  }

  export type InquiriesCreateNestedOneWithoutEmailLogsInput = {
    create?: XOR<InquiriesCreateWithoutEmailLogsInput, InquiriesUncheckedCreateWithoutEmailLogsInput>
    connectOrCreate?: InquiriesCreateOrConnectWithoutEmailLogsInput
    connect?: InquiriesWhereUniqueInput
  }

  export type InquiriesUpdateOneWithoutEmailLogsNestedInput = {
    create?: XOR<InquiriesCreateWithoutEmailLogsInput, InquiriesUncheckedCreateWithoutEmailLogsInput>
    connectOrCreate?: InquiriesCreateOrConnectWithoutEmailLogsInput
    upsert?: InquiriesUpsertWithoutEmailLogsInput
    disconnect?: InquiriesWhereInput | boolean
    delete?: InquiriesWhereInput | boolean
    connect?: InquiriesWhereUniqueInput
    update?: XOR<XOR<InquiriesUpdateToOneWithWhereWithoutEmailLogsInput, InquiriesUpdateWithoutEmailLogsInput>, InquiriesUncheckedUpdateWithoutEmailLogsInput>
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type PaymentRecordCreateWithoutDeceasedRecordInput = {
    id?: string
    REF_NO: string
    PAYORS_NAME: string
    CONTACT_NO?: string | null
    NAME_OF_DECEASED: string
    ADDRESS?: string | null
    DATE_OF_BIRTH?: Date | string | null
    DATE_OF_DEATH?: Date | string | null
    YEAR: number
    TOTAL_DUE?: number
    PAID?: number
    BALANCE?: number
    STATUS?: string
    REMARKS?: string | null
    OR_NO?: string | null
    DATE_PAID?: string | null
    METHOD?: string | null
    DUE_DATE?: string | null
    isArchived?: boolean
    archivedAt?: Date | string | null
    archiveReason?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PaymentRecordUncheckedCreateWithoutDeceasedRecordInput = {
    id?: string
    REF_NO: string
    PAYORS_NAME: string
    CONTACT_NO?: string | null
    NAME_OF_DECEASED: string
    ADDRESS?: string | null
    DATE_OF_BIRTH?: Date | string | null
    DATE_OF_DEATH?: Date | string | null
    YEAR: number
    TOTAL_DUE?: number
    PAID?: number
    BALANCE?: number
    STATUS?: string
    REMARKS?: string | null
    OR_NO?: string | null
    DATE_PAID?: string | null
    METHOD?: string | null
    DUE_DATE?: string | null
    isArchived?: boolean
    archivedAt?: Date | string | null
    archiveReason?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PaymentRecordCreateOrConnectWithoutDeceasedRecordInput = {
    where: PaymentRecordWhereUniqueInput
    create: XOR<PaymentRecordCreateWithoutDeceasedRecordInput, PaymentRecordUncheckedCreateWithoutDeceasedRecordInput>
  }

  export type PaymentRecordCreateManyDeceasedRecordInputEnvelope = {
    data: PaymentRecordCreateManyDeceasedRecordInput | PaymentRecordCreateManyDeceasedRecordInput[]
    skipDuplicates?: boolean
  }

  export type PaymentRecordUpsertWithWhereUniqueWithoutDeceasedRecordInput = {
    where: PaymentRecordWhereUniqueInput
    update: XOR<PaymentRecordUpdateWithoutDeceasedRecordInput, PaymentRecordUncheckedUpdateWithoutDeceasedRecordInput>
    create: XOR<PaymentRecordCreateWithoutDeceasedRecordInput, PaymentRecordUncheckedCreateWithoutDeceasedRecordInput>
  }

  export type PaymentRecordUpdateWithWhereUniqueWithoutDeceasedRecordInput = {
    where: PaymentRecordWhereUniqueInput
    data: XOR<PaymentRecordUpdateWithoutDeceasedRecordInput, PaymentRecordUncheckedUpdateWithoutDeceasedRecordInput>
  }

  export type PaymentRecordUpdateManyWithWhereWithoutDeceasedRecordInput = {
    where: PaymentRecordScalarWhereInput
    data: XOR<PaymentRecordUpdateManyMutationInput, PaymentRecordUncheckedUpdateManyWithoutDeceasedRecordInput>
  }

  export type PaymentRecordScalarWhereInput = {
    AND?: PaymentRecordScalarWhereInput | PaymentRecordScalarWhereInput[]
    OR?: PaymentRecordScalarWhereInput[]
    NOT?: PaymentRecordScalarWhereInput | PaymentRecordScalarWhereInput[]
    id?: StringFilter<"PaymentRecord"> | string
    REF_NO?: StringFilter<"PaymentRecord"> | string
    PAYORS_NAME?: StringFilter<"PaymentRecord"> | string
    CONTACT_NO?: StringNullableFilter<"PaymentRecord"> | string | null
    NAME_OF_DECEASED?: StringFilter<"PaymentRecord"> | string
    ADDRESS?: StringNullableFilter<"PaymentRecord"> | string | null
    DATE_OF_BIRTH?: DateTimeNullableFilter<"PaymentRecord"> | Date | string | null
    DATE_OF_DEATH?: DateTimeNullableFilter<"PaymentRecord"> | Date | string | null
    YEAR?: IntFilter<"PaymentRecord"> | number
    TOTAL_DUE?: FloatFilter<"PaymentRecord"> | number
    PAID?: FloatFilter<"PaymentRecord"> | number
    BALANCE?: FloatFilter<"PaymentRecord"> | number
    STATUS?: StringFilter<"PaymentRecord"> | string
    REMARKS?: StringNullableFilter<"PaymentRecord"> | string | null
    OR_NO?: StringNullableFilter<"PaymentRecord"> | string | null
    DATE_PAID?: StringNullableFilter<"PaymentRecord"> | string | null
    METHOD?: StringNullableFilter<"PaymentRecord"> | string | null
    DUE_DATE?: StringNullableFilter<"PaymentRecord"> | string | null
    deceasedRecordId?: StringNullableFilter<"PaymentRecord"> | string | null
    isArchived?: BoolFilter<"PaymentRecord"> | boolean
    archivedAt?: DateTimeNullableFilter<"PaymentRecord"> | Date | string | null
    archiveReason?: StringNullableFilter<"PaymentRecord"> | string | null
    createdAt?: DateTimeFilter<"PaymentRecord"> | Date | string
    updatedAt?: DateTimeFilter<"PaymentRecord"> | Date | string
  }

  export type DeceasedRecordCreateWithoutPaymentsInput = {
    id?: string
    REF_NO: string
    PAYORS_NAME: string
    CONTACT_NO: string
    NAME_OF_DECEASED: string
    ADDRESS: string
    DATE_OF_BIRTH: Date | string
    DATE_OF_DEATH: Date | string
    YEAR: number
    TOTAL_DUE: number
    PAID: number
    BALANCE: number
    STATUS: string
    REMARKS?: string | null
    isArchived?: boolean
    archivedAt?: Date | string | null
    archiveReason?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DeceasedRecordUncheckedCreateWithoutPaymentsInput = {
    id?: string
    REF_NO: string
    PAYORS_NAME: string
    CONTACT_NO: string
    NAME_OF_DECEASED: string
    ADDRESS: string
    DATE_OF_BIRTH: Date | string
    DATE_OF_DEATH: Date | string
    YEAR: number
    TOTAL_DUE: number
    PAID: number
    BALANCE: number
    STATUS: string
    REMARKS?: string | null
    isArchived?: boolean
    archivedAt?: Date | string | null
    archiveReason?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DeceasedRecordCreateOrConnectWithoutPaymentsInput = {
    where: DeceasedRecordWhereUniqueInput
    create: XOR<DeceasedRecordCreateWithoutPaymentsInput, DeceasedRecordUncheckedCreateWithoutPaymentsInput>
  }

  export type DeceasedRecordUpsertWithoutPaymentsInput = {
    update: XOR<DeceasedRecordUpdateWithoutPaymentsInput, DeceasedRecordUncheckedUpdateWithoutPaymentsInput>
    create: XOR<DeceasedRecordCreateWithoutPaymentsInput, DeceasedRecordUncheckedCreateWithoutPaymentsInput>
    where?: DeceasedRecordWhereInput
  }

  export type DeceasedRecordUpdateToOneWithWhereWithoutPaymentsInput = {
    where?: DeceasedRecordWhereInput
    data: XOR<DeceasedRecordUpdateWithoutPaymentsInput, DeceasedRecordUncheckedUpdateWithoutPaymentsInput>
  }

  export type DeceasedRecordUpdateWithoutPaymentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    REF_NO?: StringFieldUpdateOperationsInput | string
    PAYORS_NAME?: StringFieldUpdateOperationsInput | string
    CONTACT_NO?: StringFieldUpdateOperationsInput | string
    NAME_OF_DECEASED?: StringFieldUpdateOperationsInput | string
    ADDRESS?: StringFieldUpdateOperationsInput | string
    DATE_OF_BIRTH?: DateTimeFieldUpdateOperationsInput | Date | string
    DATE_OF_DEATH?: DateTimeFieldUpdateOperationsInput | Date | string
    YEAR?: IntFieldUpdateOperationsInput | number
    TOTAL_DUE?: FloatFieldUpdateOperationsInput | number
    PAID?: FloatFieldUpdateOperationsInput | number
    BALANCE?: FloatFieldUpdateOperationsInput | number
    STATUS?: StringFieldUpdateOperationsInput | string
    REMARKS?: NullableStringFieldUpdateOperationsInput | string | null
    isArchived?: BoolFieldUpdateOperationsInput | boolean
    archivedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    archiveReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DeceasedRecordUncheckedUpdateWithoutPaymentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    REF_NO?: StringFieldUpdateOperationsInput | string
    PAYORS_NAME?: StringFieldUpdateOperationsInput | string
    CONTACT_NO?: StringFieldUpdateOperationsInput | string
    NAME_OF_DECEASED?: StringFieldUpdateOperationsInput | string
    ADDRESS?: StringFieldUpdateOperationsInput | string
    DATE_OF_BIRTH?: DateTimeFieldUpdateOperationsInput | Date | string
    DATE_OF_DEATH?: DateTimeFieldUpdateOperationsInput | Date | string
    YEAR?: IntFieldUpdateOperationsInput | number
    TOTAL_DUE?: FloatFieldUpdateOperationsInput | number
    PAID?: FloatFieldUpdateOperationsInput | number
    BALANCE?: FloatFieldUpdateOperationsInput | number
    STATUS?: StringFieldUpdateOperationsInput | string
    REMARKS?: NullableStringFieldUpdateOperationsInput | string | null
    isArchived?: BoolFieldUpdateOperationsInput | boolean
    archivedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    archiveReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EmailNotificationLogCreateWithoutInquiryInput = {
    id?: string
    inquiryAppId?: string | null
    recipient: string
    emailType: string
    subject: string
    status?: string
    sentAt?: Date | string | null
    errorMessage?: string | null
    createdAt?: Date | string
  }

  export type EmailNotificationLogUncheckedCreateWithoutInquiryInput = {
    id?: string
    inquiryAppId?: string | null
    recipient: string
    emailType: string
    subject: string
    status?: string
    sentAt?: Date | string | null
    errorMessage?: string | null
    createdAt?: Date | string
  }

  export type EmailNotificationLogCreateOrConnectWithoutInquiryInput = {
    where: EmailNotificationLogWhereUniqueInput
    create: XOR<EmailNotificationLogCreateWithoutInquiryInput, EmailNotificationLogUncheckedCreateWithoutInquiryInput>
  }

  export type EmailNotificationLogCreateManyInquiryInputEnvelope = {
    data: EmailNotificationLogCreateManyInquiryInput | EmailNotificationLogCreateManyInquiryInput[]
    skipDuplicates?: boolean
  }

  export type EmailNotificationLogUpsertWithWhereUniqueWithoutInquiryInput = {
    where: EmailNotificationLogWhereUniqueInput
    update: XOR<EmailNotificationLogUpdateWithoutInquiryInput, EmailNotificationLogUncheckedUpdateWithoutInquiryInput>
    create: XOR<EmailNotificationLogCreateWithoutInquiryInput, EmailNotificationLogUncheckedCreateWithoutInquiryInput>
  }

  export type EmailNotificationLogUpdateWithWhereUniqueWithoutInquiryInput = {
    where: EmailNotificationLogWhereUniqueInput
    data: XOR<EmailNotificationLogUpdateWithoutInquiryInput, EmailNotificationLogUncheckedUpdateWithoutInquiryInput>
  }

  export type EmailNotificationLogUpdateManyWithWhereWithoutInquiryInput = {
    where: EmailNotificationLogScalarWhereInput
    data: XOR<EmailNotificationLogUpdateManyMutationInput, EmailNotificationLogUncheckedUpdateManyWithoutInquiryInput>
  }

  export type EmailNotificationLogScalarWhereInput = {
    AND?: EmailNotificationLogScalarWhereInput | EmailNotificationLogScalarWhereInput[]
    OR?: EmailNotificationLogScalarWhereInput[]
    NOT?: EmailNotificationLogScalarWhereInput | EmailNotificationLogScalarWhereInput[]
    id?: StringFilter<"EmailNotificationLog"> | string
    inquiryId?: IntNullableFilter<"EmailNotificationLog"> | number | null
    inquiryAppId?: StringNullableFilter<"EmailNotificationLog"> | string | null
    recipient?: StringFilter<"EmailNotificationLog"> | string
    emailType?: StringFilter<"EmailNotificationLog"> | string
    subject?: StringFilter<"EmailNotificationLog"> | string
    status?: StringFilter<"EmailNotificationLog"> | string
    sentAt?: DateTimeNullableFilter<"EmailNotificationLog"> | Date | string | null
    errorMessage?: StringNullableFilter<"EmailNotificationLog"> | string | null
    createdAt?: DateTimeFilter<"EmailNotificationLog"> | Date | string
  }

  export type InquiriesCreateWithoutEmailLogsInput = {
    APP_ID: string
    FAMILY_NAME: string
    DECEASED?: string | null
    REQUESTED_PLOT?: string | null
    BURIAL_DATE?: Date | string | null
    TIME?: string | null
    CONTACT: string
    STATUS?: string
    email: string
    emailVerified?: boolean
    emailVerifiedAt?: Date | string | null
    relationship: string
    address?: string | null
    reason: string
    notes?: string | null
    remarks?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type InquiriesUncheckedCreateWithoutEmailLogsInput = {
    id?: number
    APP_ID: string
    FAMILY_NAME: string
    DECEASED?: string | null
    REQUESTED_PLOT?: string | null
    BURIAL_DATE?: Date | string | null
    TIME?: string | null
    CONTACT: string
    STATUS?: string
    email: string
    emailVerified?: boolean
    emailVerifiedAt?: Date | string | null
    relationship: string
    address?: string | null
    reason: string
    notes?: string | null
    remarks?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type InquiriesCreateOrConnectWithoutEmailLogsInput = {
    where: InquiriesWhereUniqueInput
    create: XOR<InquiriesCreateWithoutEmailLogsInput, InquiriesUncheckedCreateWithoutEmailLogsInput>
  }

  export type InquiriesUpsertWithoutEmailLogsInput = {
    update: XOR<InquiriesUpdateWithoutEmailLogsInput, InquiriesUncheckedUpdateWithoutEmailLogsInput>
    create: XOR<InquiriesCreateWithoutEmailLogsInput, InquiriesUncheckedCreateWithoutEmailLogsInput>
    where?: InquiriesWhereInput
  }

  export type InquiriesUpdateToOneWithWhereWithoutEmailLogsInput = {
    where?: InquiriesWhereInput
    data: XOR<InquiriesUpdateWithoutEmailLogsInput, InquiriesUncheckedUpdateWithoutEmailLogsInput>
  }

  export type InquiriesUpdateWithoutEmailLogsInput = {
    APP_ID?: StringFieldUpdateOperationsInput | string
    FAMILY_NAME?: StringFieldUpdateOperationsInput | string
    DECEASED?: NullableStringFieldUpdateOperationsInput | string | null
    REQUESTED_PLOT?: NullableStringFieldUpdateOperationsInput | string | null
    BURIAL_DATE?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    TIME?: NullableStringFieldUpdateOperationsInput | string | null
    CONTACT?: StringFieldUpdateOperationsInput | string
    STATUS?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    emailVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    relationship?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    reason?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InquiriesUncheckedUpdateWithoutEmailLogsInput = {
    id?: IntFieldUpdateOperationsInput | number
    APP_ID?: StringFieldUpdateOperationsInput | string
    FAMILY_NAME?: StringFieldUpdateOperationsInput | string
    DECEASED?: NullableStringFieldUpdateOperationsInput | string | null
    REQUESTED_PLOT?: NullableStringFieldUpdateOperationsInput | string | null
    BURIAL_DATE?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    TIME?: NullableStringFieldUpdateOperationsInput | string | null
    CONTACT?: StringFieldUpdateOperationsInput | string
    STATUS?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    emailVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    relationship?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    reason?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentRecordCreateManyDeceasedRecordInput = {
    id?: string
    REF_NO: string
    PAYORS_NAME: string
    CONTACT_NO?: string | null
    NAME_OF_DECEASED: string
    ADDRESS?: string | null
    DATE_OF_BIRTH?: Date | string | null
    DATE_OF_DEATH?: Date | string | null
    YEAR: number
    TOTAL_DUE?: number
    PAID?: number
    BALANCE?: number
    STATUS?: string
    REMARKS?: string | null
    OR_NO?: string | null
    DATE_PAID?: string | null
    METHOD?: string | null
    DUE_DATE?: string | null
    isArchived?: boolean
    archivedAt?: Date | string | null
    archiveReason?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PaymentRecordUpdateWithoutDeceasedRecordInput = {
    id?: StringFieldUpdateOperationsInput | string
    REF_NO?: StringFieldUpdateOperationsInput | string
    PAYORS_NAME?: StringFieldUpdateOperationsInput | string
    CONTACT_NO?: NullableStringFieldUpdateOperationsInput | string | null
    NAME_OF_DECEASED?: StringFieldUpdateOperationsInput | string
    ADDRESS?: NullableStringFieldUpdateOperationsInput | string | null
    DATE_OF_BIRTH?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    DATE_OF_DEATH?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    YEAR?: IntFieldUpdateOperationsInput | number
    TOTAL_DUE?: FloatFieldUpdateOperationsInput | number
    PAID?: FloatFieldUpdateOperationsInput | number
    BALANCE?: FloatFieldUpdateOperationsInput | number
    STATUS?: StringFieldUpdateOperationsInput | string
    REMARKS?: NullableStringFieldUpdateOperationsInput | string | null
    OR_NO?: NullableStringFieldUpdateOperationsInput | string | null
    DATE_PAID?: NullableStringFieldUpdateOperationsInput | string | null
    METHOD?: NullableStringFieldUpdateOperationsInput | string | null
    DUE_DATE?: NullableStringFieldUpdateOperationsInput | string | null
    isArchived?: BoolFieldUpdateOperationsInput | boolean
    archivedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    archiveReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentRecordUncheckedUpdateWithoutDeceasedRecordInput = {
    id?: StringFieldUpdateOperationsInput | string
    REF_NO?: StringFieldUpdateOperationsInput | string
    PAYORS_NAME?: StringFieldUpdateOperationsInput | string
    CONTACT_NO?: NullableStringFieldUpdateOperationsInput | string | null
    NAME_OF_DECEASED?: StringFieldUpdateOperationsInput | string
    ADDRESS?: NullableStringFieldUpdateOperationsInput | string | null
    DATE_OF_BIRTH?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    DATE_OF_DEATH?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    YEAR?: IntFieldUpdateOperationsInput | number
    TOTAL_DUE?: FloatFieldUpdateOperationsInput | number
    PAID?: FloatFieldUpdateOperationsInput | number
    BALANCE?: FloatFieldUpdateOperationsInput | number
    STATUS?: StringFieldUpdateOperationsInput | string
    REMARKS?: NullableStringFieldUpdateOperationsInput | string | null
    OR_NO?: NullableStringFieldUpdateOperationsInput | string | null
    DATE_PAID?: NullableStringFieldUpdateOperationsInput | string | null
    METHOD?: NullableStringFieldUpdateOperationsInput | string | null
    DUE_DATE?: NullableStringFieldUpdateOperationsInput | string | null
    isArchived?: BoolFieldUpdateOperationsInput | boolean
    archivedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    archiveReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentRecordUncheckedUpdateManyWithoutDeceasedRecordInput = {
    id?: StringFieldUpdateOperationsInput | string
    REF_NO?: StringFieldUpdateOperationsInput | string
    PAYORS_NAME?: StringFieldUpdateOperationsInput | string
    CONTACT_NO?: NullableStringFieldUpdateOperationsInput | string | null
    NAME_OF_DECEASED?: StringFieldUpdateOperationsInput | string
    ADDRESS?: NullableStringFieldUpdateOperationsInput | string | null
    DATE_OF_BIRTH?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    DATE_OF_DEATH?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    YEAR?: IntFieldUpdateOperationsInput | number
    TOTAL_DUE?: FloatFieldUpdateOperationsInput | number
    PAID?: FloatFieldUpdateOperationsInput | number
    BALANCE?: FloatFieldUpdateOperationsInput | number
    STATUS?: StringFieldUpdateOperationsInput | string
    REMARKS?: NullableStringFieldUpdateOperationsInput | string | null
    OR_NO?: NullableStringFieldUpdateOperationsInput | string | null
    DATE_PAID?: NullableStringFieldUpdateOperationsInput | string | null
    METHOD?: NullableStringFieldUpdateOperationsInput | string | null
    DUE_DATE?: NullableStringFieldUpdateOperationsInput | string | null
    isArchived?: BoolFieldUpdateOperationsInput | boolean
    archivedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    archiveReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EmailNotificationLogCreateManyInquiryInput = {
    id?: string
    inquiryAppId?: string | null
    recipient: string
    emailType: string
    subject: string
    status?: string
    sentAt?: Date | string | null
    errorMessage?: string | null
    createdAt?: Date | string
  }

  export type EmailNotificationLogUpdateWithoutInquiryInput = {
    id?: StringFieldUpdateOperationsInput | string
    inquiryAppId?: NullableStringFieldUpdateOperationsInput | string | null
    recipient?: StringFieldUpdateOperationsInput | string
    emailType?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    sentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EmailNotificationLogUncheckedUpdateWithoutInquiryInput = {
    id?: StringFieldUpdateOperationsInput | string
    inquiryAppId?: NullableStringFieldUpdateOperationsInput | string | null
    recipient?: StringFieldUpdateOperationsInput | string
    emailType?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    sentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EmailNotificationLogUncheckedUpdateManyWithoutInquiryInput = {
    id?: StringFieldUpdateOperationsInput | string
    inquiryAppId?: NullableStringFieldUpdateOperationsInput | string | null
    recipient?: StringFieldUpdateOperationsInput | string
    emailType?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    sentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use DeceasedRecordCountOutputTypeDefaultArgs instead
     */
    export type DeceasedRecordCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = DeceasedRecordCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use InquiriesCountOutputTypeDefaultArgs instead
     */
    export type InquiriesCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = InquiriesCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AdminDefaultArgs instead
     */
    export type AdminArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AdminDefaultArgs<ExtArgs>
    /**
     * @deprecated Use DeceasedRecordDefaultArgs instead
     */
    export type DeceasedRecordArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = DeceasedRecordDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PaymentRecordDefaultArgs instead
     */
    export type PaymentRecordArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PaymentRecordDefaultArgs<ExtArgs>
    /**
     * @deprecated Use InquiriesDefaultArgs instead
     */
    export type InquiriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = InquiriesDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AnnouncementDefaultArgs instead
     */
    export type AnnouncementArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AnnouncementDefaultArgs<ExtArgs>
    /**
     * @deprecated Use SmsNotificationDefaultArgs instead
     */
    export type SmsNotificationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SmsNotificationDefaultArgs<ExtArgs>
    /**
     * @deprecated Use SystemSettingDefaultArgs instead
     */
    export type SystemSettingArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SystemSettingDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AdminAuditLogDefaultArgs instead
     */
    export type AdminAuditLogArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AdminAuditLogDefaultArgs<ExtArgs>
    /**
     * @deprecated Use EmailVerificationDefaultArgs instead
     */
    export type EmailVerificationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = EmailVerificationDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PasswordResetDefaultArgs instead
     */
    export type PasswordResetArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PasswordResetDefaultArgs<ExtArgs>
    /**
     * @deprecated Use EmailNotificationLogDefaultArgs instead
     */
    export type EmailNotificationLogArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = EmailNotificationLogDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}