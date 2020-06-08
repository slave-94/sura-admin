import { Injectable } from '@angular/core';

import { map } from 'rxjs/operators';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { AngularFireStorage } from 'angularfire2/storage';
import { UploadTask } from '@angular/fire/storage/interfaces';

import { InfoItem } from 'src/app/shared/model/info-item.model';
import { FormItemDialog } from 'src/app/shared/model/form-item.model';

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

    getFormItems(obj): FormItemDialog[] {
        const formItems = [];
        const itemKeys = Object.keys(obj);
        for (var key of itemKeys) {
            formItems.push(new FormItemDialog(key, obj[key]));
        }
        return formItems;
    }

    //merge item selected data with form data from dialog
    addFormDataToItem(itemSelectedData, formItems): Object {
        return Object.assign({}, itemSelectedData, this.convertToJSON(formItems));
    }

    fillForm(obj, form): FormItemDialog[] {
        const formItems = this.getFormItems(obj);
        form.forEach((item) => {
            const value = formItems.filter(i => i.key === item.key)[0].value;
            if (value) {
                item.value = value;
            }
        });
        return form;
    }

    clearForm(form) {
        form.forEach((item) => {
            item.value = null;
        })
    }

    convertToJSON(data: FormItemDialog[]) {
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

    //CRUD imagen

    getImageUrl(storage, id): Promise<any> {
        return this._storage.ref(`${storage}/${id}`).getDownloadURL().toPromise();
    }

    uploadImage(storage, image): UploadTask {
        const id = this.generateId();
        const imgString = `data:image/jpeg;base64,${image}`;
        return this._storage.ref(`${storage}/${id}`).putString(imgString, "data_url").task;
    }

    deleteImage(storage, id): Promise<any> {
        return this._storage.ref(`${storage}/${id}`).delete().toPromise();
    }

    //CRUD item con imagen

    //this saves object in collection and image file in storage then this saves image url from storage
    //to object and finally it creates object in collection
    createItemWithImage(storageName, file, collectionName, data, needsIdField?: boolean): Promise<any> {
        return this.uploadImage(storageName, file).then(
            result => {
                data.imagenId = result.metadata.name;
                return this.getImageUrl(storageName, data.imagenId).then(
                    result => {
                        data.imagenUrl = result;
                        return this.createItem(collectionName, data, needsIdField);
                    });
            });
    }

    //this deletes old image file from storage and it saves new image file in storage then
    //this saves image url from storage to object and finally it updates object in collection
    updateItemWithImage(storageName, imageId, file, collectionName, itemId, data): Promise<any> {
        return this.deleteImage(storageName, imageId).then(
            () => {
                return this.uploadImage(storageName, file).then(
                    result => {
                        data.imagenId = result.metadata.name;
                        return this.getImageUrl(storageName, data.imagenId).then(
                            result => {
                                data.imagenUrl = result;
                                return this.updateItem(collectionName, itemId, data);
                            });
                    });
            });
    }

    //this deletes image file from storage and it deletes object in collection
    deleteItemWithImage(storageName, imageId, collectionName, itemId): Promise<any> {
        return this.deleteImage(storageName, imageId).then(
            () => {
                return this.deleteItem(collectionName, itemId);
            });
    }
}