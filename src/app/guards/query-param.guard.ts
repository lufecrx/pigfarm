import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const queryParamGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);

  if (!route.queryParams.hasOwnProperty('key') || !route.queryParams['key']) {
    // Se o parâmetro 'id' não estiver presente ou for vazio, redirecione para outra rota
    router.navigate(['/list-pigs']);
    return false;
  } else {
    // Parâmetro 'id' válido, permitir acesso à rota
    return true;
  }
};