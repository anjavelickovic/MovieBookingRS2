using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Administration.Application.Features.Queries.ViewModels
{
    public class ReservationViewModel
    {
        public int Id { get; set; }
        public string BuyerId { get; set; }
        public string BuyerUsername { get; set; }
        public int TotalPrice { get; set; }

        public IEnumerable<TicketViewModel> Tickets { get; set; }
    }
}
