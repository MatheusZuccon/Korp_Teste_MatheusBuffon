import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FaturamentoService {
  private apiUrl = 'http://localhost:5204/notas'; 

  constructor(private http: HttpClient) {}

  listarNotas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      catchError((error) => this.handleError('listar notas', error))
    );
  }

  criarNota(): Observable<any> {
    return this.http.post<any>(this.apiUrl, {}).pipe(
      catchError((error) => this.handleError('criar nota', error))
    );
  }

  adicionarItem(notaId: number, item: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${notaId}/itens`, item).pipe(
      catchError((error) => this.handleError('adicionar item à nota', error))
    );
  }

  imprimirNota(notaId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${notaId}/imprimir`, {}).pipe(
      catchError((error) => this.handleError('imprimir nota', error))
    );
  }

  private handleError(acao: string, error: any): Observable<never> {
    console.error(`Erro ao ${acao}:`, error);

    const mensagem =
      error.status === 0
        ? '❌ Falha na comunicação com o servidor.'
        : `❌ Erro ao ${acao}. Código: ${error.status}`;

    return throwError(() => new Error(mensagem));
  }
}
