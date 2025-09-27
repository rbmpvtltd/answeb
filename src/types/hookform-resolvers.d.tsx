declare module '@hookform/resolvers/zod' {
  import { ZodSchema } from 'zod';
  import { Resolver } from 'react-hook-form';

  export function zodResolver<T extends ZodSchema<any>>(
    schema: T,
    schemaOptions?: Partial<any>,
    resolverOptions?: Partial<any>
  ): Resolver<any>;
}