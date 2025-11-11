import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotasService {
  private apiUrl = 'http://localhost:5204/notas'; 
  constructor(private http: HttpClient) {}

  listarNotas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  criarNota(): Observable<any> {
    return this.http.post<any>(this.apiUrl, {});
  }

  adicionarItem(notaId: number, item: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${notaId}/itens`, item);
  }

  fecharNota(id: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/fechar`, {});
  }
}
