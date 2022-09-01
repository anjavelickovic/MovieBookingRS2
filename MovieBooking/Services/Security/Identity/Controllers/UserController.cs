using AutoMapper;
using Identity.DTOs;
using Identity.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Identity.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/v1/[controller]")]
    public class UserController: ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly IRoleRepository _roleRepository;
        private readonly IMapper _mapper;

        public UserController(IUserRepository userRepository, IRoleRepository roleRepository, IMapper mapper)
        {
            _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
            _roleRepository = roleRepository ?? throw new ArgumentNullException(nameof(roleRepository));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        [Authorize(Roles = "Admin,Customer")]
        [HttpGet("{usernameOrEmail}")]
        [ProducesResponseType(typeof(UserDetailsDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(UserDetailsDTO), StatusCodes.Status404NotFound)]
        public async Task<ActionResult<UserDetailsDTO>> GetUser(string usernameOrEmail)
        {
            var userByUsername = await _userRepository.GetUserByUsername(usernameOrEmail);
            var userByEmail = await _userRepository.GetUserByEmail(usernameOrEmail);
            var user = userByUsername ?? userByEmail;

            if (user == null)
            {
                return NotFound(null);
            }

            if (User.FindFirst(ClaimTypes.Name).Value != usernameOrEmail &&
                User.FindFirst(ClaimTypes.Email).Value != usernameOrEmail)
            {
                return Forbid();
            }

            return Ok(_mapper.Map<UserDetailsDTO>(user));
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("[action]")]
        [ProducesResponseType(typeof(IEnumerable<UserDetailsDTO>), StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<UserDetailsDTO>>> GetAllUsers()
        {
            var users = await _userRepository.GetAllUsers();
            return Ok(_mapper.Map<IEnumerable<UserDetailsDTO>>(users));
        }

        [Authorize(Roles = "Admin,Customer")]
        [HttpPut("[action]")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<bool>> ChangeFirstName([FromBody] ChangeFirstNameDTO request)
        {
            var user = await _userRepository.GetUserByUsername(User.FindFirstValue(ClaimTypes.Name));

            if (!await _userRepository.CheckPassword(user, request.Password))
            {
                return Forbid();
            }

            return await _userRepository.ChangeFirstName(user, request.NewFirstName);
        }

        [Authorize(Roles = "Admin,Customer")]
        [HttpPut("[action]")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<bool>> ChangeLastName([FromBody] ChangeLastNameDTO request)
        {
            var user = await _userRepository.GetUserByUsername(User.FindFirstValue(ClaimTypes.Name));

            if (!await _userRepository.CheckPassword(user, request.Password))
            {
                return Forbid();
            }

            return await _userRepository.ChangeLastName(user, request.NewLastName);
        }

        [Authorize(Roles = "Admin,Customer")]
        [HttpPut("[action]")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<bool>> ChangeUserName([FromBody] ChangeUserNameDTO request)
        {
            var user = await _userRepository.GetUserByUsername(User.FindFirstValue(ClaimTypes.Name));

            if (!await _userRepository.CheckPassword(user, request.Password)) 
            {
                return Forbid();
            }

            return await _userRepository.ChangeUserName(user, request.NewUserName);
        }

        [Authorize(Roles = "Admin,Customer")]
        [HttpPut("[action]")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<bool>> ChangeUserEmail([FromBody] ChangeUserEmailDTO request)
        {
            var user = await _userRepository.GetUserByEmail(User.FindFirstValue(ClaimTypes.Email));

            if (!await _userRepository.CheckPassword(user, request.Password))
            {
                return Forbid();
            }

            return await _userRepository.ChangeUserEmail(user, request.NewEmail);
        }

        [Authorize(Roles = "Admin,Customer")]
        [HttpPut("[action]")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<bool>> ChangeUserPassword([FromBody] ChangeUserPasswordDTO request)
        {
            var user = await _userRepository.GetUserByUsername(User.FindFirstValue(ClaimTypes.Name));

            if (!await _userRepository.CheckPassword(user, request.OldPassword))
            {
                return Forbid();
            }

            return await _userRepository.ChangeUserPassword(user, request.OldPassword, request.NewPassword);
        }

        [Authorize(Roles = "Customer")]
        [HttpDelete("[action]")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<bool>> DeleteUser()
        {
            var user = await _userRepository.GetUserByEmail(User.FindFirstValue(ClaimTypes.Email));
            return await _userRepository.DeleteUser(user);
        }
    }
}
