type WhereCondition = {
  table: string;
  valueKey: string;
  type: string;
  value: any;
  isMany?: boolean;
  includeDeletedAt?: boolean;
};

export function prismaWhereCreator({
  table,
  valueKey,
  type,
  value,
  isMany = true,
  includeDeletedAt = false,
}: WhereCondition) {
  const baseCondition = {
    [valueKey]: {
      [type]: value,
    },
  };

  const tableCondition = isMany ? { some: baseCondition } : baseCondition;

  const where: Record<string, any> = {
    [table]: tableCondition,
  };

  if (includeDeletedAt) {
    where.deletedAt = null;
  }

  return { where };
}

// Usage examples:
export const prismaWhereCreatorWithTable = (
  table: string,
  valueKey: string,
  type: string,
  value: any,
  isMany: boolean = true,
) => prismaWhereCreator({ table, valueKey, type, value, isMany });

export const prismaWhereCreatorWithTableDeletedAt = (
  table: string,
  valueKey: string,
  type: string,
  value: any,
  isMany: boolean = true,
) =>
  prismaWhereCreator({
    table,
    valueKey,
    type,
    value,
    isMany,
    includeDeletedAt: true,
  });

export function prismaPaginateCreator(page: number, perPage: number) {
  return {
    skip: (page - 1) * perPage,
    take: perPage,
  };
}

export function prismaDeletedAt(key: string, value: string) {
  return {
    deletedAt: new Date(),
    [key]: 'deleted_' + value + new Date().toString(),
  };
}
