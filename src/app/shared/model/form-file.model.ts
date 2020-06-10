import { FormItemDialog } from './form-item.model';

export interface FormFile {
    formItems?: FormItemDialog[];
    image?: string;
    imageRequired?: boolean,
    itemHasModel?:boolean
}