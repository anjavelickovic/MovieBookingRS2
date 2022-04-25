using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Movies.API.Extensions
{
    public static class RandomExtensions
    {
        public static IEnumerable<int> Sample(this Random random, int maxValue, int numberOfElements)
        {
            var numbers = new HashSet<int>();
            while (numbers.Count < numberOfElements)
            {
                numbers.Add(random.Next(maxValue));
            }
            return numbers.ToList();
        }
    }
}
