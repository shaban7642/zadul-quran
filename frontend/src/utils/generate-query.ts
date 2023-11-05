import { isNil, isEmpty } from 'lodash';

export const generateQuery = (obj: { [key: string]: any }) => {
    const keys = Object.keys(obj);

    const queryArray: string[] = [];

    if (!obj) {
        return '';
    }

    keys.forEach((key: string) => {
        if (
            (!isEmpty(obj[key]) && !isNil(obj[key])) ||
            typeof obj[key] === 'number'
        ) {
            queryArray.push(`${key}=${obj[key]}`);
        }

        if (key === 'archived' || key === 'exported') {
            queryArray.push(`${key}=${obj[key]}`);
        }
    });

    return queryArray.join('&');
};
