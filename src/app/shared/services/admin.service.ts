import { Injectable } from '@angular/core';

import { map } from 'rxjs/operators';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { AngularFireStorage } from 'angularfire2/storage';
import { UploadTask } from '@angular/fire/storage/interfaces';

import { InfoItem } from 'src/app/shared/model/info-item.model';
import { FormItemDialog } from 'src/app/shared/model/form.dialog.model';

@Injectable()
export class AdminService {

    private collection: AngularFirestoreCollection;

    constructor(
        private _database: AngularFirestore,
        private _storage: AngularFireStorage
    ) { }

    getCollection(collectionName: string): any {
        this.collection = this._database.collection(collectionName);
        return this.collection.snapshotChanges().pipe(
            map(actions => actions.map(action => {
                const id = action.payload.doc.id;
                const data = action.payload.doc.data();
                return new InfoItem(id, data);
            }))
        )
    }

    convertToJSON(data: FormItemDialog[]) {
        let str = '{';
        data.forEach((result, index) => {
            str += `"${result.key}":"${result.value}"${(index < data.length - 1) ? ',' : ''}`
        });
        str += '}';
        return JSON.parse(str);
    }

    createItem(collection, data): Promise<any> {
        const id = this.generateId();
        return this._database.collection(collection).doc(id).set(data);        
    }

    updateItem(collection, id, data): Promise<any> {
        return this._database.collection(collection).doc(id).set(data);        
    }

    deleteItem(collection, id): Promise<any> {
        return this._database.collection(collection).doc(id).delete();
    }

    generateId(): string {
        return this._database.createId();
    }

    getImageUrl(storage,id):Promise<any> {
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
}