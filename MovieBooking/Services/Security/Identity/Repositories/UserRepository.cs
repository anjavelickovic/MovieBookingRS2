using Identity.Context;
using Identity.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Identity.Repositories
{
    public class UserRepository: IUserRepository
    {
        private readonly UserManager<User> _userManager;
        private readonly IdentityContext _identityContext;

        public UserRepository(UserManager<User> userManager, IdentityContext identityContext)
        {
            _userManager = userManager ?? throw new ArgumentNullException(nameof(userManager));
            _identityContext = identityContext ?? throw new ArgumentNullException(nameof(identityContext));
        }

        public async Task<bool> CreateUser(User user, string password)
        {
            var result = await _userManager.CreateAsync(user, password);
            return result.Succeeded;
        }

        public async Task<bool> AddRoleToUser(User user, string role)
        {
            var result = await _userManager.AddToRoleAsync(user, role);
            return result.Succeeded;
        }

        public async Task<bool> ChangeUserName(User user, string newUserName) 
        {
            user.UserName = newUserName;
            var result = await _userManager.UpdateAsync(user);
            return result.Succeeded;
        }

        public async Task<bool> ChangeUserEmail(User user, string newEmail)
        {
            var emailToken = await _userManager.GenerateChangeEmailTokenAsync(user, newEmail);
            var result = await _userManager.ChangeEmailAsync(user, newEmail, emailToken);
            return result.Succeeded;
        }

        public async Task<bool> ChangeUserPassword(User user, string currentPassword, string newPassword)
        {
            var result = await _userManager.ChangePasswordAsync(user, currentPassword, newPassword);
            return result.Succeeded;
        }

        public async Task<bool> DeleteUser(User user)
        {
            var result = await _userManager.DeleteAsync(user);
            return result.Succeeded;
        }

        public async Task<User> GetUserByEmail(string email)
        {
            return await _userManager.FindByEmailAsync(email);
        }

        public async Task<User> GetUserByUsername(string username)
        {
            return await _userManager.FindByNameAsync(username);
        }

        public async Task<bool> ConfirmEmail(User user)
        {
            if (await _userManager.IsEmailConfirmedAsync(user))
                return true;

            var emailToken = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            var result = await _userManager.ConfirmEmailAsync(user, emailToken);
            return result.Succeeded;
        }

        public async Task<IEnumerable<User>> GetAllUsers()
        {
            return await _userManager.Users.ToListAsync();
        }

        public async Task<bool> CheckPassword(User user, string password)
        {
            return await _userManager.CheckPasswordAsync(user, password);
        }

        public async Task<IEnumerable<string>> GetUserRoles(User user) 
        {
            return await _userManager.GetRolesAsync(user);
        }

        public async Task RemoveAllUsers() 
        {
            var allUsers = await _userManager.Users.ToListAsync();
            foreach (var user in allUsers)
                await _userManager.DeleteAsync(user);
        }

        public async Task<bool> AddRefreshTokenToUser(User user, RefreshToken refreshToken) 
        {
            user.RefreshTokens.Add(refreshToken);
            var result = await _userManager.UpdateAsync(user);
            return result.Succeeded;
        }

        public async Task<bool> RemoveRefreshTokenFromUser(User user, string refreshToken) 
        {
            user.RefreshTokens.RemoveAll(r => r.Token == refreshToken);
            var result = await _userManager.UpdateAsync(user);
            return result.Succeeded;
        }

        public async Task<RefreshToken> GetLastRefreshToken(User user) 
        {
            var userTokens = await _identityContext.RefreshTokens.Where(t => (t.Owner == user.UserName)).ToListAsync();
            if (userTokens.Count == 0) 
            {
                return null;
            }
            return userTokens.OrderByDescending(t => t.CreationTime).First();
        }

        public async Task RemoveAllRefreshTokensFromUser(User user) 
        {
            var userTokens = await _identityContext.RefreshTokens.Where(t => (t.Owner == user.UserName)).ToListAsync();
            _identityContext.RemoveRange(userTokens);
            await _identityContext.SaveChangesAsync();
        }
    }
}
