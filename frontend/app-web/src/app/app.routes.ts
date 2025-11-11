import { Routes } from '@angular/router';
import { Notas } from './features/notas/notas';
import { EstoqueComponent  } from './features/estoque/estoque';
import { ProdutoFormComponent } from './features/estoque/produto-form/produto-form';
import { DetalheNotaComponent } from './features/notas/detalhe-nota/detalhe-nota';




export const routes: Routes = [
  { path: '', redirectTo: '/notas', pathMatch: 'full' },
  { path: 'notas', component: Notas },
  { path: 'estoque', component: EstoqueComponent },
  { path: 'estoque/novo', component: ProdutoFormComponent },
  { path: 'notas/:id', component: DetalheNotaComponent }
];


