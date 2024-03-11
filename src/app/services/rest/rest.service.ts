import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFireDatabase,
  AngularFireList,
} from '@angular/fire/compat/database';
import { Observable, firstValueFrom, of } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RestService {
  private basePath = '/pigfarm'; // Caminho para a coleção de dados no Firebase
  private itemsRef: AngularFireList<any> | undefined; // Referência para a lista de itens

  constructor(
    private db: AngularFireDatabase,
    private afAuth: AngularFireAuth
  ) {
    this.afAuth.authState.subscribe((user) => {
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
          map((changes) =>
            changes.map((c) => ({ key: c.payload.key, ...c.payload.val() }))
          )
        );
    } else {
      // Retorna um observable vazio
      return new Observable<any[]>();
    }
  }

  // Retornar itens paginados
  getItemsPaginated(page: number, pageSize: number): Observable<any[]> {
    return this.afAuth.authState.pipe(
      take(1),
      switchMap(user => {
        if (user) {
          if (this.itemsRef) {
            return this.itemsRef.snapshotChanges().pipe(
              map(changes => changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))),
              map(items => items.slice((page - 1) * pageSize, page * pageSize))
            );
          } else {
            // Se itemsRef não estiver definido
            this.itemsRef = this.db.list(`${this.basePath}/${user.uid}`);
            return this.itemsRef.snapshotChanges().pipe(
              map(changes => changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))),
              map(items => items.slice((page - 1) * pageSize, page * pageSize))
            );
          }
        } else {
          // Se o usuário não estiver autenticado, retorne um Observable vazio
          return of([]);
        }
      })
    );
  }


  // Retorna um item específico pelo seu ID
  getItem(key: string): Observable<any> {
    return this.afAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.db
            .object(`${this.basePath}/${user.uid}/${key}`)
            .valueChanges();
        } else {
          return new Observable<any>();
        }
      })
    );
  }

  // Checa se o item existe
  itemExists(key: string): Observable<boolean> {
    return this.getItem(key).pipe(
      map(item => !!item) // Transforma o item em um valor booleano indicando se existe ou não
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
      return this.itemsRef.snapshotChanges().pipe(
        map((changes) =>
          changes.map((c) => ({ key: c.payload.key, ...c.payload.val() }))
        ),
        map((items) =>
          items.filter((item) => this.matchKeyword(item, searchTerm))
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

  addWeightToPig(pigRef: string, value: any): void {
    const { weight, date } = value;

    if (this.itemsRef) {
      this.afAuth.authState.subscribe((user) => {
        if (user) {
          const weightPath = `${this.basePath}/${user.uid}/${pigRef}/weightHistory`;
          const newWeightRef = this.db.list(weightPath);

          const newWeight = {
            weight: weight,
            date: date,
          };

          newWeightRef
            .push(newWeight)
            .then(() => {
              console.log('Peso adicionado com sucesso ao documento do porco.');
            })
            .catch((error) => {
              console.error(
                'Erro ao adicionar peso ao documento do porco:',
                error
              );
            });
        } else {
          console.error('Usuário não autenticado.');
        }
      });
    } else {
      console.error('Referência de itens não está definida.');
    }
  }

  getWeightHistory(pigRef: string): Observable<any> {
    if (this.itemsRef) {
      return this.afAuth.authState.pipe(
        take(1),
        switchMap(user => {
          if (user) {
            return this.db.list<any>(`${this.basePath}/${user.uid}/${pigRef}/weightHistory`).valueChanges();
          } else {
            return of(null);
          }
        })
      );
    }
    return new Observable<any[]>();
  }

  updateWeightHistory(pigRef: string, updatedWeightHistory: any): Promise<void> {
    return firstValueFrom(this.afAuth.authState.pipe(
      take(1),
      switchMap(user => {
        if (user) {
          return this.db.object(`${this.basePath}/${user.uid}/${pigRef}/weightHistory`).set(updatedWeightHistory);
        } else {
          return Promise.resolve(); // Retorne uma promessa vazia se o usuário não estiver autenticado
        }
      })
    ));
  }
}
