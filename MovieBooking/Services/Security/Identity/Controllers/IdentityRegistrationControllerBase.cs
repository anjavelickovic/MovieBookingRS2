using AutoMapper;
using Identity.DTOs;
using Identity.Entities;
using Identity.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Identity.Controllers
{
    public class IdentityRegistrationControllerBase: ControllerBase
    {
        protected readonly IMapper _mapper;
        protected readonly IUserRepository _userRepository;
        protected readonly IRoleRepository _roleRepository;

        public IdentityRegistrationControllerBase(IMapper mapper, IUserRepository userRepository, IRoleRepository roleRepository)
        {
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
            _roleRepository = roleRepository ?? throw new ArgumentNullException(nameof(roleRepository));
        }

        protected async Task<IActionResult> RegisterUser(CreateUserDTO newUser, IEnumerable<string> roles)
        {
            var user = _mapper.Map<User>(newUser);

            if (!await _userRepository.CreateUser(user, newUser.Password))
            {
                return BadRequest();
            }

            foreach (var role in roles)
            {
                if (await _roleRepository.CheckIfRoleExists(role))
                {
                    await _userRepository.AddRoleToUser(user, role);
                }
            }

            return StatusCode(StatusCodes.Status201Created);
        }
    }
}
