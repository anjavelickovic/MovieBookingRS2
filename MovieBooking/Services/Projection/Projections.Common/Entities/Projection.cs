using System;
using System.Collections.Generic;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Projections.Common.Entities
{
    public class Projection
    {
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public string MovieId { get; set; }
        public string MovieTitle { get; set; }
        public string Runtime { get; set; }
        public string TheaterHallId { get; set; }
        public string TheaterHallName { get; set; }
        public int NumberOfSeats { get; set; }
        public string ProjectionDate { get; set; }
        public string ProjectionTerm { get; set; }
        public int NumberOfReservedSeats { get; set; }
        public int Price { get; set; }
    }
}