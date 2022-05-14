using Identity.Context;
using Identity.DTOs;
using Identity.Entities;
using Identity.Repositories;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace Identity.Services
{
    public class AuthenticationService: IAuthenticationService
    {
        private readonly IUserRepository _userRepository;
        private readonly IConfiguration _configuration;
        private readonly IdentityContext _identityContext;

        public AuthenticationService(IUserRepository userRepository, IConfiguration configuration, IdentityContext identityContext)
        {
            _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
            _identityContext = identityContext ?? throw new ArgumentNullException(nameof(identityContext));
        }

        public async Task<User> ValidateUser(UserCredentialsDTO userCredentials)
        {
            var userByUsername = await _userRepository.GetUserByUsername(userCredentials.UserNameOrEmail);
            var userByEmail = await _userRepository.GetUserByEmail(userCredentials.UserNameOrEmail);
            var user = userByUsername ?? userByEmail;
            if ( user == null || !await _userRepository.CheckPassword(user, userCredentials.Password))
            {
                return null;
            }
            return user;
        }

        public async Task<AuthenticationModel> AuthenticateUser(User user)
        {
            var accessToken = await CreateAccessToken(user);
            var refreshToken = await CreateRefreshToken(user);

            await _userRepository.AddRefreshTokenToUser(user, refreshToken);

            return new AuthenticationModel { AccessToken = accessToken, RefreshToken = refreshToken.Token };
        }

        private async Task<string> CreateAccessToken(User user)
        {
            var signingCredentials = GetSigningCredentials();
            var claims = await GetClaims(user);
            var token = GenerateToken(signingCredentials, claims);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private SigningCredentials GetSigningCredentials()
        {
            var key = Encoding.UTF8.GetBytes(_configuration.GetValue<string>("JwtSettings:secretKey"));
            var secret = new SymmetricSecurityKey(key);

            return new SigningCredentials(secret, SecurityAlgorithms.HmacSha256);
        }

        private async Task<IEnumerable<Claim>> GetClaims(User user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(ClaimTypes.Email, user.Email),
            };

            var roles = await _userRepository.GetUserRoles(user);
            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            return claims;
        }

        private JwtSecurityToken GenerateToken(SigningCredentials signingCredentials, IEnumerable<Claim> claims)
        {
            var jwtSettings = _configuration.GetSection("JwtSettings");

            var token = new JwtSecurityToken
            (
                issuer: jwtSettings.GetSection("validIssuer").Value,
                audience: jwtSettings.GetSection("validAudience").Value,
                claims: claims,
                expires: DateTime.Now.AddMinutes(Convert.ToDouble(jwtSettings.GetSection("expires").Value)),
                signingCredentials: signingCredentials
            );

            return token;
        }

        private async Task<RefreshToken> CreateRefreshToken(User user)
        {
            var randomNumber = new byte[32];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);

            var token = new RefreshToken
            {
                Token = Convert.ToBase64String(randomNumber),
                ExpiryTime = DateTime.Now.AddDays(Convert.ToDouble(_configuration.GetValue<string>("RefreshTokenExpires"))),
                CreationTime = DateTime.Now,
                Owner = user.UserName
            };

            _identityContext.RefreshTokens.Add(token);
            await _identityContext.SaveChangesAsync();

            return token;
        }

        public async Task RemoveRefreshToken(User user, string refreshToken) 
        {
            await _userRepository.RemoveRefreshTokenFromUser(user, refreshToken);

            var token = _identityContext.RefreshTokens.FirstOrDefault(r => r.Token == refreshToken);
            if (token == null)
            {
                return;
            }

            _identityContext.RefreshTokens.Remove(token);
            await _identityContext.SaveChangesAsync();
        }

    }
}
