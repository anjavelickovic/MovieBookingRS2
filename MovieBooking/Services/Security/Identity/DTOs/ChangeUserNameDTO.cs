using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Identity.DTOs
{
    public class ChangeUserNameDTO
    {
        [Required(ErrorMessage = "UserName is required")]
        public string NewUserName { get; set; }

        [Required(ErrorMessage = "Password is required")]
        public string Password { get; set; }
    }
}
