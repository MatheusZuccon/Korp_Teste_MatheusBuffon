import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FaturamentoService } from '../../core/services/faturamento';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { Router } from '@angular/router';

@Component({
  selector: 'app-notas',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './notas.html',
  styleUrls: ['./notas.scss']
})
export class Notas {
  notas: any[] = [];
  displayedColumns = ['numero', 'status', 'acoes'];

  constructor(private faturamentoService: FaturamentoService, public router: Router) {}

  ngOnInit() {
    this.carregarNotas();
  }

  abrirNota(id: number) {
  this.router.navigate(['/notas', id]);
  }
  carregarNotas() {
    this.faturamentoService.listarNotas().subscribe({
      next: (dados) => this.notas = dados,
      error: (err) => console.error('Erro ao carregar notas', err)
    });
  }

  novaNota() {
    this.faturamentoService.criarNota().subscribe({
      next: (nota) => {
        alert(`Nota ${nota.numero} criada com sucesso!`);
        this.carregarNotas();
      },
      error: (err) => alert('Erro ao criar nota.')
    });
  }

  imprimirNota(id: number) {
    this.faturamentoService.imprimirNota(id).subscribe({
      next: (res) => {
        alert(`Nota impressa e fechada com sucesso!`);
        this.carregarNotas();
      },
      error: (err) => alert(err.error || 'Erro ao imprimir nota.')
    });
  }
}
