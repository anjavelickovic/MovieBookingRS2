using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Discount.Common.Entities
{
    public class Coupon
    {
        public string Id { get; set; }
        public string MovieName { get; set; }
        public int Amount { get; set; }
        public DateTime CreationDate { get; set; }
        public DateTime ModifiedDate { get; set; }

    }
}
