import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from './api-config';

@Injectable({ providedIn: 'root' })
export class NotaService {
  private baseUrl = `${API_CONFIG.faturamento}/notas`;

  constructor(private http: HttpClient) {}

  listar(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  criar(): Observable<any> {
    return this.http.post<any>(this.baseUrl, {});
  }

  adicionarItem(id: number, item: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/${id}/itens`, item);
  }

  fechar(id: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/${id}/fechar`, {});
  }
}
