import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { EstoqueService } from '../../../core/services/estoque';

@Component({
  selector: 'app-produto-form',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './produto-form.html',
  styleUrls: ['./produto-form.scss']
})
export class ProdutoFormComponent {
  produto = { codigo: '', descricao: '', saldo: 0 };
  mensagem = '';

  constructor(private estoqueService: EstoqueService) {}

  salvarProduto() {
    if (!this.produto.codigo || !this.produto.descricao) {
      this.mensagem = 'Preencha todos os campos obrigatórios.';
      return;
    }

    this.estoqueService.criarProduto(this.produto).subscribe({
      next: (res) => {
        this.mensagem = `✅ Produto "${res.descricao}" cadastrado com sucesso!`;
        this.produto = { codigo: '', descricao: '', saldo: 0 }; 
      },
      error: (err) => {
        console.error('Erro ao cadastrar produto:', err);
        this.mensagem = '❌ Erro ao cadastrar produto. Verifique o console.';
      }
    });
  }
}
