import { Injectable } from '@angular/core';

import { map } from 'rxjs/operators';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { AngularFireStorage } from 'angularfire2/storage';
import { UploadTask } from '@angular/fire/storage/interfaces';

import { InfoItem } from 'src/app/shared/model/info-item.model';
import { FormItem } from 'src/app/shared/dialog/form-item.model';

@Injectable()
export class AdminService {

    private collection: AngularFirestoreCollection;

    constructor(
        private _database: AngularFirestore,
        private _storage: AngularFireStorage
    ) { }

    //UTILS
    generateId(): string {
        return this._database.createId();
    }

    getFormItems(obj): FormItem[] {
        const formItems = [];
        const itemKeys = Object.keys(obj);
        for (var key of itemKeys) {
            formItems.push(new FormItem(key, obj[key]));
        }
        return formItems;
    }

    generateFormItem(key, value): FormItem[] {
        return [new FormItem(key, value)];
    }

    //merge item selected data with form data from dialog
    addFormDataToItem(itemSelectedData, formItems): any {
        return Object.assign({}, itemSelectedData, this.convertToJSON(formItems));
    }

    fillForm(obj, form): FormItem[] {
        const formItems = this.getFormItems(obj);
        form.forEach((item) => {
            const formItem = formItems.filter(i => i.key === item.key)[0];
            if (formItem) {
                item.value = formItem.value;
            }
        });
        return form;
    }

    clearForm(form) {
        form.forEach((item) => {
            item.value = null;
        })
    }

    convertToJSON(data: FormItem[]) {
        let str = '{';
        data.forEach((result, index) => {
            str += `"${result.key}":"${result.value}"${(index < data.length - 1) ? ',' : ''}`
        });
        str += '}';
        return JSON.parse(str);
    }

    //CRUD items

    getItems(collectionName: string): any {
        this.collection = this._database.collection(collectionName);
        return this.collection.snapshotChanges().pipe(
            map(actions => actions.map(action => {
                const id = action.payload.doc.id;
                const data = action.payload.doc.data();
                return new InfoItem(id, data);
            }))
        )
    }

    createItem(collection, data, needsIdField?: boolean): Promise<any> {
        const id = this.generateId();
        if (needsIdField) {
            data.id = id;
        }
        return this._database.collection(collection).doc(id).set(data);
    }

    updateItem(collection, id, data): Promise<any> {
        return this._database.collection(collection).doc(id).set(data);
    }

    deleteItem(collection, id): Promise<any> {
        return this._database.collection(collection).doc(id).delete();
    }

    //RELATIONSHIPS

    //get items with relationship
    getItemsWithRelationship(collection, field, id): Promise<any> {
        return this._database.collection(collection).ref.where(field, "==", id).get();
    }

    //delete items with relationship
    deleteItemsWithRelationship(collectionA, collectionB, field, id): Promise<any> {
        return this._database.collection(collectionA).ref.where(field, "==", id).get().then(
            result => {
                result.forEach(doc => {
                    this.deleteItem(collectionB, doc.id);
                });
            }
        );
    }

    //CRUD imagen

    getImageUrl(storage, id): Promise<any> {
        return this._storage.ref(`${storage}/${id}`).getDownloadURL().toPromise();
    }

    uploadImage(storage, image, name?: string): UploadTask {
        const id = name ? name : this.generateId();
        const imgString = `data:image/jpeg;base64,${image}`;
        return this._storage.ref(`${storage}/${id}`).putString(imgString, "data_url").task;
    }

    deleteImage(storage, id): Promise<any> {
        return this._storage.ref(`${storage}/${id}`).delete().toPromise();
    }

    //CRUD item con imagen

    //this saves object in collection and image file in storage then this saves image url from storage
    //to object and finally it creates object in collection
    createItemWithImage(storageName, file, collection, data, needsIdField?: boolean): Promise<any> {
        return this.uploadImage(storageName, file).then(
            result => {
                data.imagenId = result.metadata.name;
                return this.getImageUrl(storageName, data.imagenId).then(
                    result => {
                        data.imagenUrl = result;
                        return this.createItem(collection, data, needsIdField);
                    });
            });
    }

    //this deletes old image file from storage and it saves new image file in storage then
    //this saves image url from storage to object and finally it updates object in collection
    updateItemWithImage(storageName, imageId, file, collection, itemId, data): Promise<any> {
        return this.deleteImage(storageName, imageId).then(
            () => {
                return this.uploadImage(storageName, file).then(
                    result => {
                        data.imagenId = result.metadata.name;
                        return this.getImageUrl(storageName, data.imagenId).then(
                            result => {
                                data.imagenUrl = result;
                                return this.updateItem(collection, itemId, data);
                            });
                    });
            });
    }

    //this deletes image file from storage and it deletes object in collection
    deleteItemWithImage(storageName, imageId, collection, itemId): Promise<any> {
        return this.deleteImage(storageName, imageId).then(
            () => {
                return this.deleteItem(collection, itemId);
            });
    }
}