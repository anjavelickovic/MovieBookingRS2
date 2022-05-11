using AutoMapper;
using Identity.DTOs;
using Identity.Repositories;
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
    public class AdminAuthenticationController: IdentityRegistrationControllerBase
    {
        public AdminAuthenticationController(IMapper mapper, IUserRepository userRepository, IRoleRepository roleRepository)
            : base(mapper, userRepository, roleRepository)
        { }

        [HttpPost("[action]")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> RegisterAdmin([FromBody] CreateUserDTO newUser)
        {
            return await RegisterUser(newUser, new string[] { "Admin" });
        }
    }
}
