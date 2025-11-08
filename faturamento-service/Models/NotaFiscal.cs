using System.Collections.Generic;

namespace faturamento_service.Models;

public class NotaFiscal
{
    public int Id { get; set; }
    public int Numero { get; set; }
    public StatusNota Status { get; set; } = StatusNota.Aberta;

    public List<NotaItem> Itens { get; set; } = new();
}
