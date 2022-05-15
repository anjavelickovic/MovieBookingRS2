using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Identity.DTOs
{
    public class ChangeUserEmailDTO
    {
        [Required(ErrorMessage = "Email is required")]
        public string NewEmail { get; set; }

        [Required(ErrorMessage = "Password is required")]
        public string Password { get; set; }
    }
}
