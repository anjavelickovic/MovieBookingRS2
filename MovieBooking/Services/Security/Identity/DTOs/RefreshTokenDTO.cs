using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Identity.DTOs
{
    public class RefreshTokenDTO
    {
        public string UserName { get; set; }
        public string RefreshToken { get; set; }
    }
}
