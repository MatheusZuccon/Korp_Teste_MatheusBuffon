import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EstoqueService {
  private apiUrl = 'http://localhost:5201/produtos'; 

  constructor(private http: HttpClient) {}

  listarProdutos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  criarProduto(produto: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, produto);
  }
}
