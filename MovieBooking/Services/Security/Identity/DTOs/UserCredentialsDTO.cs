using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Identity.DTOs
{
    public class UserCredentialsDTO
    {
        [Required(ErrorMessage = "Username or email is required")]
        public string UserNameOrEmail { get; set; }

        [Required(ErrorMessage = "Password name is required")]
        public string Password { get; set; }
    }
}
