export function prismaWhereCreatorWithTable(
  table: string,
  valueKey: string,
  type: string,
  value: any,
  isMany: boolean = true,
) {
  //BURADA
  if (isMany) {
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
  return {
    where: {
      [table]: {
        [valueKey]: {
          [type]: value,
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

export function prismaDeletedAt(key: string, value: string) {
  return {
    deletedAt: new Date(),
    [key]: 'deleted_' + value + new Date().toString(),
  };
}
