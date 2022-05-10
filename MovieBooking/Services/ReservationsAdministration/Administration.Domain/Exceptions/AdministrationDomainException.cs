using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Administration.Domain.Exceptions
{
    public class AdministrationDomainException : Exception
    {
        public AdministrationDomainException()
        {
        }

        public AdministrationDomainException(string message) 
            : base(message)
        {
        }

        public AdministrationDomainException(string message, Exception innerException) 
            : base(message, innerException)
        {
        }
    }
}
