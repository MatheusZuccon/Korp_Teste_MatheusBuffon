import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { EstoqueService } from '../../core/services/estoque';
import { RouterModule } from '@angular/router'; 
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-estoque',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatIconModule, HttpClientModule, RouterModule, MatProgressSpinnerModule, MatButtonModule],
  templateUrl: './estoque.html',
  styleUrls: ['./estoque.scss']
})
export class EstoqueComponent implements OnInit {
  produtos: any[] = [];
  displayedColumns: string[] = ['id', 'codigo', 'descricao', 'saldo'];

  constructor(private estoqueService: EstoqueService) {}

  ngOnInit(): void {
    this.estoqueService.listarProdutos().subscribe({
      next: (dados) => {
        this.produtos = dados;
        console.log('Produtos carregados:', dados);
      },
      error: (err) => console.error('Erro ao carregar produtos', err)
    });
  }
}
