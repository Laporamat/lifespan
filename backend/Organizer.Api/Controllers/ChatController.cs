using Microsoft.AspNetCore.Mvc;
using System.Text;
using System.Text.Json;

namespace Organizer.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChatController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly HttpClient _httpClient;
        private const string GeminiEndpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

        public ChatController(IConfiguration configuration)
        {
            _configuration = configuration;
            _httpClient = new HttpClient();
        }

        [HttpPost("send")]
        public async Task<IActionResult> SendMessage([FromBody] ChatRequest request)
        {
            var apiKey = _configuration["Gemini:ApiKey"];
            if (string.IsNullOrEmpty(apiKey))
            {
                return BadRequest("Gemini API Key is not configured.");
            }

            var url = $"{GeminiEndpoint}?key={apiKey}";

            var geminiRequest = new
            {
                contents = new[]
                {
                    new
                    {
                        parts = new[]
                        {
                            new { text = request.Message }
                        }
                    }
                },
                generationConfig = new
                {
                    temperature = 0.7,
                    topK = 40,
                    topP = 0.95,
                    maxOutputTokens = 1024,
                }
            };

            var json = JsonSerializer.Serialize(geminiRequest);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            try
            {
                var response = await _httpClient.PostAsync(url, content);
                response.EnsureSuccessStatusCode();

                var responseString = await response.Content.ReadAsStringAsync();
                var geminiResponse = JsonSerializer.Deserialize<GeminiResponse>(responseString, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                var aiText = geminiResponse?.Candidates?[0]?.Content?.Parts?[0]?.Text ?? "I'm sorry, I couldn't process that.";

                return Ok(new { response = aiText });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error communicating with AI: {ex.Message}");
            }
        }
    }

    public class ChatRequest
    {
        public string Message { get; set; } = string.Empty;
    }

    public class GeminiResponse
    {
        public List<Candidate>? Candidates { get; set; }
    }

    public class Candidate
    {
        public Content? Content { get; set; }
    }

    public class Content
    {
        public List<Part>? Parts { get; set; }
    }

    public class Part
    {
        public string? Text { get; set; }
    }
}
