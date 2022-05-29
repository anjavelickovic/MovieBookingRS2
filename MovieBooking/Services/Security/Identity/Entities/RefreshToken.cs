﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Identity.Entities
{
    public class RefreshToken
    {
        public Guid Id { get; set; }
        public string Token { get; set; }
        public DateTime ExpiryTime { get; set; }
        public DateTime CreationTime { get; set; }
        public string Owner { get; set; }

        public RefreshToken()
        {
            Id = Guid.NewGuid();
        }
    }
}
