using Administration.Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Administration.Domain.ValueObjects
{
    public class PhoneNumber : ValueObject
    {
        public string AreaCode { get; private set; }
        public string Number { get; private set; }

        public PhoneNumber(string areaCode, string number)
        {
            AreaCode = areaCode;
            Number = number;
        }
        public string FullNumber()
        {
            return $"+{AreaCode} {Number}";
        }

        protected override IEnumerable<object> GetEqualityComponents()
        {
            yield return AreaCode;
            yield return Number;
        }
    }
}
