
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
 * Model appointments
 * 
 */
export type appointments = $Result.DefaultSelection<Prisma.$appointmentsPayload>
/**
 * Model calendars
 * 
 */
export type calendars = $Result.DefaultSelection<Prisma.$calendarsPayload>
/**
 * Model users
 * 
 */
export type users = $Result.DefaultSelection<Prisma.$usersPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Appointments
 * const appointments = await prisma.appointments.findMany()
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
   * // Fetch zero or more Appointments
   * const appointments = await prisma.appointments.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

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


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.appointments`: Exposes CRUD operations for the **appointments** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Appointments
    * const appointments = await prisma.appointments.findMany()
    * ```
    */
  get appointments(): Prisma.appointmentsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.calendars`: Exposes CRUD operations for the **calendars** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Calendars
    * const calendars = await prisma.calendars.findMany()
    * ```
    */
  get calendars(): Prisma.calendarsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.users`: Exposes CRUD operations for the **users** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.users.findMany()
    * ```
    */
  get users(): Prisma.usersDelegate<ExtArgs, ClientOptions>;
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
   * Prisma Client JS version: 6.8.2
   * Query Engine version: 2060c79ba17c6bb9f5823312b6f6b7f4a845738e
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
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
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
    appointments: 'appointments',
    calendars: 'calendars',
    users: 'users'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "appointments" | "calendars" | "users"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      appointments: {
        payload: Prisma.$appointmentsPayload<ExtArgs>
        fields: Prisma.appointmentsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.appointmentsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$appointmentsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.appointmentsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$appointmentsPayload>
          }
          findFirst: {
            args: Prisma.appointmentsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$appointmentsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.appointmentsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$appointmentsPayload>
          }
          findMany: {
            args: Prisma.appointmentsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$appointmentsPayload>[]
          }
          create: {
            args: Prisma.appointmentsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$appointmentsPayload>
          }
          createMany: {
            args: Prisma.appointmentsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.appointmentsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$appointmentsPayload>[]
          }
          delete: {
            args: Prisma.appointmentsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$appointmentsPayload>
          }
          update: {
            args: Prisma.appointmentsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$appointmentsPayload>
          }
          deleteMany: {
            args: Prisma.appointmentsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.appointmentsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.appointmentsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$appointmentsPayload>[]
          }
          upsert: {
            args: Prisma.appointmentsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$appointmentsPayload>
          }
          aggregate: {
            args: Prisma.AppointmentsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAppointments>
          }
          groupBy: {
            args: Prisma.appointmentsGroupByArgs<ExtArgs>
            result: $Utils.Optional<AppointmentsGroupByOutputType>[]
          }
          count: {
            args: Prisma.appointmentsCountArgs<ExtArgs>
            result: $Utils.Optional<AppointmentsCountAggregateOutputType> | number
          }
        }
      }
      calendars: {
        payload: Prisma.$calendarsPayload<ExtArgs>
        fields: Prisma.calendarsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.calendarsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$calendarsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.calendarsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$calendarsPayload>
          }
          findFirst: {
            args: Prisma.calendarsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$calendarsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.calendarsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$calendarsPayload>
          }
          findMany: {
            args: Prisma.calendarsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$calendarsPayload>[]
          }
          create: {
            args: Prisma.calendarsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$calendarsPayload>
          }
          createMany: {
            args: Prisma.calendarsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.calendarsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$calendarsPayload>[]
          }
          delete: {
            args: Prisma.calendarsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$calendarsPayload>
          }
          update: {
            args: Prisma.calendarsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$calendarsPayload>
          }
          deleteMany: {
            args: Prisma.calendarsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.calendarsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.calendarsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$calendarsPayload>[]
          }
          upsert: {
            args: Prisma.calendarsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$calendarsPayload>
          }
          aggregate: {
            args: Prisma.CalendarsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCalendars>
          }
          groupBy: {
            args: Prisma.calendarsGroupByArgs<ExtArgs>
            result: $Utils.Optional<CalendarsGroupByOutputType>[]
          }
          count: {
            args: Prisma.calendarsCountArgs<ExtArgs>
            result: $Utils.Optional<CalendarsCountAggregateOutputType> | number
          }
        }
      }
      users: {
        payload: Prisma.$usersPayload<ExtArgs>
        fields: Prisma.usersFieldRefs
        operations: {
          findUnique: {
            args: Prisma.usersFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.usersFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>
          }
          findFirst: {
            args: Prisma.usersFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.usersFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>
          }
          findMany: {
            args: Prisma.usersFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>[]
          }
          create: {
            args: Prisma.usersCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>
          }
          createMany: {
            args: Prisma.usersCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.usersCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>[]
          }
          delete: {
            args: Prisma.usersDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>
          }
          update: {
            args: Prisma.usersUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>
          }
          deleteMany: {
            args: Prisma.usersDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.usersUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.usersUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>[]
          }
          upsert: {
            args: Prisma.usersUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>
          }
          aggregate: {
            args: Prisma.UsersAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUsers>
          }
          groupBy: {
            args: Prisma.usersGroupByArgs<ExtArgs>
            result: $Utils.Optional<UsersGroupByOutputType>[]
          }
          count: {
            args: Prisma.usersCountArgs<ExtArgs>
            result: $Utils.Optional<UsersCountAggregateOutputType> | number
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
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    appointments?: appointmentsOmit
    calendars?: calendarsOmit
    users?: usersOmit
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
    | 'updateManyAndReturn'
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
   * Count Type UsersCountOutputType
   */

  export type UsersCountOutputType = {
    appointments: number
    calendars: number
  }

  export type UsersCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    appointments?: boolean | UsersCountOutputTypeCountAppointmentsArgs
    calendars?: boolean | UsersCountOutputTypeCountCalendarsArgs
  }

  // Custom InputTypes
  /**
   * UsersCountOutputType without action
   */
  export type UsersCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsersCountOutputType
     */
    select?: UsersCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UsersCountOutputType without action
   */
  export type UsersCountOutputTypeCountAppointmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: appointmentsWhereInput
  }

  /**
   * UsersCountOutputType without action
   */
  export type UsersCountOutputTypeCountCalendarsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: calendarsWhereInput
  }


  /**
   * Models
   */

  /**
   * Model appointments
   */

  export type AggregateAppointments = {
    _count: AppointmentsCountAggregateOutputType | null
    _avg: AppointmentsAvgAggregateOutputType | null
    _sum: AppointmentsSumAggregateOutputType | null
    _min: AppointmentsMinAggregateOutputType | null
    _max: AppointmentsMaxAggregateOutputType | null
  }

  export type AppointmentsAvgAggregateOutputType = {
    id: number | null
    user_id: number | null
  }

  export type AppointmentsSumAggregateOutputType = {
    id: number | null
    user_id: number | null
  }

  export type AppointmentsMinAggregateOutputType = {
    id: number | null
    user_id: number | null
    title: string | null
    description: string | null
    start_time: Date | null
    end_time: Date | null
    location: string | null
    status: string | null
    created_at: Date | null
  }

  export type AppointmentsMaxAggregateOutputType = {
    id: number | null
    user_id: number | null
    title: string | null
    description: string | null
    start_time: Date | null
    end_time: Date | null
    location: string | null
    status: string | null
    created_at: Date | null
  }

  export type AppointmentsCountAggregateOutputType = {
    id: number
    user_id: number
    title: number
    description: number
    start_time: number
    end_time: number
    location: number
    participants: number
    status: number
    created_at: number
    _all: number
  }


  export type AppointmentsAvgAggregateInputType = {
    id?: true
    user_id?: true
  }

  export type AppointmentsSumAggregateInputType = {
    id?: true
    user_id?: true
  }

  export type AppointmentsMinAggregateInputType = {
    id?: true
    user_id?: true
    title?: true
    description?: true
    start_time?: true
    end_time?: true
    location?: true
    status?: true
    created_at?: true
  }

  export type AppointmentsMaxAggregateInputType = {
    id?: true
    user_id?: true
    title?: true
    description?: true
    start_time?: true
    end_time?: true
    location?: true
    status?: true
    created_at?: true
  }

  export type AppointmentsCountAggregateInputType = {
    id?: true
    user_id?: true
    title?: true
    description?: true
    start_time?: true
    end_time?: true
    location?: true
    participants?: true
    status?: true
    created_at?: true
    _all?: true
  }

  export type AppointmentsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which appointments to aggregate.
     */
    where?: appointmentsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of appointments to fetch.
     */
    orderBy?: appointmentsOrderByWithRelationInput | appointmentsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: appointmentsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` appointments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` appointments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned appointments
    **/
    _count?: true | AppointmentsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AppointmentsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AppointmentsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AppointmentsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AppointmentsMaxAggregateInputType
  }

  export type GetAppointmentsAggregateType<T extends AppointmentsAggregateArgs> = {
        [P in keyof T & keyof AggregateAppointments]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAppointments[P]>
      : GetScalarType<T[P], AggregateAppointments[P]>
  }




  export type appointmentsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: appointmentsWhereInput
    orderBy?: appointmentsOrderByWithAggregationInput | appointmentsOrderByWithAggregationInput[]
    by: AppointmentsScalarFieldEnum[] | AppointmentsScalarFieldEnum
    having?: appointmentsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AppointmentsCountAggregateInputType | true
    _avg?: AppointmentsAvgAggregateInputType
    _sum?: AppointmentsSumAggregateInputType
    _min?: AppointmentsMinAggregateInputType
    _max?: AppointmentsMaxAggregateInputType
  }

  export type AppointmentsGroupByOutputType = {
    id: number
    user_id: number | null
    title: string
    description: string | null
    start_time: Date
    end_time: Date
    location: string | null
    participants: JsonValue | null
    status: string | null
    created_at: Date | null
    _count: AppointmentsCountAggregateOutputType | null
    _avg: AppointmentsAvgAggregateOutputType | null
    _sum: AppointmentsSumAggregateOutputType | null
    _min: AppointmentsMinAggregateOutputType | null
    _max: AppointmentsMaxAggregateOutputType | null
  }

  type GetAppointmentsGroupByPayload<T extends appointmentsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AppointmentsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AppointmentsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AppointmentsGroupByOutputType[P]>
            : GetScalarType<T[P], AppointmentsGroupByOutputType[P]>
        }
      >
    >


  export type appointmentsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    title?: boolean
    description?: boolean
    start_time?: boolean
    end_time?: boolean
    location?: boolean
    participants?: boolean
    status?: boolean
    created_at?: boolean
    users?: boolean | appointments$usersArgs<ExtArgs>
  }, ExtArgs["result"]["appointments"]>

  export type appointmentsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    title?: boolean
    description?: boolean
    start_time?: boolean
    end_time?: boolean
    location?: boolean
    participants?: boolean
    status?: boolean
    created_at?: boolean
    users?: boolean | appointments$usersArgs<ExtArgs>
  }, ExtArgs["result"]["appointments"]>

  export type appointmentsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    title?: boolean
    description?: boolean
    start_time?: boolean
    end_time?: boolean
    location?: boolean
    participants?: boolean
    status?: boolean
    created_at?: boolean
    users?: boolean | appointments$usersArgs<ExtArgs>
  }, ExtArgs["result"]["appointments"]>

  export type appointmentsSelectScalar = {
    id?: boolean
    user_id?: boolean
    title?: boolean
    description?: boolean
    start_time?: boolean
    end_time?: boolean
    location?: boolean
    participants?: boolean
    status?: boolean
    created_at?: boolean
  }

  export type appointmentsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "user_id" | "title" | "description" | "start_time" | "end_time" | "location" | "participants" | "status" | "created_at", ExtArgs["result"]["appointments"]>
  export type appointmentsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | appointments$usersArgs<ExtArgs>
  }
  export type appointmentsIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | appointments$usersArgs<ExtArgs>
  }
  export type appointmentsIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | appointments$usersArgs<ExtArgs>
  }

  export type $appointmentsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "appointments"
    objects: {
      users: Prisma.$usersPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      user_id: number | null
      title: string
      description: string | null
      start_time: Date
      end_time: Date
      location: string | null
      participants: Prisma.JsonValue | null
      status: string | null
      created_at: Date | null
    }, ExtArgs["result"]["appointments"]>
    composites: {}
  }

  type appointmentsGetPayload<S extends boolean | null | undefined | appointmentsDefaultArgs> = $Result.GetResult<Prisma.$appointmentsPayload, S>

  type appointmentsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<appointmentsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AppointmentsCountAggregateInputType | true
    }

  export interface appointmentsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['appointments'], meta: { name: 'appointments' } }
    /**
     * Find zero or one Appointments that matches the filter.
     * @param {appointmentsFindUniqueArgs} args - Arguments to find a Appointments
     * @example
     * // Get one Appointments
     * const appointments = await prisma.appointments.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends appointmentsFindUniqueArgs>(args: SelectSubset<T, appointmentsFindUniqueArgs<ExtArgs>>): Prisma__appointmentsClient<$Result.GetResult<Prisma.$appointmentsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Appointments that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {appointmentsFindUniqueOrThrowArgs} args - Arguments to find a Appointments
     * @example
     * // Get one Appointments
     * const appointments = await prisma.appointments.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends appointmentsFindUniqueOrThrowArgs>(args: SelectSubset<T, appointmentsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__appointmentsClient<$Result.GetResult<Prisma.$appointmentsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Appointments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {appointmentsFindFirstArgs} args - Arguments to find a Appointments
     * @example
     * // Get one Appointments
     * const appointments = await prisma.appointments.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends appointmentsFindFirstArgs>(args?: SelectSubset<T, appointmentsFindFirstArgs<ExtArgs>>): Prisma__appointmentsClient<$Result.GetResult<Prisma.$appointmentsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Appointments that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {appointmentsFindFirstOrThrowArgs} args - Arguments to find a Appointments
     * @example
     * // Get one Appointments
     * const appointments = await prisma.appointments.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends appointmentsFindFirstOrThrowArgs>(args?: SelectSubset<T, appointmentsFindFirstOrThrowArgs<ExtArgs>>): Prisma__appointmentsClient<$Result.GetResult<Prisma.$appointmentsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Appointments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {appointmentsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Appointments
     * const appointments = await prisma.appointments.findMany()
     * 
     * // Get first 10 Appointments
     * const appointments = await prisma.appointments.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const appointmentsWithIdOnly = await prisma.appointments.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends appointmentsFindManyArgs>(args?: SelectSubset<T, appointmentsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$appointmentsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Appointments.
     * @param {appointmentsCreateArgs} args - Arguments to create a Appointments.
     * @example
     * // Create one Appointments
     * const Appointments = await prisma.appointments.create({
     *   data: {
     *     // ... data to create a Appointments
     *   }
     * })
     * 
     */
    create<T extends appointmentsCreateArgs>(args: SelectSubset<T, appointmentsCreateArgs<ExtArgs>>): Prisma__appointmentsClient<$Result.GetResult<Prisma.$appointmentsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Appointments.
     * @param {appointmentsCreateManyArgs} args - Arguments to create many Appointments.
     * @example
     * // Create many Appointments
     * const appointments = await prisma.appointments.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends appointmentsCreateManyArgs>(args?: SelectSubset<T, appointmentsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Appointments and returns the data saved in the database.
     * @param {appointmentsCreateManyAndReturnArgs} args - Arguments to create many Appointments.
     * @example
     * // Create many Appointments
     * const appointments = await prisma.appointments.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Appointments and only return the `id`
     * const appointmentsWithIdOnly = await prisma.appointments.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends appointmentsCreateManyAndReturnArgs>(args?: SelectSubset<T, appointmentsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$appointmentsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Appointments.
     * @param {appointmentsDeleteArgs} args - Arguments to delete one Appointments.
     * @example
     * // Delete one Appointments
     * const Appointments = await prisma.appointments.delete({
     *   where: {
     *     // ... filter to delete one Appointments
     *   }
     * })
     * 
     */
    delete<T extends appointmentsDeleteArgs>(args: SelectSubset<T, appointmentsDeleteArgs<ExtArgs>>): Prisma__appointmentsClient<$Result.GetResult<Prisma.$appointmentsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Appointments.
     * @param {appointmentsUpdateArgs} args - Arguments to update one Appointments.
     * @example
     * // Update one Appointments
     * const appointments = await prisma.appointments.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends appointmentsUpdateArgs>(args: SelectSubset<T, appointmentsUpdateArgs<ExtArgs>>): Prisma__appointmentsClient<$Result.GetResult<Prisma.$appointmentsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Appointments.
     * @param {appointmentsDeleteManyArgs} args - Arguments to filter Appointments to delete.
     * @example
     * // Delete a few Appointments
     * const { count } = await prisma.appointments.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends appointmentsDeleteManyArgs>(args?: SelectSubset<T, appointmentsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Appointments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {appointmentsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Appointments
     * const appointments = await prisma.appointments.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends appointmentsUpdateManyArgs>(args: SelectSubset<T, appointmentsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Appointments and returns the data updated in the database.
     * @param {appointmentsUpdateManyAndReturnArgs} args - Arguments to update many Appointments.
     * @example
     * // Update many Appointments
     * const appointments = await prisma.appointments.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Appointments and only return the `id`
     * const appointmentsWithIdOnly = await prisma.appointments.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends appointmentsUpdateManyAndReturnArgs>(args: SelectSubset<T, appointmentsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$appointmentsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Appointments.
     * @param {appointmentsUpsertArgs} args - Arguments to update or create a Appointments.
     * @example
     * // Update or create a Appointments
     * const appointments = await prisma.appointments.upsert({
     *   create: {
     *     // ... data to create a Appointments
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Appointments we want to update
     *   }
     * })
     */
    upsert<T extends appointmentsUpsertArgs>(args: SelectSubset<T, appointmentsUpsertArgs<ExtArgs>>): Prisma__appointmentsClient<$Result.GetResult<Prisma.$appointmentsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Appointments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {appointmentsCountArgs} args - Arguments to filter Appointments to count.
     * @example
     * // Count the number of Appointments
     * const count = await prisma.appointments.count({
     *   where: {
     *     // ... the filter for the Appointments we want to count
     *   }
     * })
    **/
    count<T extends appointmentsCountArgs>(
      args?: Subset<T, appointmentsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AppointmentsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Appointments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppointmentsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends AppointmentsAggregateArgs>(args: Subset<T, AppointmentsAggregateArgs>): Prisma.PrismaPromise<GetAppointmentsAggregateType<T>>

    /**
     * Group by Appointments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {appointmentsGroupByArgs} args - Group by arguments.
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
      T extends appointmentsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: appointmentsGroupByArgs['orderBy'] }
        : { orderBy?: appointmentsGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, appointmentsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAppointmentsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the appointments model
   */
  readonly fields: appointmentsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for appointments.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__appointmentsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    users<T extends appointments$usersArgs<ExtArgs> = {}>(args?: Subset<T, appointments$usersArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the appointments model
   */
  interface appointmentsFieldRefs {
    readonly id: FieldRef<"appointments", 'Int'>
    readonly user_id: FieldRef<"appointments", 'Int'>
    readonly title: FieldRef<"appointments", 'String'>
    readonly description: FieldRef<"appointments", 'String'>
    readonly start_time: FieldRef<"appointments", 'DateTime'>
    readonly end_time: FieldRef<"appointments", 'DateTime'>
    readonly location: FieldRef<"appointments", 'String'>
    readonly participants: FieldRef<"appointments", 'Json'>
    readonly status: FieldRef<"appointments", 'String'>
    readonly created_at: FieldRef<"appointments", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * appointments findUnique
   */
  export type appointmentsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the appointments
     */
    select?: appointmentsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the appointments
     */
    omit?: appointmentsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: appointmentsInclude<ExtArgs> | null
    /**
     * Filter, which appointments to fetch.
     */
    where: appointmentsWhereUniqueInput
  }

  /**
   * appointments findUniqueOrThrow
   */
  export type appointmentsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the appointments
     */
    select?: appointmentsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the appointments
     */
    omit?: appointmentsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: appointmentsInclude<ExtArgs> | null
    /**
     * Filter, which appointments to fetch.
     */
    where: appointmentsWhereUniqueInput
  }

  /**
   * appointments findFirst
   */
  export type appointmentsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the appointments
     */
    select?: appointmentsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the appointments
     */
    omit?: appointmentsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: appointmentsInclude<ExtArgs> | null
    /**
     * Filter, which appointments to fetch.
     */
    where?: appointmentsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of appointments to fetch.
     */
    orderBy?: appointmentsOrderByWithRelationInput | appointmentsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for appointments.
     */
    cursor?: appointmentsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` appointments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` appointments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of appointments.
     */
    distinct?: AppointmentsScalarFieldEnum | AppointmentsScalarFieldEnum[]
  }

  /**
   * appointments findFirstOrThrow
   */
  export type appointmentsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the appointments
     */
    select?: appointmentsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the appointments
     */
    omit?: appointmentsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: appointmentsInclude<ExtArgs> | null
    /**
     * Filter, which appointments to fetch.
     */
    where?: appointmentsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of appointments to fetch.
     */
    orderBy?: appointmentsOrderByWithRelationInput | appointmentsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for appointments.
     */
    cursor?: appointmentsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` appointments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` appointments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of appointments.
     */
    distinct?: AppointmentsScalarFieldEnum | AppointmentsScalarFieldEnum[]
  }

  /**
   * appointments findMany
   */
  export type appointmentsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the appointments
     */
    select?: appointmentsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the appointments
     */
    omit?: appointmentsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: appointmentsInclude<ExtArgs> | null
    /**
     * Filter, which appointments to fetch.
     */
    where?: appointmentsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of appointments to fetch.
     */
    orderBy?: appointmentsOrderByWithRelationInput | appointmentsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing appointments.
     */
    cursor?: appointmentsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` appointments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` appointments.
     */
    skip?: number
    distinct?: AppointmentsScalarFieldEnum | AppointmentsScalarFieldEnum[]
  }

  /**
   * appointments create
   */
  export type appointmentsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the appointments
     */
    select?: appointmentsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the appointments
     */
    omit?: appointmentsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: appointmentsInclude<ExtArgs> | null
    /**
     * The data needed to create a appointments.
     */
    data: XOR<appointmentsCreateInput, appointmentsUncheckedCreateInput>
  }

  /**
   * appointments createMany
   */
  export type appointmentsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many appointments.
     */
    data: appointmentsCreateManyInput | appointmentsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * appointments createManyAndReturn
   */
  export type appointmentsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the appointments
     */
    select?: appointmentsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the appointments
     */
    omit?: appointmentsOmit<ExtArgs> | null
    /**
     * The data used to create many appointments.
     */
    data: appointmentsCreateManyInput | appointmentsCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: appointmentsIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * appointments update
   */
  export type appointmentsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the appointments
     */
    select?: appointmentsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the appointments
     */
    omit?: appointmentsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: appointmentsInclude<ExtArgs> | null
    /**
     * The data needed to update a appointments.
     */
    data: XOR<appointmentsUpdateInput, appointmentsUncheckedUpdateInput>
    /**
     * Choose, which appointments to update.
     */
    where: appointmentsWhereUniqueInput
  }

  /**
   * appointments updateMany
   */
  export type appointmentsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update appointments.
     */
    data: XOR<appointmentsUpdateManyMutationInput, appointmentsUncheckedUpdateManyInput>
    /**
     * Filter which appointments to update
     */
    where?: appointmentsWhereInput
    /**
     * Limit how many appointments to update.
     */
    limit?: number
  }

  /**
   * appointments updateManyAndReturn
   */
  export type appointmentsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the appointments
     */
    select?: appointmentsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the appointments
     */
    omit?: appointmentsOmit<ExtArgs> | null
    /**
     * The data used to update appointments.
     */
    data: XOR<appointmentsUpdateManyMutationInput, appointmentsUncheckedUpdateManyInput>
    /**
     * Filter which appointments to update
     */
    where?: appointmentsWhereInput
    /**
     * Limit how many appointments to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: appointmentsIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * appointments upsert
   */
  export type appointmentsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the appointments
     */
    select?: appointmentsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the appointments
     */
    omit?: appointmentsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: appointmentsInclude<ExtArgs> | null
    /**
     * The filter to search for the appointments to update in case it exists.
     */
    where: appointmentsWhereUniqueInput
    /**
     * In case the appointments found by the `where` argument doesn't exist, create a new appointments with this data.
     */
    create: XOR<appointmentsCreateInput, appointmentsUncheckedCreateInput>
    /**
     * In case the appointments was found with the provided `where` argument, update it with this data.
     */
    update: XOR<appointmentsUpdateInput, appointmentsUncheckedUpdateInput>
  }

  /**
   * appointments delete
   */
  export type appointmentsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the appointments
     */
    select?: appointmentsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the appointments
     */
    omit?: appointmentsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: appointmentsInclude<ExtArgs> | null
    /**
     * Filter which appointments to delete.
     */
    where: appointmentsWhereUniqueInput
  }

  /**
   * appointments deleteMany
   */
  export type appointmentsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which appointments to delete
     */
    where?: appointmentsWhereInput
    /**
     * Limit how many appointments to delete.
     */
    limit?: number
  }

  /**
   * appointments.users
   */
  export type appointments$usersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null
    where?: usersWhereInput
  }

  /**
   * appointments without action
   */
  export type appointmentsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the appointments
     */
    select?: appointmentsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the appointments
     */
    omit?: appointmentsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: appointmentsInclude<ExtArgs> | null
  }


  /**
   * Model calendars
   */

  export type AggregateCalendars = {
    _count: CalendarsCountAggregateOutputType | null
    _avg: CalendarsAvgAggregateOutputType | null
    _sum: CalendarsSumAggregateOutputType | null
    _min: CalendarsMinAggregateOutputType | null
    _max: CalendarsMaxAggregateOutputType | null
  }

  export type CalendarsAvgAggregateOutputType = {
    id: number | null
    user_id: number | null
  }

  export type CalendarsSumAggregateOutputType = {
    id: number | null
    user_id: number | null
  }

  export type CalendarsMinAggregateOutputType = {
    id: number | null
    user_id: number | null
    name: string | null
    description: string | null
    provider: string | null
    access_token: string | null
    refresh_token: string | null
    token_expiry: Date | null
    created_at: Date | null
  }

  export type CalendarsMaxAggregateOutputType = {
    id: number | null
    user_id: number | null
    name: string | null
    description: string | null
    provider: string | null
    access_token: string | null
    refresh_token: string | null
    token_expiry: Date | null
    created_at: Date | null
  }

  export type CalendarsCountAggregateOutputType = {
    id: number
    user_id: number
    name: number
    description: number
    provider: number
    access_token: number
    refresh_token: number
    token_expiry: number
    created_at: number
    _all: number
  }


  export type CalendarsAvgAggregateInputType = {
    id?: true
    user_id?: true
  }

  export type CalendarsSumAggregateInputType = {
    id?: true
    user_id?: true
  }

  export type CalendarsMinAggregateInputType = {
    id?: true
    user_id?: true
    name?: true
    description?: true
    provider?: true
    access_token?: true
    refresh_token?: true
    token_expiry?: true
    created_at?: true
  }

  export type CalendarsMaxAggregateInputType = {
    id?: true
    user_id?: true
    name?: true
    description?: true
    provider?: true
    access_token?: true
    refresh_token?: true
    token_expiry?: true
    created_at?: true
  }

  export type CalendarsCountAggregateInputType = {
    id?: true
    user_id?: true
    name?: true
    description?: true
    provider?: true
    access_token?: true
    refresh_token?: true
    token_expiry?: true
    created_at?: true
    _all?: true
  }

  export type CalendarsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which calendars to aggregate.
     */
    where?: calendarsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of calendars to fetch.
     */
    orderBy?: calendarsOrderByWithRelationInput | calendarsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: calendarsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` calendars from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` calendars.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned calendars
    **/
    _count?: true | CalendarsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CalendarsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CalendarsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CalendarsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CalendarsMaxAggregateInputType
  }

  export type GetCalendarsAggregateType<T extends CalendarsAggregateArgs> = {
        [P in keyof T & keyof AggregateCalendars]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCalendars[P]>
      : GetScalarType<T[P], AggregateCalendars[P]>
  }




  export type calendarsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: calendarsWhereInput
    orderBy?: calendarsOrderByWithAggregationInput | calendarsOrderByWithAggregationInput[]
    by: CalendarsScalarFieldEnum[] | CalendarsScalarFieldEnum
    having?: calendarsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CalendarsCountAggregateInputType | true
    _avg?: CalendarsAvgAggregateInputType
    _sum?: CalendarsSumAggregateInputType
    _min?: CalendarsMinAggregateInputType
    _max?: CalendarsMaxAggregateInputType
  }

  export type CalendarsGroupByOutputType = {
    id: number
    user_id: number | null
    name: string
    description: string | null
    provider: string
    access_token: string | null
    refresh_token: string | null
    token_expiry: Date | null
    created_at: Date | null
    _count: CalendarsCountAggregateOutputType | null
    _avg: CalendarsAvgAggregateOutputType | null
    _sum: CalendarsSumAggregateOutputType | null
    _min: CalendarsMinAggregateOutputType | null
    _max: CalendarsMaxAggregateOutputType | null
  }

  type GetCalendarsGroupByPayload<T extends calendarsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CalendarsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CalendarsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CalendarsGroupByOutputType[P]>
            : GetScalarType<T[P], CalendarsGroupByOutputType[P]>
        }
      >
    >


  export type calendarsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    name?: boolean
    description?: boolean
    provider?: boolean
    access_token?: boolean
    refresh_token?: boolean
    token_expiry?: boolean
    created_at?: boolean
    users?: boolean | calendars$usersArgs<ExtArgs>
  }, ExtArgs["result"]["calendars"]>

  export type calendarsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    name?: boolean
    description?: boolean
    provider?: boolean
    access_token?: boolean
    refresh_token?: boolean
    token_expiry?: boolean
    created_at?: boolean
    users?: boolean | calendars$usersArgs<ExtArgs>
  }, ExtArgs["result"]["calendars"]>

  export type calendarsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    name?: boolean
    description?: boolean
    provider?: boolean
    access_token?: boolean
    refresh_token?: boolean
    token_expiry?: boolean
    created_at?: boolean
    users?: boolean | calendars$usersArgs<ExtArgs>
  }, ExtArgs["result"]["calendars"]>

  export type calendarsSelectScalar = {
    id?: boolean
    user_id?: boolean
    name?: boolean
    description?: boolean
    provider?: boolean
    access_token?: boolean
    refresh_token?: boolean
    token_expiry?: boolean
    created_at?: boolean
  }

  export type calendarsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "user_id" | "name" | "description" | "provider" | "access_token" | "refresh_token" | "token_expiry" | "created_at", ExtArgs["result"]["calendars"]>
  export type calendarsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | calendars$usersArgs<ExtArgs>
  }
  export type calendarsIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | calendars$usersArgs<ExtArgs>
  }
  export type calendarsIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | calendars$usersArgs<ExtArgs>
  }

  export type $calendarsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "calendars"
    objects: {
      users: Prisma.$usersPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      user_id: number | null
      name: string
      description: string | null
      provider: string
      access_token: string | null
      refresh_token: string | null
      token_expiry: Date | null
      created_at: Date | null
    }, ExtArgs["result"]["calendars"]>
    composites: {}
  }

  type calendarsGetPayload<S extends boolean | null | undefined | calendarsDefaultArgs> = $Result.GetResult<Prisma.$calendarsPayload, S>

  type calendarsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<calendarsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CalendarsCountAggregateInputType | true
    }

  export interface calendarsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['calendars'], meta: { name: 'calendars' } }
    /**
     * Find zero or one Calendars that matches the filter.
     * @param {calendarsFindUniqueArgs} args - Arguments to find a Calendars
     * @example
     * // Get one Calendars
     * const calendars = await prisma.calendars.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends calendarsFindUniqueArgs>(args: SelectSubset<T, calendarsFindUniqueArgs<ExtArgs>>): Prisma__calendarsClient<$Result.GetResult<Prisma.$calendarsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Calendars that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {calendarsFindUniqueOrThrowArgs} args - Arguments to find a Calendars
     * @example
     * // Get one Calendars
     * const calendars = await prisma.calendars.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends calendarsFindUniqueOrThrowArgs>(args: SelectSubset<T, calendarsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__calendarsClient<$Result.GetResult<Prisma.$calendarsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Calendars that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {calendarsFindFirstArgs} args - Arguments to find a Calendars
     * @example
     * // Get one Calendars
     * const calendars = await prisma.calendars.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends calendarsFindFirstArgs>(args?: SelectSubset<T, calendarsFindFirstArgs<ExtArgs>>): Prisma__calendarsClient<$Result.GetResult<Prisma.$calendarsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Calendars that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {calendarsFindFirstOrThrowArgs} args - Arguments to find a Calendars
     * @example
     * // Get one Calendars
     * const calendars = await prisma.calendars.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends calendarsFindFirstOrThrowArgs>(args?: SelectSubset<T, calendarsFindFirstOrThrowArgs<ExtArgs>>): Prisma__calendarsClient<$Result.GetResult<Prisma.$calendarsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Calendars that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {calendarsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Calendars
     * const calendars = await prisma.calendars.findMany()
     * 
     * // Get first 10 Calendars
     * const calendars = await prisma.calendars.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const calendarsWithIdOnly = await prisma.calendars.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends calendarsFindManyArgs>(args?: SelectSubset<T, calendarsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$calendarsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Calendars.
     * @param {calendarsCreateArgs} args - Arguments to create a Calendars.
     * @example
     * // Create one Calendars
     * const Calendars = await prisma.calendars.create({
     *   data: {
     *     // ... data to create a Calendars
     *   }
     * })
     * 
     */
    create<T extends calendarsCreateArgs>(args: SelectSubset<T, calendarsCreateArgs<ExtArgs>>): Prisma__calendarsClient<$Result.GetResult<Prisma.$calendarsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Calendars.
     * @param {calendarsCreateManyArgs} args - Arguments to create many Calendars.
     * @example
     * // Create many Calendars
     * const calendars = await prisma.calendars.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends calendarsCreateManyArgs>(args?: SelectSubset<T, calendarsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Calendars and returns the data saved in the database.
     * @param {calendarsCreateManyAndReturnArgs} args - Arguments to create many Calendars.
     * @example
     * // Create many Calendars
     * const calendars = await prisma.calendars.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Calendars and only return the `id`
     * const calendarsWithIdOnly = await prisma.calendars.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends calendarsCreateManyAndReturnArgs>(args?: SelectSubset<T, calendarsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$calendarsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Calendars.
     * @param {calendarsDeleteArgs} args - Arguments to delete one Calendars.
     * @example
     * // Delete one Calendars
     * const Calendars = await prisma.calendars.delete({
     *   where: {
     *     // ... filter to delete one Calendars
     *   }
     * })
     * 
     */
    delete<T extends calendarsDeleteArgs>(args: SelectSubset<T, calendarsDeleteArgs<ExtArgs>>): Prisma__calendarsClient<$Result.GetResult<Prisma.$calendarsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Calendars.
     * @param {calendarsUpdateArgs} args - Arguments to update one Calendars.
     * @example
     * // Update one Calendars
     * const calendars = await prisma.calendars.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends calendarsUpdateArgs>(args: SelectSubset<T, calendarsUpdateArgs<ExtArgs>>): Prisma__calendarsClient<$Result.GetResult<Prisma.$calendarsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Calendars.
     * @param {calendarsDeleteManyArgs} args - Arguments to filter Calendars to delete.
     * @example
     * // Delete a few Calendars
     * const { count } = await prisma.calendars.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends calendarsDeleteManyArgs>(args?: SelectSubset<T, calendarsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Calendars.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {calendarsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Calendars
     * const calendars = await prisma.calendars.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends calendarsUpdateManyArgs>(args: SelectSubset<T, calendarsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Calendars and returns the data updated in the database.
     * @param {calendarsUpdateManyAndReturnArgs} args - Arguments to update many Calendars.
     * @example
     * // Update many Calendars
     * const calendars = await prisma.calendars.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Calendars and only return the `id`
     * const calendarsWithIdOnly = await prisma.calendars.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends calendarsUpdateManyAndReturnArgs>(args: SelectSubset<T, calendarsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$calendarsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Calendars.
     * @param {calendarsUpsertArgs} args - Arguments to update or create a Calendars.
     * @example
     * // Update or create a Calendars
     * const calendars = await prisma.calendars.upsert({
     *   create: {
     *     // ... data to create a Calendars
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Calendars we want to update
     *   }
     * })
     */
    upsert<T extends calendarsUpsertArgs>(args: SelectSubset<T, calendarsUpsertArgs<ExtArgs>>): Prisma__calendarsClient<$Result.GetResult<Prisma.$calendarsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Calendars.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {calendarsCountArgs} args - Arguments to filter Calendars to count.
     * @example
     * // Count the number of Calendars
     * const count = await prisma.calendars.count({
     *   where: {
     *     // ... the filter for the Calendars we want to count
     *   }
     * })
    **/
    count<T extends calendarsCountArgs>(
      args?: Subset<T, calendarsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CalendarsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Calendars.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CalendarsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends CalendarsAggregateArgs>(args: Subset<T, CalendarsAggregateArgs>): Prisma.PrismaPromise<GetCalendarsAggregateType<T>>

    /**
     * Group by Calendars.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {calendarsGroupByArgs} args - Group by arguments.
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
      T extends calendarsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: calendarsGroupByArgs['orderBy'] }
        : { orderBy?: calendarsGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, calendarsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCalendarsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the calendars model
   */
  readonly fields: calendarsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for calendars.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__calendarsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    users<T extends calendars$usersArgs<ExtArgs> = {}>(args?: Subset<T, calendars$usersArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the calendars model
   */
  interface calendarsFieldRefs {
    readonly id: FieldRef<"calendars", 'Int'>
    readonly user_id: FieldRef<"calendars", 'Int'>
    readonly name: FieldRef<"calendars", 'String'>
    readonly description: FieldRef<"calendars", 'String'>
    readonly provider: FieldRef<"calendars", 'String'>
    readonly access_token: FieldRef<"calendars", 'String'>
    readonly refresh_token: FieldRef<"calendars", 'String'>
    readonly token_expiry: FieldRef<"calendars", 'DateTime'>
    readonly created_at: FieldRef<"calendars", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * calendars findUnique
   */
  export type calendarsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the calendars
     */
    select?: calendarsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the calendars
     */
    omit?: calendarsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: calendarsInclude<ExtArgs> | null
    /**
     * Filter, which calendars to fetch.
     */
    where: calendarsWhereUniqueInput
  }

  /**
   * calendars findUniqueOrThrow
   */
  export type calendarsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the calendars
     */
    select?: calendarsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the calendars
     */
    omit?: calendarsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: calendarsInclude<ExtArgs> | null
    /**
     * Filter, which calendars to fetch.
     */
    where: calendarsWhereUniqueInput
  }

  /**
   * calendars findFirst
   */
  export type calendarsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the calendars
     */
    select?: calendarsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the calendars
     */
    omit?: calendarsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: calendarsInclude<ExtArgs> | null
    /**
     * Filter, which calendars to fetch.
     */
    where?: calendarsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of calendars to fetch.
     */
    orderBy?: calendarsOrderByWithRelationInput | calendarsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for calendars.
     */
    cursor?: calendarsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` calendars from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` calendars.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of calendars.
     */
    distinct?: CalendarsScalarFieldEnum | CalendarsScalarFieldEnum[]
  }

  /**
   * calendars findFirstOrThrow
   */
  export type calendarsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the calendars
     */
    select?: calendarsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the calendars
     */
    omit?: calendarsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: calendarsInclude<ExtArgs> | null
    /**
     * Filter, which calendars to fetch.
     */
    where?: calendarsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of calendars to fetch.
     */
    orderBy?: calendarsOrderByWithRelationInput | calendarsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for calendars.
     */
    cursor?: calendarsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` calendars from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` calendars.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of calendars.
     */
    distinct?: CalendarsScalarFieldEnum | CalendarsScalarFieldEnum[]
  }

  /**
   * calendars findMany
   */
  export type calendarsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the calendars
     */
    select?: calendarsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the calendars
     */
    omit?: calendarsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: calendarsInclude<ExtArgs> | null
    /**
     * Filter, which calendars to fetch.
     */
    where?: calendarsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of calendars to fetch.
     */
    orderBy?: calendarsOrderByWithRelationInput | calendarsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing calendars.
     */
    cursor?: calendarsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` calendars from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` calendars.
     */
    skip?: number
    distinct?: CalendarsScalarFieldEnum | CalendarsScalarFieldEnum[]
  }

  /**
   * calendars create
   */
  export type calendarsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the calendars
     */
    select?: calendarsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the calendars
     */
    omit?: calendarsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: calendarsInclude<ExtArgs> | null
    /**
     * The data needed to create a calendars.
     */
    data: XOR<calendarsCreateInput, calendarsUncheckedCreateInput>
  }

  /**
   * calendars createMany
   */
  export type calendarsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many calendars.
     */
    data: calendarsCreateManyInput | calendarsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * calendars createManyAndReturn
   */
  export type calendarsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the calendars
     */
    select?: calendarsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the calendars
     */
    omit?: calendarsOmit<ExtArgs> | null
    /**
     * The data used to create many calendars.
     */
    data: calendarsCreateManyInput | calendarsCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: calendarsIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * calendars update
   */
  export type calendarsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the calendars
     */
    select?: calendarsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the calendars
     */
    omit?: calendarsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: calendarsInclude<ExtArgs> | null
    /**
     * The data needed to update a calendars.
     */
    data: XOR<calendarsUpdateInput, calendarsUncheckedUpdateInput>
    /**
     * Choose, which calendars to update.
     */
    where: calendarsWhereUniqueInput
  }

  /**
   * calendars updateMany
   */
  export type calendarsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update calendars.
     */
    data: XOR<calendarsUpdateManyMutationInput, calendarsUncheckedUpdateManyInput>
    /**
     * Filter which calendars to update
     */
    where?: calendarsWhereInput
    /**
     * Limit how many calendars to update.
     */
    limit?: number
  }

  /**
   * calendars updateManyAndReturn
   */
  export type calendarsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the calendars
     */
    select?: calendarsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the calendars
     */
    omit?: calendarsOmit<ExtArgs> | null
    /**
     * The data used to update calendars.
     */
    data: XOR<calendarsUpdateManyMutationInput, calendarsUncheckedUpdateManyInput>
    /**
     * Filter which calendars to update
     */
    where?: calendarsWhereInput
    /**
     * Limit how many calendars to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: calendarsIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * calendars upsert
   */
  export type calendarsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the calendars
     */
    select?: calendarsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the calendars
     */
    omit?: calendarsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: calendarsInclude<ExtArgs> | null
    /**
     * The filter to search for the calendars to update in case it exists.
     */
    where: calendarsWhereUniqueInput
    /**
     * In case the calendars found by the `where` argument doesn't exist, create a new calendars with this data.
     */
    create: XOR<calendarsCreateInput, calendarsUncheckedCreateInput>
    /**
     * In case the calendars was found with the provided `where` argument, update it with this data.
     */
    update: XOR<calendarsUpdateInput, calendarsUncheckedUpdateInput>
  }

  /**
   * calendars delete
   */
  export type calendarsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the calendars
     */
    select?: calendarsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the calendars
     */
    omit?: calendarsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: calendarsInclude<ExtArgs> | null
    /**
     * Filter which calendars to delete.
     */
    where: calendarsWhereUniqueInput
  }

  /**
   * calendars deleteMany
   */
  export type calendarsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which calendars to delete
     */
    where?: calendarsWhereInput
    /**
     * Limit how many calendars to delete.
     */
    limit?: number
  }

  /**
   * calendars.users
   */
  export type calendars$usersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null
    where?: usersWhereInput
  }

  /**
   * calendars without action
   */
  export type calendarsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the calendars
     */
    select?: calendarsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the calendars
     */
    omit?: calendarsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: calendarsInclude<ExtArgs> | null
  }


  /**
   * Model users
   */

  export type AggregateUsers = {
    _count: UsersCountAggregateOutputType | null
    _avg: UsersAvgAggregateOutputType | null
    _sum: UsersSumAggregateOutputType | null
    _min: UsersMinAggregateOutputType | null
    _max: UsersMaxAggregateOutputType | null
  }

  export type UsersAvgAggregateOutputType = {
    id: number | null
  }

  export type UsersSumAggregateOutputType = {
    id: number | null
  }

  export type UsersMinAggregateOutputType = {
    id: number | null
    name: string | null
    email: string | null
    password: string | null
    timezone: string | null
    created_at: Date | null
  }

  export type UsersMaxAggregateOutputType = {
    id: number | null
    name: string | null
    email: string | null
    password: string | null
    timezone: string | null
    created_at: Date | null
  }

  export type UsersCountAggregateOutputType = {
    id: number
    name: number
    email: number
    password: number
    timezone: number
    created_at: number
    _all: number
  }


  export type UsersAvgAggregateInputType = {
    id?: true
  }

  export type UsersSumAggregateInputType = {
    id?: true
  }

  export type UsersMinAggregateInputType = {
    id?: true
    name?: true
    email?: true
    password?: true
    timezone?: true
    created_at?: true
  }

  export type UsersMaxAggregateInputType = {
    id?: true
    name?: true
    email?: true
    password?: true
    timezone?: true
    created_at?: true
  }

  export type UsersCountAggregateInputType = {
    id?: true
    name?: true
    email?: true
    password?: true
    timezone?: true
    created_at?: true
    _all?: true
  }

  export type UsersAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which users to aggregate.
     */
    where?: usersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of users to fetch.
     */
    orderBy?: usersOrderByWithRelationInput | usersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: usersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned users
    **/
    _count?: true | UsersCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UsersAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UsersSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UsersMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UsersMaxAggregateInputType
  }

  export type GetUsersAggregateType<T extends UsersAggregateArgs> = {
        [P in keyof T & keyof AggregateUsers]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUsers[P]>
      : GetScalarType<T[P], AggregateUsers[P]>
  }




  export type usersGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: usersWhereInput
    orderBy?: usersOrderByWithAggregationInput | usersOrderByWithAggregationInput[]
    by: UsersScalarFieldEnum[] | UsersScalarFieldEnum
    having?: usersScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UsersCountAggregateInputType | true
    _avg?: UsersAvgAggregateInputType
    _sum?: UsersSumAggregateInputType
    _min?: UsersMinAggregateInputType
    _max?: UsersMaxAggregateInputType
  }

  export type UsersGroupByOutputType = {
    id: number
    name: string
    email: string
    password: string
    timezone: string | null
    created_at: Date | null
    _count: UsersCountAggregateOutputType | null
    _avg: UsersAvgAggregateOutputType | null
    _sum: UsersSumAggregateOutputType | null
    _min: UsersMinAggregateOutputType | null
    _max: UsersMaxAggregateOutputType | null
  }

  type GetUsersGroupByPayload<T extends usersGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UsersGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UsersGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UsersGroupByOutputType[P]>
            : GetScalarType<T[P], UsersGroupByOutputType[P]>
        }
      >
    >


  export type usersSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    timezone?: boolean
    created_at?: boolean
    appointments?: boolean | users$appointmentsArgs<ExtArgs>
    calendars?: boolean | users$calendarsArgs<ExtArgs>
    _count?: boolean | UsersCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["users"]>

  export type usersSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    timezone?: boolean
    created_at?: boolean
  }, ExtArgs["result"]["users"]>

  export type usersSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    timezone?: boolean
    created_at?: boolean
  }, ExtArgs["result"]["users"]>

  export type usersSelectScalar = {
    id?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    timezone?: boolean
    created_at?: boolean
  }

  export type usersOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "email" | "password" | "timezone" | "created_at", ExtArgs["result"]["users"]>
  export type usersInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    appointments?: boolean | users$appointmentsArgs<ExtArgs>
    calendars?: boolean | users$calendarsArgs<ExtArgs>
    _count?: boolean | UsersCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type usersIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type usersIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $usersPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "users"
    objects: {
      appointments: Prisma.$appointmentsPayload<ExtArgs>[]
      calendars: Prisma.$calendarsPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string
      email: string
      password: string
      timezone: string | null
      created_at: Date | null
    }, ExtArgs["result"]["users"]>
    composites: {}
  }

  type usersGetPayload<S extends boolean | null | undefined | usersDefaultArgs> = $Result.GetResult<Prisma.$usersPayload, S>

  type usersCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<usersFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UsersCountAggregateInputType | true
    }

  export interface usersDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['users'], meta: { name: 'users' } }
    /**
     * Find zero or one Users that matches the filter.
     * @param {usersFindUniqueArgs} args - Arguments to find a Users
     * @example
     * // Get one Users
     * const users = await prisma.users.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends usersFindUniqueArgs>(args: SelectSubset<T, usersFindUniqueArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Users that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {usersFindUniqueOrThrowArgs} args - Arguments to find a Users
     * @example
     * // Get one Users
     * const users = await prisma.users.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends usersFindUniqueOrThrowArgs>(args: SelectSubset<T, usersFindUniqueOrThrowArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usersFindFirstArgs} args - Arguments to find a Users
     * @example
     * // Get one Users
     * const users = await prisma.users.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends usersFindFirstArgs>(args?: SelectSubset<T, usersFindFirstArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Users that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usersFindFirstOrThrowArgs} args - Arguments to find a Users
     * @example
     * // Get one Users
     * const users = await prisma.users.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends usersFindFirstOrThrowArgs>(args?: SelectSubset<T, usersFindFirstOrThrowArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usersFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.users.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.users.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const usersWithIdOnly = await prisma.users.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends usersFindManyArgs>(args?: SelectSubset<T, usersFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Users.
     * @param {usersCreateArgs} args - Arguments to create a Users.
     * @example
     * // Create one Users
     * const Users = await prisma.users.create({
     *   data: {
     *     // ... data to create a Users
     *   }
     * })
     * 
     */
    create<T extends usersCreateArgs>(args: SelectSubset<T, usersCreateArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {usersCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const users = await prisma.users.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends usersCreateManyArgs>(args?: SelectSubset<T, usersCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {usersCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const users = await prisma.users.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const usersWithIdOnly = await prisma.users.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends usersCreateManyAndReturnArgs>(args?: SelectSubset<T, usersCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Users.
     * @param {usersDeleteArgs} args - Arguments to delete one Users.
     * @example
     * // Delete one Users
     * const Users = await prisma.users.delete({
     *   where: {
     *     // ... filter to delete one Users
     *   }
     * })
     * 
     */
    delete<T extends usersDeleteArgs>(args: SelectSubset<T, usersDeleteArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Users.
     * @param {usersUpdateArgs} args - Arguments to update one Users.
     * @example
     * // Update one Users
     * const users = await prisma.users.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends usersUpdateArgs>(args: SelectSubset<T, usersUpdateArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {usersDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.users.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends usersDeleteManyArgs>(args?: SelectSubset<T, usersDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usersUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const users = await prisma.users.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends usersUpdateManyArgs>(args: SelectSubset<T, usersUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {usersUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const users = await prisma.users.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const usersWithIdOnly = await prisma.users.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends usersUpdateManyAndReturnArgs>(args: SelectSubset<T, usersUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Users.
     * @param {usersUpsertArgs} args - Arguments to update or create a Users.
     * @example
     * // Update or create a Users
     * const users = await prisma.users.upsert({
     *   create: {
     *     // ... data to create a Users
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Users we want to update
     *   }
     * })
     */
    upsert<T extends usersUpsertArgs>(args: SelectSubset<T, usersUpsertArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usersCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.users.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends usersCountArgs>(
      args?: Subset<T, usersCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UsersCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsersAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends UsersAggregateArgs>(args: Subset<T, UsersAggregateArgs>): Prisma.PrismaPromise<GetUsersAggregateType<T>>

    /**
     * Group by Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usersGroupByArgs} args - Group by arguments.
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
      T extends usersGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: usersGroupByArgs['orderBy'] }
        : { orderBy?: usersGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, usersGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUsersGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the users model
   */
  readonly fields: usersFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for users.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__usersClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    appointments<T extends users$appointmentsArgs<ExtArgs> = {}>(args?: Subset<T, users$appointmentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$appointmentsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    calendars<T extends users$calendarsArgs<ExtArgs> = {}>(args?: Subset<T, users$calendarsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$calendarsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the users model
   */
  interface usersFieldRefs {
    readonly id: FieldRef<"users", 'Int'>
    readonly name: FieldRef<"users", 'String'>
    readonly email: FieldRef<"users", 'String'>
    readonly password: FieldRef<"users", 'String'>
    readonly timezone: FieldRef<"users", 'String'>
    readonly created_at: FieldRef<"users", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * users findUnique
   */
  export type usersFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null
    /**
     * Filter, which users to fetch.
     */
    where: usersWhereUniqueInput
  }

  /**
   * users findUniqueOrThrow
   */
  export type usersFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null
    /**
     * Filter, which users to fetch.
     */
    where: usersWhereUniqueInput
  }

  /**
   * users findFirst
   */
  export type usersFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null
    /**
     * Filter, which users to fetch.
     */
    where?: usersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of users to fetch.
     */
    orderBy?: usersOrderByWithRelationInput | usersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for users.
     */
    cursor?: usersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of users.
     */
    distinct?: UsersScalarFieldEnum | UsersScalarFieldEnum[]
  }

  /**
   * users findFirstOrThrow
   */
  export type usersFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null
    /**
     * Filter, which users to fetch.
     */
    where?: usersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of users to fetch.
     */
    orderBy?: usersOrderByWithRelationInput | usersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for users.
     */
    cursor?: usersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of users.
     */
    distinct?: UsersScalarFieldEnum | UsersScalarFieldEnum[]
  }

  /**
   * users findMany
   */
  export type usersFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null
    /**
     * Filter, which users to fetch.
     */
    where?: usersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of users to fetch.
     */
    orderBy?: usersOrderByWithRelationInput | usersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing users.
     */
    cursor?: usersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` users.
     */
    skip?: number
    distinct?: UsersScalarFieldEnum | UsersScalarFieldEnum[]
  }

  /**
   * users create
   */
  export type usersCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null
    /**
     * The data needed to create a users.
     */
    data: XOR<usersCreateInput, usersUncheckedCreateInput>
  }

  /**
   * users createMany
   */
  export type usersCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many users.
     */
    data: usersCreateManyInput | usersCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * users createManyAndReturn
   */
  export type usersCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * The data used to create many users.
     */
    data: usersCreateManyInput | usersCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * users update
   */
  export type usersUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null
    /**
     * The data needed to update a users.
     */
    data: XOR<usersUpdateInput, usersUncheckedUpdateInput>
    /**
     * Choose, which users to update.
     */
    where: usersWhereUniqueInput
  }

  /**
   * users updateMany
   */
  export type usersUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update users.
     */
    data: XOR<usersUpdateManyMutationInput, usersUncheckedUpdateManyInput>
    /**
     * Filter which users to update
     */
    where?: usersWhereInput
    /**
     * Limit how many users to update.
     */
    limit?: number
  }

  /**
   * users updateManyAndReturn
   */
  export type usersUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * The data used to update users.
     */
    data: XOR<usersUpdateManyMutationInput, usersUncheckedUpdateManyInput>
    /**
     * Filter which users to update
     */
    where?: usersWhereInput
    /**
     * Limit how many users to update.
     */
    limit?: number
  }

  /**
   * users upsert
   */
  export type usersUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null
    /**
     * The filter to search for the users to update in case it exists.
     */
    where: usersWhereUniqueInput
    /**
     * In case the users found by the `where` argument doesn't exist, create a new users with this data.
     */
    create: XOR<usersCreateInput, usersUncheckedCreateInput>
    /**
     * In case the users was found with the provided `where` argument, update it with this data.
     */
    update: XOR<usersUpdateInput, usersUncheckedUpdateInput>
  }

  /**
   * users delete
   */
  export type usersDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null
    /**
     * Filter which users to delete.
     */
    where: usersWhereUniqueInput
  }

  /**
   * users deleteMany
   */
  export type usersDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which users to delete
     */
    where?: usersWhereInput
    /**
     * Limit how many users to delete.
     */
    limit?: number
  }

  /**
   * users.appointments
   */
  export type users$appointmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the appointments
     */
    select?: appointmentsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the appointments
     */
    omit?: appointmentsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: appointmentsInclude<ExtArgs> | null
    where?: appointmentsWhereInput
    orderBy?: appointmentsOrderByWithRelationInput | appointmentsOrderByWithRelationInput[]
    cursor?: appointmentsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AppointmentsScalarFieldEnum | AppointmentsScalarFieldEnum[]
  }

  /**
   * users.calendars
   */
  export type users$calendarsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the calendars
     */
    select?: calendarsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the calendars
     */
    omit?: calendarsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: calendarsInclude<ExtArgs> | null
    where?: calendarsWhereInput
    orderBy?: calendarsOrderByWithRelationInput | calendarsOrderByWithRelationInput[]
    cursor?: calendarsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CalendarsScalarFieldEnum | CalendarsScalarFieldEnum[]
  }

  /**
   * users without action
   */
  export type usersDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null
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


  export const AppointmentsScalarFieldEnum: {
    id: 'id',
    user_id: 'user_id',
    title: 'title',
    description: 'description',
    start_time: 'start_time',
    end_time: 'end_time',
    location: 'location',
    participants: 'participants',
    status: 'status',
    created_at: 'created_at'
  };

  export type AppointmentsScalarFieldEnum = (typeof AppointmentsScalarFieldEnum)[keyof typeof AppointmentsScalarFieldEnum]


  export const CalendarsScalarFieldEnum: {
    id: 'id',
    user_id: 'user_id',
    name: 'name',
    description: 'description',
    provider: 'provider',
    access_token: 'access_token',
    refresh_token: 'refresh_token',
    token_expiry: 'token_expiry',
    created_at: 'created_at'
  };

  export type CalendarsScalarFieldEnum = (typeof CalendarsScalarFieldEnum)[keyof typeof CalendarsScalarFieldEnum]


  export const UsersScalarFieldEnum: {
    id: 'id',
    name: 'name',
    email: 'email',
    password: 'password',
    timezone: 'timezone',
    created_at: 'created_at'
  };

  export type UsersScalarFieldEnum = (typeof UsersScalarFieldEnum)[keyof typeof UsersScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type appointmentsWhereInput = {
    AND?: appointmentsWhereInput | appointmentsWhereInput[]
    OR?: appointmentsWhereInput[]
    NOT?: appointmentsWhereInput | appointmentsWhereInput[]
    id?: IntFilter<"appointments"> | number
    user_id?: IntNullableFilter<"appointments"> | number | null
    title?: StringFilter<"appointments"> | string
    description?: StringNullableFilter<"appointments"> | string | null
    start_time?: DateTimeFilter<"appointments"> | Date | string
    end_time?: DateTimeFilter<"appointments"> | Date | string
    location?: StringNullableFilter<"appointments"> | string | null
    participants?: JsonNullableFilter<"appointments">
    status?: StringNullableFilter<"appointments"> | string | null
    created_at?: DateTimeNullableFilter<"appointments"> | Date | string | null
    users?: XOR<UsersNullableScalarRelationFilter, usersWhereInput> | null
  }

  export type appointmentsOrderByWithRelationInput = {
    id?: SortOrder
    user_id?: SortOrderInput | SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    start_time?: SortOrder
    end_time?: SortOrder
    location?: SortOrderInput | SortOrder
    participants?: SortOrderInput | SortOrder
    status?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    users?: usersOrderByWithRelationInput
  }

  export type appointmentsWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: appointmentsWhereInput | appointmentsWhereInput[]
    OR?: appointmentsWhereInput[]
    NOT?: appointmentsWhereInput | appointmentsWhereInput[]
    user_id?: IntNullableFilter<"appointments"> | number | null
    title?: StringFilter<"appointments"> | string
    description?: StringNullableFilter<"appointments"> | string | null
    start_time?: DateTimeFilter<"appointments"> | Date | string
    end_time?: DateTimeFilter<"appointments"> | Date | string
    location?: StringNullableFilter<"appointments"> | string | null
    participants?: JsonNullableFilter<"appointments">
    status?: StringNullableFilter<"appointments"> | string | null
    created_at?: DateTimeNullableFilter<"appointments"> | Date | string | null
    users?: XOR<UsersNullableScalarRelationFilter, usersWhereInput> | null
  }, "id">

  export type appointmentsOrderByWithAggregationInput = {
    id?: SortOrder
    user_id?: SortOrderInput | SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    start_time?: SortOrder
    end_time?: SortOrder
    location?: SortOrderInput | SortOrder
    participants?: SortOrderInput | SortOrder
    status?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    _count?: appointmentsCountOrderByAggregateInput
    _avg?: appointmentsAvgOrderByAggregateInput
    _max?: appointmentsMaxOrderByAggregateInput
    _min?: appointmentsMinOrderByAggregateInput
    _sum?: appointmentsSumOrderByAggregateInput
  }

  export type appointmentsScalarWhereWithAggregatesInput = {
    AND?: appointmentsScalarWhereWithAggregatesInput | appointmentsScalarWhereWithAggregatesInput[]
    OR?: appointmentsScalarWhereWithAggregatesInput[]
    NOT?: appointmentsScalarWhereWithAggregatesInput | appointmentsScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"appointments"> | number
    user_id?: IntNullableWithAggregatesFilter<"appointments"> | number | null
    title?: StringWithAggregatesFilter<"appointments"> | string
    description?: StringNullableWithAggregatesFilter<"appointments"> | string | null
    start_time?: DateTimeWithAggregatesFilter<"appointments"> | Date | string
    end_time?: DateTimeWithAggregatesFilter<"appointments"> | Date | string
    location?: StringNullableWithAggregatesFilter<"appointments"> | string | null
    participants?: JsonNullableWithAggregatesFilter<"appointments">
    status?: StringNullableWithAggregatesFilter<"appointments"> | string | null
    created_at?: DateTimeNullableWithAggregatesFilter<"appointments"> | Date | string | null
  }

  export type calendarsWhereInput = {
    AND?: calendarsWhereInput | calendarsWhereInput[]
    OR?: calendarsWhereInput[]
    NOT?: calendarsWhereInput | calendarsWhereInput[]
    id?: IntFilter<"calendars"> | number
    user_id?: IntNullableFilter<"calendars"> | number | null
    name?: StringFilter<"calendars"> | string
    description?: StringNullableFilter<"calendars"> | string | null
    provider?: StringFilter<"calendars"> | string
    access_token?: StringNullableFilter<"calendars"> | string | null
    refresh_token?: StringNullableFilter<"calendars"> | string | null
    token_expiry?: DateTimeNullableFilter<"calendars"> | Date | string | null
    created_at?: DateTimeNullableFilter<"calendars"> | Date | string | null
    users?: XOR<UsersNullableScalarRelationFilter, usersWhereInput> | null
  }

  export type calendarsOrderByWithRelationInput = {
    id?: SortOrder
    user_id?: SortOrderInput | SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    provider?: SortOrder
    access_token?: SortOrderInput | SortOrder
    refresh_token?: SortOrderInput | SortOrder
    token_expiry?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    users?: usersOrderByWithRelationInput
  }

  export type calendarsWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: calendarsWhereInput | calendarsWhereInput[]
    OR?: calendarsWhereInput[]
    NOT?: calendarsWhereInput | calendarsWhereInput[]
    user_id?: IntNullableFilter<"calendars"> | number | null
    name?: StringFilter<"calendars"> | string
    description?: StringNullableFilter<"calendars"> | string | null
    provider?: StringFilter<"calendars"> | string
    access_token?: StringNullableFilter<"calendars"> | string | null
    refresh_token?: StringNullableFilter<"calendars"> | string | null
    token_expiry?: DateTimeNullableFilter<"calendars"> | Date | string | null
    created_at?: DateTimeNullableFilter<"calendars"> | Date | string | null
    users?: XOR<UsersNullableScalarRelationFilter, usersWhereInput> | null
  }, "id">

  export type calendarsOrderByWithAggregationInput = {
    id?: SortOrder
    user_id?: SortOrderInput | SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    provider?: SortOrder
    access_token?: SortOrderInput | SortOrder
    refresh_token?: SortOrderInput | SortOrder
    token_expiry?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    _count?: calendarsCountOrderByAggregateInput
    _avg?: calendarsAvgOrderByAggregateInput
    _max?: calendarsMaxOrderByAggregateInput
    _min?: calendarsMinOrderByAggregateInput
    _sum?: calendarsSumOrderByAggregateInput
  }

  export type calendarsScalarWhereWithAggregatesInput = {
    AND?: calendarsScalarWhereWithAggregatesInput | calendarsScalarWhereWithAggregatesInput[]
    OR?: calendarsScalarWhereWithAggregatesInput[]
    NOT?: calendarsScalarWhereWithAggregatesInput | calendarsScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"calendars"> | number
    user_id?: IntNullableWithAggregatesFilter<"calendars"> | number | null
    name?: StringWithAggregatesFilter<"calendars"> | string
    description?: StringNullableWithAggregatesFilter<"calendars"> | string | null
    provider?: StringWithAggregatesFilter<"calendars"> | string
    access_token?: StringNullableWithAggregatesFilter<"calendars"> | string | null
    refresh_token?: StringNullableWithAggregatesFilter<"calendars"> | string | null
    token_expiry?: DateTimeNullableWithAggregatesFilter<"calendars"> | Date | string | null
    created_at?: DateTimeNullableWithAggregatesFilter<"calendars"> | Date | string | null
  }

  export type usersWhereInput = {
    AND?: usersWhereInput | usersWhereInput[]
    OR?: usersWhereInput[]
    NOT?: usersWhereInput | usersWhereInput[]
    id?: IntFilter<"users"> | number
    name?: StringFilter<"users"> | string
    email?: StringFilter<"users"> | string
    password?: StringFilter<"users"> | string
    timezone?: StringNullableFilter<"users"> | string | null
    created_at?: DateTimeNullableFilter<"users"> | Date | string | null
    appointments?: AppointmentsListRelationFilter
    calendars?: CalendarsListRelationFilter
  }

  export type usersOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    timezone?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    appointments?: appointmentsOrderByRelationAggregateInput
    calendars?: calendarsOrderByRelationAggregateInput
  }

  export type usersWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    email?: string
    AND?: usersWhereInput | usersWhereInput[]
    OR?: usersWhereInput[]
    NOT?: usersWhereInput | usersWhereInput[]
    name?: StringFilter<"users"> | string
    password?: StringFilter<"users"> | string
    timezone?: StringNullableFilter<"users"> | string | null
    created_at?: DateTimeNullableFilter<"users"> | Date | string | null
    appointments?: AppointmentsListRelationFilter
    calendars?: CalendarsListRelationFilter
  }, "id" | "email">

  export type usersOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    timezone?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    _count?: usersCountOrderByAggregateInput
    _avg?: usersAvgOrderByAggregateInput
    _max?: usersMaxOrderByAggregateInput
    _min?: usersMinOrderByAggregateInput
    _sum?: usersSumOrderByAggregateInput
  }

  export type usersScalarWhereWithAggregatesInput = {
    AND?: usersScalarWhereWithAggregatesInput | usersScalarWhereWithAggregatesInput[]
    OR?: usersScalarWhereWithAggregatesInput[]
    NOT?: usersScalarWhereWithAggregatesInput | usersScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"users"> | number
    name?: StringWithAggregatesFilter<"users"> | string
    email?: StringWithAggregatesFilter<"users"> | string
    password?: StringWithAggregatesFilter<"users"> | string
    timezone?: StringNullableWithAggregatesFilter<"users"> | string | null
    created_at?: DateTimeNullableWithAggregatesFilter<"users"> | Date | string | null
  }

  export type appointmentsCreateInput = {
    title: string
    description?: string | null
    start_time: Date | string
    end_time: Date | string
    location?: string | null
    participants?: NullableJsonNullValueInput | InputJsonValue
    status?: string | null
    created_at?: Date | string | null
    users?: usersCreateNestedOneWithoutAppointmentsInput
  }

  export type appointmentsUncheckedCreateInput = {
    id?: number
    user_id?: number | null
    title: string
    description?: string | null
    start_time: Date | string
    end_time: Date | string
    location?: string | null
    participants?: NullableJsonNullValueInput | InputJsonValue
    status?: string | null
    created_at?: Date | string | null
  }

  export type appointmentsUpdateInput = {
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    start_time?: DateTimeFieldUpdateOperationsInput | Date | string
    end_time?: DateTimeFieldUpdateOperationsInput | Date | string
    location?: NullableStringFieldUpdateOperationsInput | string | null
    participants?: NullableJsonNullValueInput | InputJsonValue
    status?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    users?: usersUpdateOneWithoutAppointmentsNestedInput
  }

  export type appointmentsUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    user_id?: NullableIntFieldUpdateOperationsInput | number | null
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    start_time?: DateTimeFieldUpdateOperationsInput | Date | string
    end_time?: DateTimeFieldUpdateOperationsInput | Date | string
    location?: NullableStringFieldUpdateOperationsInput | string | null
    participants?: NullableJsonNullValueInput | InputJsonValue
    status?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type appointmentsCreateManyInput = {
    id?: number
    user_id?: number | null
    title: string
    description?: string | null
    start_time: Date | string
    end_time: Date | string
    location?: string | null
    participants?: NullableJsonNullValueInput | InputJsonValue
    status?: string | null
    created_at?: Date | string | null
  }

  export type appointmentsUpdateManyMutationInput = {
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    start_time?: DateTimeFieldUpdateOperationsInput | Date | string
    end_time?: DateTimeFieldUpdateOperationsInput | Date | string
    location?: NullableStringFieldUpdateOperationsInput | string | null
    participants?: NullableJsonNullValueInput | InputJsonValue
    status?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type appointmentsUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    user_id?: NullableIntFieldUpdateOperationsInput | number | null
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    start_time?: DateTimeFieldUpdateOperationsInput | Date | string
    end_time?: DateTimeFieldUpdateOperationsInput | Date | string
    location?: NullableStringFieldUpdateOperationsInput | string | null
    participants?: NullableJsonNullValueInput | InputJsonValue
    status?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type calendarsCreateInput = {
    name: string
    description?: string | null
    provider: string
    access_token?: string | null
    refresh_token?: string | null
    token_expiry?: Date | string | null
    created_at?: Date | string | null
    users?: usersCreateNestedOneWithoutCalendarsInput
  }

  export type calendarsUncheckedCreateInput = {
    id?: number
    user_id?: number | null
    name: string
    description?: string | null
    provider: string
    access_token?: string | null
    refresh_token?: string | null
    token_expiry?: Date | string | null
    created_at?: Date | string | null
  }

  export type calendarsUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    provider?: StringFieldUpdateOperationsInput | string
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    token_expiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    users?: usersUpdateOneWithoutCalendarsNestedInput
  }

  export type calendarsUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    user_id?: NullableIntFieldUpdateOperationsInput | number | null
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    provider?: StringFieldUpdateOperationsInput | string
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    token_expiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type calendarsCreateManyInput = {
    id?: number
    user_id?: number | null
    name: string
    description?: string | null
    provider: string
    access_token?: string | null
    refresh_token?: string | null
    token_expiry?: Date | string | null
    created_at?: Date | string | null
  }

  export type calendarsUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    provider?: StringFieldUpdateOperationsInput | string
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    token_expiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type calendarsUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    user_id?: NullableIntFieldUpdateOperationsInput | number | null
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    provider?: StringFieldUpdateOperationsInput | string
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    token_expiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type usersCreateInput = {
    name: string
    email: string
    password: string
    timezone?: string | null
    created_at?: Date | string | null
    appointments?: appointmentsCreateNestedManyWithoutUsersInput
    calendars?: calendarsCreateNestedManyWithoutUsersInput
  }

  export type usersUncheckedCreateInput = {
    id?: number
    name: string
    email: string
    password: string
    timezone?: string | null
    created_at?: Date | string | null
    appointments?: appointmentsUncheckedCreateNestedManyWithoutUsersInput
    calendars?: calendarsUncheckedCreateNestedManyWithoutUsersInput
  }

  export type usersUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    timezone?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    appointments?: appointmentsUpdateManyWithoutUsersNestedInput
    calendars?: calendarsUpdateManyWithoutUsersNestedInput
  }

  export type usersUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    timezone?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    appointments?: appointmentsUncheckedUpdateManyWithoutUsersNestedInput
    calendars?: calendarsUncheckedUpdateManyWithoutUsersNestedInput
  }

  export type usersCreateManyInput = {
    id?: number
    name: string
    email: string
    password: string
    timezone?: string | null
    created_at?: Date | string | null
  }

  export type usersUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    timezone?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type usersUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    timezone?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
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
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
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

  export type UsersNullableScalarRelationFilter = {
    is?: usersWhereInput | null
    isNot?: usersWhereInput | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type appointmentsCountOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    start_time?: SortOrder
    end_time?: SortOrder
    location?: SortOrder
    participants?: SortOrder
    status?: SortOrder
    created_at?: SortOrder
  }

  export type appointmentsAvgOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
  }

  export type appointmentsMaxOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    start_time?: SortOrder
    end_time?: SortOrder
    location?: SortOrder
    status?: SortOrder
    created_at?: SortOrder
  }

  export type appointmentsMinOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    start_time?: SortOrder
    end_time?: SortOrder
    location?: SortOrder
    status?: SortOrder
    created_at?: SortOrder
  }

  export type appointmentsSumOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
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
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
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

  export type calendarsCountOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    provider?: SortOrder
    access_token?: SortOrder
    refresh_token?: SortOrder
    token_expiry?: SortOrder
    created_at?: SortOrder
  }

  export type calendarsAvgOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
  }

  export type calendarsMaxOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    provider?: SortOrder
    access_token?: SortOrder
    refresh_token?: SortOrder
    token_expiry?: SortOrder
    created_at?: SortOrder
  }

  export type calendarsMinOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    provider?: SortOrder
    access_token?: SortOrder
    refresh_token?: SortOrder
    token_expiry?: SortOrder
    created_at?: SortOrder
  }

  export type calendarsSumOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
  }

  export type AppointmentsListRelationFilter = {
    every?: appointmentsWhereInput
    some?: appointmentsWhereInput
    none?: appointmentsWhereInput
  }

  export type CalendarsListRelationFilter = {
    every?: calendarsWhereInput
    some?: calendarsWhereInput
    none?: calendarsWhereInput
  }

  export type appointmentsOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type calendarsOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type usersCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    timezone?: SortOrder
    created_at?: SortOrder
  }

  export type usersAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type usersMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    timezone?: SortOrder
    created_at?: SortOrder
  }

  export type usersMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    timezone?: SortOrder
    created_at?: SortOrder
  }

  export type usersSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type usersCreateNestedOneWithoutAppointmentsInput = {
    create?: XOR<usersCreateWithoutAppointmentsInput, usersUncheckedCreateWithoutAppointmentsInput>
    connectOrCreate?: usersCreateOrConnectWithoutAppointmentsInput
    connect?: usersWhereUniqueInput
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type usersUpdateOneWithoutAppointmentsNestedInput = {
    create?: XOR<usersCreateWithoutAppointmentsInput, usersUncheckedCreateWithoutAppointmentsInput>
    connectOrCreate?: usersCreateOrConnectWithoutAppointmentsInput
    upsert?: usersUpsertWithoutAppointmentsInput
    disconnect?: usersWhereInput | boolean
    delete?: usersWhereInput | boolean
    connect?: usersWhereUniqueInput
    update?: XOR<XOR<usersUpdateToOneWithWhereWithoutAppointmentsInput, usersUpdateWithoutAppointmentsInput>, usersUncheckedUpdateWithoutAppointmentsInput>
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type usersCreateNestedOneWithoutCalendarsInput = {
    create?: XOR<usersCreateWithoutCalendarsInput, usersUncheckedCreateWithoutCalendarsInput>
    connectOrCreate?: usersCreateOrConnectWithoutCalendarsInput
    connect?: usersWhereUniqueInput
  }

  export type usersUpdateOneWithoutCalendarsNestedInput = {
    create?: XOR<usersCreateWithoutCalendarsInput, usersUncheckedCreateWithoutCalendarsInput>
    connectOrCreate?: usersCreateOrConnectWithoutCalendarsInput
    upsert?: usersUpsertWithoutCalendarsInput
    disconnect?: usersWhereInput | boolean
    delete?: usersWhereInput | boolean
    connect?: usersWhereUniqueInput
    update?: XOR<XOR<usersUpdateToOneWithWhereWithoutCalendarsInput, usersUpdateWithoutCalendarsInput>, usersUncheckedUpdateWithoutCalendarsInput>
  }

  export type appointmentsCreateNestedManyWithoutUsersInput = {
    create?: XOR<appointmentsCreateWithoutUsersInput, appointmentsUncheckedCreateWithoutUsersInput> | appointmentsCreateWithoutUsersInput[] | appointmentsUncheckedCreateWithoutUsersInput[]
    connectOrCreate?: appointmentsCreateOrConnectWithoutUsersInput | appointmentsCreateOrConnectWithoutUsersInput[]
    createMany?: appointmentsCreateManyUsersInputEnvelope
    connect?: appointmentsWhereUniqueInput | appointmentsWhereUniqueInput[]
  }

  export type calendarsCreateNestedManyWithoutUsersInput = {
    create?: XOR<calendarsCreateWithoutUsersInput, calendarsUncheckedCreateWithoutUsersInput> | calendarsCreateWithoutUsersInput[] | calendarsUncheckedCreateWithoutUsersInput[]
    connectOrCreate?: calendarsCreateOrConnectWithoutUsersInput | calendarsCreateOrConnectWithoutUsersInput[]
    createMany?: calendarsCreateManyUsersInputEnvelope
    connect?: calendarsWhereUniqueInput | calendarsWhereUniqueInput[]
  }

  export type appointmentsUncheckedCreateNestedManyWithoutUsersInput = {
    create?: XOR<appointmentsCreateWithoutUsersInput, appointmentsUncheckedCreateWithoutUsersInput> | appointmentsCreateWithoutUsersInput[] | appointmentsUncheckedCreateWithoutUsersInput[]
    connectOrCreate?: appointmentsCreateOrConnectWithoutUsersInput | appointmentsCreateOrConnectWithoutUsersInput[]
    createMany?: appointmentsCreateManyUsersInputEnvelope
    connect?: appointmentsWhereUniqueInput | appointmentsWhereUniqueInput[]
  }

  export type calendarsUncheckedCreateNestedManyWithoutUsersInput = {
    create?: XOR<calendarsCreateWithoutUsersInput, calendarsUncheckedCreateWithoutUsersInput> | calendarsCreateWithoutUsersInput[] | calendarsUncheckedCreateWithoutUsersInput[]
    connectOrCreate?: calendarsCreateOrConnectWithoutUsersInput | calendarsCreateOrConnectWithoutUsersInput[]
    createMany?: calendarsCreateManyUsersInputEnvelope
    connect?: calendarsWhereUniqueInput | calendarsWhereUniqueInput[]
  }

  export type appointmentsUpdateManyWithoutUsersNestedInput = {
    create?: XOR<appointmentsCreateWithoutUsersInput, appointmentsUncheckedCreateWithoutUsersInput> | appointmentsCreateWithoutUsersInput[] | appointmentsUncheckedCreateWithoutUsersInput[]
    connectOrCreate?: appointmentsCreateOrConnectWithoutUsersInput | appointmentsCreateOrConnectWithoutUsersInput[]
    upsert?: appointmentsUpsertWithWhereUniqueWithoutUsersInput | appointmentsUpsertWithWhereUniqueWithoutUsersInput[]
    createMany?: appointmentsCreateManyUsersInputEnvelope
    set?: appointmentsWhereUniqueInput | appointmentsWhereUniqueInput[]
    disconnect?: appointmentsWhereUniqueInput | appointmentsWhereUniqueInput[]
    delete?: appointmentsWhereUniqueInput | appointmentsWhereUniqueInput[]
    connect?: appointmentsWhereUniqueInput | appointmentsWhereUniqueInput[]
    update?: appointmentsUpdateWithWhereUniqueWithoutUsersInput | appointmentsUpdateWithWhereUniqueWithoutUsersInput[]
    updateMany?: appointmentsUpdateManyWithWhereWithoutUsersInput | appointmentsUpdateManyWithWhereWithoutUsersInput[]
    deleteMany?: appointmentsScalarWhereInput | appointmentsScalarWhereInput[]
  }

  export type calendarsUpdateManyWithoutUsersNestedInput = {
    create?: XOR<calendarsCreateWithoutUsersInput, calendarsUncheckedCreateWithoutUsersInput> | calendarsCreateWithoutUsersInput[] | calendarsUncheckedCreateWithoutUsersInput[]
    connectOrCreate?: calendarsCreateOrConnectWithoutUsersInput | calendarsCreateOrConnectWithoutUsersInput[]
    upsert?: calendarsUpsertWithWhereUniqueWithoutUsersInput | calendarsUpsertWithWhereUniqueWithoutUsersInput[]
    createMany?: calendarsCreateManyUsersInputEnvelope
    set?: calendarsWhereUniqueInput | calendarsWhereUniqueInput[]
    disconnect?: calendarsWhereUniqueInput | calendarsWhereUniqueInput[]
    delete?: calendarsWhereUniqueInput | calendarsWhereUniqueInput[]
    connect?: calendarsWhereUniqueInput | calendarsWhereUniqueInput[]
    update?: calendarsUpdateWithWhereUniqueWithoutUsersInput | calendarsUpdateWithWhereUniqueWithoutUsersInput[]
    updateMany?: calendarsUpdateManyWithWhereWithoutUsersInput | calendarsUpdateManyWithWhereWithoutUsersInput[]
    deleteMany?: calendarsScalarWhereInput | calendarsScalarWhereInput[]
  }

  export type appointmentsUncheckedUpdateManyWithoutUsersNestedInput = {
    create?: XOR<appointmentsCreateWithoutUsersInput, appointmentsUncheckedCreateWithoutUsersInput> | appointmentsCreateWithoutUsersInput[] | appointmentsUncheckedCreateWithoutUsersInput[]
    connectOrCreate?: appointmentsCreateOrConnectWithoutUsersInput | appointmentsCreateOrConnectWithoutUsersInput[]
    upsert?: appointmentsUpsertWithWhereUniqueWithoutUsersInput | appointmentsUpsertWithWhereUniqueWithoutUsersInput[]
    createMany?: appointmentsCreateManyUsersInputEnvelope
    set?: appointmentsWhereUniqueInput | appointmentsWhereUniqueInput[]
    disconnect?: appointmentsWhereUniqueInput | appointmentsWhereUniqueInput[]
    delete?: appointmentsWhereUniqueInput | appointmentsWhereUniqueInput[]
    connect?: appointmentsWhereUniqueInput | appointmentsWhereUniqueInput[]
    update?: appointmentsUpdateWithWhereUniqueWithoutUsersInput | appointmentsUpdateWithWhereUniqueWithoutUsersInput[]
    updateMany?: appointmentsUpdateManyWithWhereWithoutUsersInput | appointmentsUpdateManyWithWhereWithoutUsersInput[]
    deleteMany?: appointmentsScalarWhereInput | appointmentsScalarWhereInput[]
  }

  export type calendarsUncheckedUpdateManyWithoutUsersNestedInput = {
    create?: XOR<calendarsCreateWithoutUsersInput, calendarsUncheckedCreateWithoutUsersInput> | calendarsCreateWithoutUsersInput[] | calendarsUncheckedCreateWithoutUsersInput[]
    connectOrCreate?: calendarsCreateOrConnectWithoutUsersInput | calendarsCreateOrConnectWithoutUsersInput[]
    upsert?: calendarsUpsertWithWhereUniqueWithoutUsersInput | calendarsUpsertWithWhereUniqueWithoutUsersInput[]
    createMany?: calendarsCreateManyUsersInputEnvelope
    set?: calendarsWhereUniqueInput | calendarsWhereUniqueInput[]
    disconnect?: calendarsWhereUniqueInput | calendarsWhereUniqueInput[]
    delete?: calendarsWhereUniqueInput | calendarsWhereUniqueInput[]
    connect?: calendarsWhereUniqueInput | calendarsWhereUniqueInput[]
    update?: calendarsUpdateWithWhereUniqueWithoutUsersInput | calendarsUpdateWithWhereUniqueWithoutUsersInput[]
    updateMany?: calendarsUpdateManyWithWhereWithoutUsersInput | calendarsUpdateManyWithWhereWithoutUsersInput[]
    deleteMany?: calendarsScalarWhereInput | calendarsScalarWhereInput[]
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
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
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

  export type usersCreateWithoutAppointmentsInput = {
    name: string
    email: string
    password: string
    timezone?: string | null
    created_at?: Date | string | null
    calendars?: calendarsCreateNestedManyWithoutUsersInput
  }

  export type usersUncheckedCreateWithoutAppointmentsInput = {
    id?: number
    name: string
    email: string
    password: string
    timezone?: string | null
    created_at?: Date | string | null
    calendars?: calendarsUncheckedCreateNestedManyWithoutUsersInput
  }

  export type usersCreateOrConnectWithoutAppointmentsInput = {
    where: usersWhereUniqueInput
    create: XOR<usersCreateWithoutAppointmentsInput, usersUncheckedCreateWithoutAppointmentsInput>
  }

  export type usersUpsertWithoutAppointmentsInput = {
    update: XOR<usersUpdateWithoutAppointmentsInput, usersUncheckedUpdateWithoutAppointmentsInput>
    create: XOR<usersCreateWithoutAppointmentsInput, usersUncheckedCreateWithoutAppointmentsInput>
    where?: usersWhereInput
  }

  export type usersUpdateToOneWithWhereWithoutAppointmentsInput = {
    where?: usersWhereInput
    data: XOR<usersUpdateWithoutAppointmentsInput, usersUncheckedUpdateWithoutAppointmentsInput>
  }

  export type usersUpdateWithoutAppointmentsInput = {
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    timezone?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    calendars?: calendarsUpdateManyWithoutUsersNestedInput
  }

  export type usersUncheckedUpdateWithoutAppointmentsInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    timezone?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    calendars?: calendarsUncheckedUpdateManyWithoutUsersNestedInput
  }

  export type usersCreateWithoutCalendarsInput = {
    name: string
    email: string
    password: string
    timezone?: string | null
    created_at?: Date | string | null
    appointments?: appointmentsCreateNestedManyWithoutUsersInput
  }

  export type usersUncheckedCreateWithoutCalendarsInput = {
    id?: number
    name: string
    email: string
    password: string
    timezone?: string | null
    created_at?: Date | string | null
    appointments?: appointmentsUncheckedCreateNestedManyWithoutUsersInput
  }

  export type usersCreateOrConnectWithoutCalendarsInput = {
    where: usersWhereUniqueInput
    create: XOR<usersCreateWithoutCalendarsInput, usersUncheckedCreateWithoutCalendarsInput>
  }

  export type usersUpsertWithoutCalendarsInput = {
    update: XOR<usersUpdateWithoutCalendarsInput, usersUncheckedUpdateWithoutCalendarsInput>
    create: XOR<usersCreateWithoutCalendarsInput, usersUncheckedCreateWithoutCalendarsInput>
    where?: usersWhereInput
  }

  export type usersUpdateToOneWithWhereWithoutCalendarsInput = {
    where?: usersWhereInput
    data: XOR<usersUpdateWithoutCalendarsInput, usersUncheckedUpdateWithoutCalendarsInput>
  }

  export type usersUpdateWithoutCalendarsInput = {
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    timezone?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    appointments?: appointmentsUpdateManyWithoutUsersNestedInput
  }

  export type usersUncheckedUpdateWithoutCalendarsInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    timezone?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    appointments?: appointmentsUncheckedUpdateManyWithoutUsersNestedInput
  }

  export type appointmentsCreateWithoutUsersInput = {
    title: string
    description?: string | null
    start_time: Date | string
    end_time: Date | string
    location?: string | null
    participants?: NullableJsonNullValueInput | InputJsonValue
    status?: string | null
    created_at?: Date | string | null
  }

  export type appointmentsUncheckedCreateWithoutUsersInput = {
    id?: number
    title: string
    description?: string | null
    start_time: Date | string
    end_time: Date | string
    location?: string | null
    participants?: NullableJsonNullValueInput | InputJsonValue
    status?: string | null
    created_at?: Date | string | null
  }

  export type appointmentsCreateOrConnectWithoutUsersInput = {
    where: appointmentsWhereUniqueInput
    create: XOR<appointmentsCreateWithoutUsersInput, appointmentsUncheckedCreateWithoutUsersInput>
  }

  export type appointmentsCreateManyUsersInputEnvelope = {
    data: appointmentsCreateManyUsersInput | appointmentsCreateManyUsersInput[]
    skipDuplicates?: boolean
  }

  export type calendarsCreateWithoutUsersInput = {
    name: string
    description?: string | null
    provider: string
    access_token?: string | null
    refresh_token?: string | null
    token_expiry?: Date | string | null
    created_at?: Date | string | null
  }

  export type calendarsUncheckedCreateWithoutUsersInput = {
    id?: number
    name: string
    description?: string | null
    provider: string
    access_token?: string | null
    refresh_token?: string | null
    token_expiry?: Date | string | null
    created_at?: Date | string | null
  }

  export type calendarsCreateOrConnectWithoutUsersInput = {
    where: calendarsWhereUniqueInput
    create: XOR<calendarsCreateWithoutUsersInput, calendarsUncheckedCreateWithoutUsersInput>
  }

  export type calendarsCreateManyUsersInputEnvelope = {
    data: calendarsCreateManyUsersInput | calendarsCreateManyUsersInput[]
    skipDuplicates?: boolean
  }

  export type appointmentsUpsertWithWhereUniqueWithoutUsersInput = {
    where: appointmentsWhereUniqueInput
    update: XOR<appointmentsUpdateWithoutUsersInput, appointmentsUncheckedUpdateWithoutUsersInput>
    create: XOR<appointmentsCreateWithoutUsersInput, appointmentsUncheckedCreateWithoutUsersInput>
  }

  export type appointmentsUpdateWithWhereUniqueWithoutUsersInput = {
    where: appointmentsWhereUniqueInput
    data: XOR<appointmentsUpdateWithoutUsersInput, appointmentsUncheckedUpdateWithoutUsersInput>
  }

  export type appointmentsUpdateManyWithWhereWithoutUsersInput = {
    where: appointmentsScalarWhereInput
    data: XOR<appointmentsUpdateManyMutationInput, appointmentsUncheckedUpdateManyWithoutUsersInput>
  }

  export type appointmentsScalarWhereInput = {
    AND?: appointmentsScalarWhereInput | appointmentsScalarWhereInput[]
    OR?: appointmentsScalarWhereInput[]
    NOT?: appointmentsScalarWhereInput | appointmentsScalarWhereInput[]
    id?: IntFilter<"appointments"> | number
    user_id?: IntNullableFilter<"appointments"> | number | null
    title?: StringFilter<"appointments"> | string
    description?: StringNullableFilter<"appointments"> | string | null
    start_time?: DateTimeFilter<"appointments"> | Date | string
    end_time?: DateTimeFilter<"appointments"> | Date | string
    location?: StringNullableFilter<"appointments"> | string | null
    participants?: JsonNullableFilter<"appointments">
    status?: StringNullableFilter<"appointments"> | string | null
    created_at?: DateTimeNullableFilter<"appointments"> | Date | string | null
  }

  export type calendarsUpsertWithWhereUniqueWithoutUsersInput = {
    where: calendarsWhereUniqueInput
    update: XOR<calendarsUpdateWithoutUsersInput, calendarsUncheckedUpdateWithoutUsersInput>
    create: XOR<calendarsCreateWithoutUsersInput, calendarsUncheckedCreateWithoutUsersInput>
  }

  export type calendarsUpdateWithWhereUniqueWithoutUsersInput = {
    where: calendarsWhereUniqueInput
    data: XOR<calendarsUpdateWithoutUsersInput, calendarsUncheckedUpdateWithoutUsersInput>
  }

  export type calendarsUpdateManyWithWhereWithoutUsersInput = {
    where: calendarsScalarWhereInput
    data: XOR<calendarsUpdateManyMutationInput, calendarsUncheckedUpdateManyWithoutUsersInput>
  }

  export type calendarsScalarWhereInput = {
    AND?: calendarsScalarWhereInput | calendarsScalarWhereInput[]
    OR?: calendarsScalarWhereInput[]
    NOT?: calendarsScalarWhereInput | calendarsScalarWhereInput[]
    id?: IntFilter<"calendars"> | number
    user_id?: IntNullableFilter<"calendars"> | number | null
    name?: StringFilter<"calendars"> | string
    description?: StringNullableFilter<"calendars"> | string | null
    provider?: StringFilter<"calendars"> | string
    access_token?: StringNullableFilter<"calendars"> | string | null
    refresh_token?: StringNullableFilter<"calendars"> | string | null
    token_expiry?: DateTimeNullableFilter<"calendars"> | Date | string | null
    created_at?: DateTimeNullableFilter<"calendars"> | Date | string | null
  }

  export type appointmentsCreateManyUsersInput = {
    id?: number
    title: string
    description?: string | null
    start_time: Date | string
    end_time: Date | string
    location?: string | null
    participants?: NullableJsonNullValueInput | InputJsonValue
    status?: string | null
    created_at?: Date | string | null
  }

  export type calendarsCreateManyUsersInput = {
    id?: number
    name: string
    description?: string | null
    provider: string
    access_token?: string | null
    refresh_token?: string | null
    token_expiry?: Date | string | null
    created_at?: Date | string | null
  }

  export type appointmentsUpdateWithoutUsersInput = {
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    start_time?: DateTimeFieldUpdateOperationsInput | Date | string
    end_time?: DateTimeFieldUpdateOperationsInput | Date | string
    location?: NullableStringFieldUpdateOperationsInput | string | null
    participants?: NullableJsonNullValueInput | InputJsonValue
    status?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type appointmentsUncheckedUpdateWithoutUsersInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    start_time?: DateTimeFieldUpdateOperationsInput | Date | string
    end_time?: DateTimeFieldUpdateOperationsInput | Date | string
    location?: NullableStringFieldUpdateOperationsInput | string | null
    participants?: NullableJsonNullValueInput | InputJsonValue
    status?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type appointmentsUncheckedUpdateManyWithoutUsersInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    start_time?: DateTimeFieldUpdateOperationsInput | Date | string
    end_time?: DateTimeFieldUpdateOperationsInput | Date | string
    location?: NullableStringFieldUpdateOperationsInput | string | null
    participants?: NullableJsonNullValueInput | InputJsonValue
    status?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type calendarsUpdateWithoutUsersInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    provider?: StringFieldUpdateOperationsInput | string
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    token_expiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type calendarsUncheckedUpdateWithoutUsersInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    provider?: StringFieldUpdateOperationsInput | string
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    token_expiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type calendarsUncheckedUpdateManyWithoutUsersInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    provider?: StringFieldUpdateOperationsInput | string
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    token_expiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }



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