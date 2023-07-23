import moment from 'moment';
import { isNaN } from 'lodash';
import { UTIL } from '../constants';

const { ORDER_BY } = UTIL;

export const isEmptyObject = (obj: object): boolean => !Object.keys(obj).length;

export const pause = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

export const sumArrayOfObject = (data: { [key: string]: any }, key: string) => {
  let total: number = 0;
  for (let i = 0; i < data.length; i += 1) {
    const amount: number = Number(data[i][key]);
    if (!isNaN(amount)) {
      total += amount;
    }
  }
  return total;
};

export const convertObjectToArray = (
  object: { [key: string]: any },
  newKey: string,
  sortKey: string,
  orderBy: string = ORDER_BY.ASCENDING
): any => {
  const output: {
    [key: string]: any;
  }[] = Object.keys(object)
    .map((key) => ({
      key,
      [newKey]: object[key],
    }))
    .sort((a: any, b: any) => {
      let itemA = a[sortKey];
      let itemB = b[sortKey];
      if (moment(itemA).isValid() || moment(itemB).isValid()) {
        itemA = new Date(itemA).valueOf();
        itemB = new Date(itemB).valueOf();
      }
      if (orderBy === ORDER_BY.DESCENDING) return itemB - itemA;
      if (orderBy === ORDER_BY.ASCENDING) return itemA - itemB;

      return itemB - itemA;
    });

  return output;
};

export const isTruthy = (input: any) => input && true;
