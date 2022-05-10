using System;
using System.Collections.Generic;

namespace Projection.Common.Entities
{
    public class Projections
    {
        public string MovieId { get; set; }
        public string MovieTitle { get; set; }
        public string Runtime { get; set; }
        public string TheaterHallId { get; set; }
        public string TheaterHallName { get; set; }
        public int NumberOfSeats { get; set; }
        public DateTime ProjectionStartTime { get; set; }
        public DateTime ProjectionFinishTime
        {
            get
            {
                var RuntimeInt = Int32.Parse(Runtime.Substring(0, Runtime.Length - 4));
                DateTime finishDateTime = ProjectionStartTime.AddMinutes(RuntimeInt);
                return finishDateTime;
            }
        }
        public int NumberOfReservedSeats { get; set; }
    }
}