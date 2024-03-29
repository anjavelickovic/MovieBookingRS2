﻿using Identity.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Identity.Repositories
{
    public interface IUserRepository
    {
        Task<bool> CreateUser(User user, string password);
        Task<bool> AddRoleToUser(User user, string role);
        Task<bool> ChangeFirstName(User user, string newFirstName);
        Task<bool> ChangeLastName(User user, string newLastName);
        Task<bool> ChangeUserName(User user, string newUserName);
        Task<bool> ChangeUserEmail(User user, string newEmail);
        Task<bool> ChangeUserPassword(User user, string currentPassword, string newPassword);
        Task<bool> DeleteUser(User user);
        Task<User> GetUserByEmail(string email);
        Task<User> GetUserByUsername(string username);
        Task<IEnumerable<User>> GetAllUsers();
        Task<bool> CheckPassword(User user, string password);
        Task<IEnumerable<string>> GetUserRoles(User user);
        Task RemoveAllUsers();
        Task<bool> AddRefreshTokenToUser(User user, RefreshToken refreshToken);
        Task<bool> RemoveRefreshTokenFromUser(User user, string refreshToken);
        Task<RefreshToken> GetLastRefreshToken(User user);
        Task RemoveAllRefreshTokensFromUser(User user);
    }
}
