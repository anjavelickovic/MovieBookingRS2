using AutoMapper;
using Identity.DTOs;
using Identity.Entities;
using Identity.Repositories;
using Identity.Services;
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
        protected readonly IAuthenticationService _authService;

        public IdentityRegistrationControllerBase(IMapper mapper,
                                                  IUserRepository userRepository,
                                                  IRoleRepository roleRepository,
                                                  IAuthenticationService authService)
        {
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
            _roleRepository = roleRepository ?? throw new ArgumentNullException(nameof(roleRepository));
            _authService = authService ?? throw new ArgumentNullException(nameof(authService));
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

        protected async Task<IActionResult> LoginUser(UserCredentialsDTO userCredentials, string role)
        {
            var user = await _authService.ValidateUser(userCredentials);
            if (user == null)
            {
                return Unauthorized();
            }

            var userRoles = (await _userRepository.GetUserRoles(user)).ToList();
            if (!userRoles.Contains(role))
            {
                return Unauthorized();
            }

            return Ok(await _authService.AuthenticateUser(user));
        }

        protected async Task<ActionResult<AuthenticationModel>> Refresh(RefreshTokenDTO refreshTokenCredentials)
        {
            var user = await _userRepository.GetUserByUsername(refreshTokenCredentials.UserName);
            if (user == null)
            {
                return Forbid();
            }

            var lastRefreshToken = await _userRepository.GetLastRefreshToken(user);
            if (lastRefreshToken == null || lastRefreshToken.Token != refreshTokenCredentials.RefreshToken)
            {
                await _userRepository.RemoveAllRefreshTokensFromUser(user);
                return Unauthorized();
            }

            if (lastRefreshToken.ExpiryTime < DateTime.Now)
            {
                return Unauthorized();
            }

            return Ok(await _authService.AuthenticateUser(user));
        }

        protected async Task<IActionResult> Logout(RefreshTokenDTO refreshTokenCredentials)
        {
            var user = await _userRepository.GetUserByUsername(refreshTokenCredentials.UserName);
            if (user == null)
            {
                return Forbid();
            }

            await _userRepository.RemoveAllRefreshTokensFromUser(user);

            return Accepted();
        }
    }
}
