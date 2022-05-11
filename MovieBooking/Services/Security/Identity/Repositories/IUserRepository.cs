using Identity.Entities;
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
        Task<bool> ChangeEmail(User user, string newEmail);
        Task<bool> ChangeUserPassword(User user, string currentPassword, string newPassword);
        Task<bool> DeleteUser(User user);
        Task<User> GetUserByEmail(string email);
        Task<User> GetUserByUsername(string username);
        Task<bool> ConfirmEmailAsync(User user);
        Task<IEnumerable<User>> GetAllUsers();
        Task<bool> CheckPassword(User user, string password);
        Task<IEnumerable<string>> GetUserRoles(User user);
    }
}
