﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Discount.Common.Entities
{
    public class Coupon
    {
        public string MovieId { get; set; }
        public string MovieName { get; set; }
        public int Amount { get; set; }
    }
}
