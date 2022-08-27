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

				if (jo.Property("Response").ToObject<string>() == "False")
					return null;

				var responseImdb = await responseImdbTask;
				jo.Add(new JProperty("Trailer", responseImdb.LinkEmbed));

				return prepareJObject(jo);
			}
		}

		private static JObject prepareJObject(JObject data)
		{
			var jo = new JObject();

			jo.Add("Id", data.Property("imdbID").ToObject<string>());

			var title = data.Property("Title").ToObject<string>();
			if (title == "N/A") 
			{
				jo.Add("Title", null);
			}
            else 
			{
				jo.Add("Title", title);
			}

			var year = data.Property("Year").ToObject<string>();
			if (year == "N/A")
			{
				jo.Add("Year", null);
			}
			else
			{
				jo.Add("Year", year);
			}

			var released = data.Property("Released").ToObject<string>();
			if (released == "N/A")
			{
				jo.Add("Released", null);
			}
			else
			{
				jo.Add("Released", released);
			}

			var runtime = data.Property("Runtime").ToObject<string>();
			if (runtime == "N/A")
			{
				jo.Add("Runtime", null);
			}
			else
			{
				jo.Add("Runtime", runtime);
			}

			var genres = data.Property("Genre").ToObject<string>();
			if (genres == "N/A")
			{
				jo.Add("Genres", null);
			}
			else
			{
				jo.Add(new JProperty("Genres", genres.Split(", ")));
			}

			var directors = data.Property("Director").ToObject<string>();
			if (directors == "N/A")
			{
				jo.Add("Directors", null);
			}
			else
			{
				Console.WriteLine(directors);
				jo.Add(new JProperty("Directors", directors.Split(", ")));
			}

			var actors = data.Property("Actors").ToObject<string>();
			if (actors == "N/A")
			{
				jo.Add("MainActors", null);
			}
			else
			{
				jo.Add(new JProperty("MainActors", actors.Split(", ")));
			}

			var plot = data.Property("Plot").ToObject<string>();
			if (plot == "N/A")
			{
				jo.Add("Plot", null);
			}
			else
			{
				jo.Add("Plot", plot);
			}

			var languages = data.Property("Language").ToObject<string>();
			if (languages == "N/A")
			{
				jo.Add("Languages", null);
			}
			else
			{
				jo.Add(new JProperty("Languages", languages.Split(", ")));
			}

			var poster = data.Property("Poster").ToObject<string>();
			if (poster == "N/A")
			{
				jo.Add("Poster", null);
			}
			else
			{
				jo.Add("Poster", poster);
			}

			if (data.Property("imdbRating").ToObject<string>() == "N/A")
			{
				jo.Add("ImdbRating", null);
			}
			else
			{
				jo.Add("ImdbRating", data.Property("imdbRating").ToObject<double>());
			}

			var imdbVotesString = data.Property("imdbVotes").ToObject<string>();
			if (imdbVotesString == "N/A")
			{
				jo.Add("ImdbVotes", null);
			}
			else
			{
				var imdbVotesInt = Int32.Parse(string.Join("", imdbVotesString.Split(",")));
				jo.Add("ImdbVotes", imdbVotesInt);
			}
			
			jo.Add("Trailer", data.Property("Trailer").ToObject<string>());

			return jo;
		}
	}
}
