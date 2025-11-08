using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace faturamento_service.Models
{
    public class NotaItem
    {
        public int Id { get; set; }

        [Required]
        public string CodigoProduto { get; set; }

        [Required]
        public int Quantidade { get; set; }

        public int NotaFiscalId { get; set; }

        [JsonIgnore]
        public NotaFiscal? NotaFiscal { get; set; }
    }
}
