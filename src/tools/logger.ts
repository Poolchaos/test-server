import moment from 'moment';

// @ts-ignore
const getTimestamp = () => {
  return moment().format('YYYY-MM-DD HH:mm:ss')
};
// @ts-ignore
export const log = (value, data?) => {
  console.log('\u001B[38;5;8m[34m' + getTimestamp() + '\u001B[38;5;8m[0m - ' + value, (data || ''));
}
// @ts-ignore
export const error = (value, data?) => {
  console.log('\u001B[38;5;9m[34m' + getTimestamp() + '\u001B[38;5;9m[0m - ' + value, (data || ''));
}