import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { RestService } from '../services/rest/rest.service';
import { Observable, map } from 'rxjs';

export const queryParamGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const restService = inject(RestService);
  const pigRef = route.queryParams['pigRef'];

  if (!pigRef) {
    // Se o parâmetro 'pigRef' não estiver presente na URL ou for vazio
    router.navigate(['manager/list-pigs']);
    return new Observable<boolean | UrlTree>(observer => {
      observer.next(false);
      observer.complete();
    });
  } else {
    // Verifica se o item referenciado pelo 'pigRef' existe
    return restService.itemExists(pigRef).pipe(map(exists => {
      if (!exists) {
        // Se o item não existir, redirecione para outra rota
        router.navigate(['manager/list-pigs']);
        return false;
      } else {
        // Parâmetro 'pigRef' válido
        return true;
      }
    }));
  }
};
