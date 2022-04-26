using Movies.API.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Movies.API.Helpers
{
    public interface IImdbClient
    {
        Task<string> FetchJsonDataForMovie(string id);
    }
}
