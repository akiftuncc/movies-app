export function prismaWhereCreatorWithTable(
  table: string,
  valueKey: string,
  type: string,
  value: any,
) {
  return {
    where: {
      [table]: {
        some: {
          [valueKey]: {
            [type]: value,
          },
        },
      },
    },
  };
}

export function prismaPaginateCreator(page: number, perPage: number) {
  return {
    skip: (page - 1) * perPage,
    take: perPage,
  };
}

export function prismaDeletedAt(value: string) {
  return {
    deletedAt: new Date(),
    username: 'deleted_' + value + new Date().toString(),
  };
}
