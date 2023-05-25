import { mySqlConfig } from './mysql';

type DataBaseType = 'mySql';
export const configDataBase = (type: DataBaseType) => {
  const databaseTypes = {
    mySql: mySqlConfig,
  };

  return databaseTypes[type];
};
