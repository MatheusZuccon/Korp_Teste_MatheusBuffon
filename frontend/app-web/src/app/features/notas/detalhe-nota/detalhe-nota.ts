import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { FaturamentoService } from '../../../core/services/faturamento';
import { EstoqueService } from '../../../core/services/estoque';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-detalhe-nota',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatSnackBarModule 
  ],
  templateUrl: './detalhe-nota.html',
  styleUrls: ['./detalhe-nota.scss']
})
export class DetalheNotaComponent {
  nota: any;
  produtos: any[] = [];
  novoItem = { codigoProduto: '', quantidade: 1 };
  displayedColumns = ['codigoProduto', 'quantidade'];
  carregandoNota = false;
  carregandoProdutos = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private faturamentoService: FaturamentoService,
    private estoqueService: EstoqueService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.carregarNota(id);
    this.carregarProdutos();
  }

  carregarNota(id: number) {
    this.carregandoNota = true;
    this.faturamentoService.listarNotas().subscribe({
      next: (notas) => {
        this.nota = notas.find(n => n.id === id);
        this.carregandoNota = false;
      },
      error: () => {
        this.carregandoNota = false;
        this.snackBar.open('❌ Erro ao carregar nota. Verifique sua conexão.', 'Fechar', {
          duration: 4000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  carregarProdutos() {
    this.carregandoProdutos = true;
    this.estoqueService.listarProdutos().subscribe({
      next: (res) => {
        this.produtos = res;
        this.carregandoProdutos = false;
      },
      error: () => {
        this.carregandoProdutos = false;
        this.snackBar.open('❌ Erro ao carregar produtos do estoque.', 'Fechar', {
          duration: 4000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  adicionarItem() {
    if (!this.novoItem.codigoProduto || this.novoItem.quantidade <= 0) {
      this.snackBar.open('⚠️ Preencha o código e a quantidade.', 'Fechar', {
        duration: 3000
      });
      return;
    }

    this.faturamentoService.adicionarItem(this.nota.id, this.novoItem).subscribe({
      next: () => {
        this.snackBar.open('✅ Produto adicionado com sucesso!', 'Fechar', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.carregarNota(this.nota.id);
        this.novoItem = { codigoProduto: '', quantidade: 1 };
      },
      error: () => {
        this.snackBar.open('❌ Erro ao adicionar item na nota.', 'Fechar', {
          duration: 4000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  voltar() {
    this.router.navigate(['/notas']);
  }
}
