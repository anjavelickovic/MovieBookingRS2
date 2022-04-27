using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using IMDbApiLib;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Movies.API.Helpers
{
	public static class ImdbClient
	{
		private static readonly string _omdb_api_key = Environment.GetEnvironmentVariable("OMDB_API_KEY");
		private static readonly string _imdb_api_key = Environment.GetEnvironmentVariable("IMDB_API_KEY");

		private static readonly string _omdb_base_url = "http://www.omdbapi.com/?";
		private static readonly ApiLib _apiLib;

		static ImdbClient()
        {
			_apiLib = new ApiLib(_imdb_api_key);
		}

		public static async Task<JObject> FetchJsonDataForMovie(string id)
		{
			using (var client = new HttpClient())
			{
				var responseOmdbTask = client
					.GetAsync($"{_omdb_base_url}apikey={_omdb_api_key}&i={id}")
					.ConfigureAwait(false);
				var responseImdbTask = _apiLib.TrailerAsync(id);

				var responseOmdb = await responseOmdbTask;
                if (!responseOmdb.IsSuccessStatusCode)
				{
					return null;
				}

				var responseOmdbString = await responseOmdb.Content.ReadAsStringAsync().ConfigureAwait(false);
				var jo = JObject.Parse(responseOmdbString);

				var responseImdb = await responseImdbTask;
				jo.Add(new JProperty("Trailer", responseImdb.LinkEmbed));

				return prepareJObject(jo);
			}

		}

		private static JObject prepareJObject(JObject data)
		{
			var jo = new JObject();

			jo.Add("Id", data.Property("imdbID").ToObject<string>());
			jo.Add("Title", data.Property("Title").ToObject<string>());
			jo.Add("Year", data.Property("Year").ToObject<int>());
			jo.Add("Released", data.Property("Released").ToObject<string>());
			jo.Add("Runtime", data.Property("Runtime").ToObject<string>());

			var genres = data.Property("Genre").ToObject<string>();
			jo.Add(new JProperty("Genres", genres.Split(", ")));

			jo.Add("Director", data.Property("Director").ToObject<string>());

			var actors = data.Property("Actors").ToObject<string>();
			jo.Add(new JProperty("MainActors", actors.Split(", ")));

			jo.Add("Plot", data.Property("Plot").ToObject<string>());

			var languages = data.Property("Language").ToObject<string>();
			jo.Add(new JProperty("Languages", languages.Split(", ")));

			jo.Add("Poster", data.Property("Poster").ToObject<string>());
			jo.Add("ImdbRating", data.Property("imdbRating").ToObject<decimal>());

			var imdbVotesString = data.Property("imdbVotes").ToObject<string>();
			var imdbVotesInt = Int32.Parse(string.Join("", imdbVotesString.Split(",")));
			jo.Add("ImdbVotes", imdbVotesInt);

			jo.Add("Trailer", data.Property("Trailer").ToObject<string>());

			return jo;
		}
	}
}
