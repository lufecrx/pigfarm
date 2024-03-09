import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFireDatabase,
  AngularFireList,
} from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RestService {
  private basePath = '/pigfarm'; // Caminho para a coleção de dados no Firebase
  private itemsRef: AngularFireList<any> | undefined; // Referência para a lista de itens

  constructor(
    private db: AngularFireDatabase,
    private afAuth: AngularFireAuth,
  ) {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        // O usuário está autenticado
        this.itemsRef = db.list(`${this.basePath}/${user.uid}`);
      } else {
        // O usuário não está autenticado
      }
    });
  }

  // Retorna todos os itens
  getItems(): Observable<any[]> {
    if (this.itemsRef) {
      return this.itemsRef
        .snapshotChanges()
        .pipe(
          map(changes =>
            changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
          )
        );
    } else {
      // Retorna um observable vazio
      return new Observable<any[]>();
    }
  }

  // Retorna um item específico pelo seu ID
  getItem(key: string): Observable<any> {
    return this.afAuth.authState.pipe(
      map(user => {
        if (user) {
          return this.db.object(`${this.basePath}/${user.uid}/${key}`).valueChanges();
        } else {
          // Retorna um observable vazio
          return new Observable<any>();
        }
      })
    );
  }

  // Adiciona um novo item
  addItem(item: any): void {
    if (this.itemsRef) {
      this.itemsRef.push(item);
    }
  }

  // Atualiza um item existente
  updateItem(key: string, value: any): void {
    if (this.itemsRef) {
      this.itemsRef.update(key, value);
    }
  }

  // Retorna todos os itens
  searchItems(searchTerm: string): Observable<any[]> {
    if (this.itemsRef) {
      return this.itemsRef
        .snapshotChanges()
        .pipe(
          map(changes =>
            changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
          ),
          map(items =>
            items.filter(item => this.matchKeyword(item, searchTerm))
          )
        );
    } else {
      // Retorna um observable vazio
      return new Observable<any[]>();
    }
  }

  // Verifica se o item contém a palavra-chave
  private matchKeyword(item: any, keyword: string): boolean {
    if (!keyword) {
      return true; // Retorna verdadeiro se não houver palavra-chave especificada
    }
    // Verifica se qualquer propriedade do item contém a palavra-chave
    for (const key in item) {
      if (Object.prototype.hasOwnProperty.call(item, key)) {
        const value = item[key];
        if (
          typeof value === 'string' &&
          value.toLowerCase().includes(keyword.toLowerCase())
        ) {
          return true; // Retorna verdadeiro se a palavra-chave for encontrada
        }
      }
    }
    return false; // Retorna falso se a palavra-chave não for encontrada em nenhum lugar no item
  }

  // Deleta um item
  deleteItem(key: string): void {
    if (this.itemsRef) {
      this.itemsRef.remove(key);
    }
  }
}
