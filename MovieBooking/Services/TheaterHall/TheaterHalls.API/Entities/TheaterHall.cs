using System;
using System.Collections.Generic;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace TheaterHalls.API.Entities
{
    public class TheaterHall
    {
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public string Name { get; set; }
        public List<string> Terms { get; set; }
        public int NumberOfSeats { get; set; }
    }
}
