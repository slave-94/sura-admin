import { FormItem } from './form-item.model';

export interface IFormContent {
    formItems?: FormItem[],
    image?: string,
    imageFieldAvailable?: boolean,
    imageFieldOptional?: boolean,
    dynamic?: boolean
}