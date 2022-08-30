using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Movies.API.Entities
{
    public class LastUpdate
    {
        public LastUpdate(DateTime current) {
            this.Day = current.Day;
            this.Month = current.Month;
            this.Year = current.Year;
        }

        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public int Day { get; set; }
        public int Month{ get; set; }
        public int Year{get; set; }
    }
}
