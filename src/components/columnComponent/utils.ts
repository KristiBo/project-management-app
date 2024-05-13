import { IColumn } from '../../api-services/types/types';

export const sortColumn = (a: IColumn, b: IColumn) => {
  if (a.order > b.order) {
    return 1;
  } else {
    return -1;
  }
};
