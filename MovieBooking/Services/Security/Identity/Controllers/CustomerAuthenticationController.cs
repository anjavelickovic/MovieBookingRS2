using AutoMapper;
using Identity.DTOs;
using Identity.Entities;
using Identity.Repositories;
using Identity.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Identity.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class CustomerAuthenticationController: IdentityRegistrationControllerBase
    {
        public CustomerAuthenticationController(IMapper mapper,
                                                IUserRepository userRepository,
                                                IRoleRepository roleRepository,
                                                IAuthenticationService authService)
            : base(mapper, userRepository, roleRepository, authService)
        { }

        [HttpPost("[action]")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> RegisterCustomer([FromBody] CreateUserDTO newUser)
        {
            return await RegisterUser(newUser, new string[] { "Customer" });
        }

        [HttpPost("[action]")]
        [ProducesResponseType(typeof(AuthenticationModel), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> LoginCustomer([FromBody] UserCredentialsDTO userCredentials)
        {
            return await LoginUser(userCredentials, "Customer");
        }

    }
}
