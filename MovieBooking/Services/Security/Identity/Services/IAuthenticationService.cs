using Identity.DTOs;
using Identity.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Identity.Services
{
    public interface IAuthenticationService
    {
        Task<User> ValidateUser(UserCredentialsDTO userCredentials);
        Task<AuthenticationModel> AuthenticateUser(User user);
    }
}
