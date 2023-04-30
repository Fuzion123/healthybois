using Domain.Events;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Events.Models
{
    public class ActivityDto
    {
        public int Id { get; set; }
        public int EventId { get; set; }
        public int OwnerUserId { get; set; }
        public string Title { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public List<ResultDto> Results { get; set; }
    }
}