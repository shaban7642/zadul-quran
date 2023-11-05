import moment from 'moment';

export const convertToNormalDate = (date: any, type?: string) =>
    moment(date)
        .locale('en')
        // .add(type === 'from' ? 0 : 1, 'd')
        .format('YYYY-MM-DD');
