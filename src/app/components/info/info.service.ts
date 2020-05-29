import { Injectable } from '@angular/core';

import { map } from 'rxjs/operators';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { InfoItem } from 'src/app/shared/model/info-item.model';
import { Observable } from 'rxjs';
import { FormItemDialog } from 'src/app/shared/model/form.dialog.model';

@Injectable()
export class InfoService {

    private collection: AngularFirestoreCollection;

    constructor(
        private _database: AngularFirestore,
    ) { }

    public getCollection(collectionName: string): any {
        this.collection = this._database.collection(collectionName);
        return this.collection.snapshotChanges().pipe(
            map(actions => actions.map(action => {
                const id = action.payload.doc.id;
                const data = action.payload.doc.data();
                return new InfoItem(id, data);
            }))
        )
    }

    public convertToJSON(data: FormItemDialog[]) {
        let str = '{';
        data.forEach((result, index) => {
            str += `"${result.key}":"${result.value}"${(index < data.length - 1) ? ',' : ''}`
        });
        str += '}';
        return JSON.parse(str);
    }

    public updateItemData(collection, id, data): Promise<any> {
        return this._database.collection(collection).doc(id).set(data);        
    }
}