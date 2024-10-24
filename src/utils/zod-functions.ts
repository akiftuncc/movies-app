import { z } from 'zod';

type ZodSchemaFromInterface<T> = {
  [K in keyof T]: z.ZodTypeAny;
};

export function interfaceToZod<T>(
  definition: ZodSchemaFromInterface<T>,
): z.ZodObject<ZodSchemaFromInterface<T>> {
  return z.object(definition);
}
