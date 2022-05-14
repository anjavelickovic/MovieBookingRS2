using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Identity.Repositories
{
    public interface IRoleRepository
    {
        Task<bool> CheckIfRoleExists(string roleName);
    }
}
