import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from './api-config';

export interface Produto {
  id: number;
  nome: string;
  codigo: string;
  saldo: number;
}

@Injectable({ providedIn: 'root' })
export class ProdutoService {
  private baseUrl = `${API_CONFIG.estoque}/produtos`;

  constructor(private http: HttpClient) {}

  listar(): Observable<Produto[]> {
    return this.http.get<Produto[]>(this.baseUrl);
  }
}
