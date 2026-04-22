using Microsoft.AspNetCore.Mvc;
using Organizer.Api.Services;
using System;
using System.IO;
using System.Collections.Generic;
using System.Collections.Concurrent;
using System.Linq;
using System.Threading.Tasks;
using Google.Apis.Auth;
using Microsoft.Extensions.Configuration;

namespace Organizer.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IEmailService _emailService;
        private readonly IConfiguration _configuration;
        private static readonly ConcurrentDictionary<string, string> _otps = new ConcurrentDictionary<string, string>();
        private static ConcurrentDictionary<string, UserProfile> _users = new ConcurrentDictionary<string, UserProfile>();
        private static readonly string _dbPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "users_db.json");

        public AuthController(IEmailService emailService, IConfiguration configuration)
        {
            _emailService = emailService;
            _configuration = configuration;
            LoadUsers();
        }

        private void LoadUsers()
        {
            try
            {
                if (System.IO.File.Exists(_dbPath))
                {
                    var json = System.IO.File.ReadAllText(_dbPath);
                    var users = System.Text.Json.JsonSerializer.Deserialize<List<UserProfile>>(json);
                    if (users != null)
                    {
                        foreach (var user in users)
                        {
                            _users[user.Email.ToLower()] = user;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[Auth] Error loading users: {ex.Message}");
            }
        }

        private void SaveUsers()
        {
            try
            {
                var users = _users.Values.ToList();
                var json = System.Text.Json.JsonSerializer.Serialize(users);
                System.IO.File.WriteAllText(_dbPath, json);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[Auth] Error saving users: {ex.Message}");
            }
        }

        [HttpGet("health")]
        public IActionResult Health() => Ok(new { status = "ok", time = DateTime.Now });

        [HttpGet("check-email")]
        public IActionResult CheckEmail([FromQuery] string email)
        {
            if (string.IsNullOrEmpty(email))
                return BadRequest("Email is required");

            var normalizedEmail = email.Trim().ToLower();
            if (_users.ContainsKey(normalizedEmail))
            {
                Console.WriteLine($"[Auth] CheckEmail: {normalizedEmail} exists.");
                return Conflict("Email is already registered");
            }

            Console.WriteLine($"[Auth] CheckEmail: {normalizedEmail} is available.");
            return Ok(new { available = true });
        }

        [HttpPost("send-otp")]
        public async Task<IActionResult> SendOtp([FromBody] OtpRequest request)
        {
            if (string.IsNullOrEmpty(request.Email))
                return BadRequest("Email is required");

            var normalizedEmail = request.Email.Trim().ToLower();
            var otp = new Random().Next(100000, 999999).ToString();
            _otps[normalizedEmail] = otp;

            try
            {
                await _emailService.SendEmailAsync(
                    normalizedEmail,
                    "Your Login OTP - Lifespan+",
                    $"<div style='font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;'><h2>Welcome to Lifespan+</h2><p>Your OTP for login is:</p><h1 style='color: #0096c7;'>{otp}</h1><p>This code will expire in 10 minutes.</p></div>"
                );
                return Ok(new { message = "OTP sent successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Failed to send email: {ex.Message}");
            }
        }

        [HttpPost("verify-otp")]
        public IActionResult VerifyOtp([FromBody] VerifyOtpRequest request)
        {
            var normalizedEmail = request.Email.Trim().ToLower();
            if (_otps.TryGetValue(normalizedEmail, out var savedOtp) && savedOtp == request.Otp)
            {
                _otps.TryRemove(normalizedEmail, out _);
                
                // Get or create user
                if (!_users.TryGetValue(normalizedEmail, out var profile))
                {
                    profile = new UserProfile 
                    { 
                        Email = normalizedEmail, 
                        FullName = normalizedEmail.Split('@')[0] 
                    };
                    _users[normalizedEmail] = profile;
                    SaveUsers();
                    Console.WriteLine($"[Auth] User created via OTP: {normalizedEmail}");
                }

                return Ok(new { 
                    token = "mock-jwt-token-" + Guid.NewGuid(), 
                    email = profile.Email,
                    fullName = profile.FullName,
                    picture = profile.Picture
                });
            }

            return BadRequest("Invalid or expired OTP");
        }

        [HttpPost("google-login")]
        public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginRequest request)
        {
            if (string.IsNullOrEmpty(request.Token))
                return BadRequest("Google token is required");

            try
            {
                // Verify the ID Token with Google
                var payload = await GoogleJsonWebSignature.ValidateAsync(request.Token, new GoogleJsonWebSignature.ValidationSettings
                {
                    // Optionally restrict to your Client ID
                    // Audience = new[] { _configuration["Google:ClientId"] }
                });

                var normalizedEmail = payload.Email.Trim().ToLower();
                
                // Upsert user based on Google payload
                var profile = new UserProfile
                {
                    Email = normalizedEmail,
                    FullName = payload.Name,
                    Picture = payload.Picture
                };
                
                _users[normalizedEmail] = profile;
                SaveUsers();
                Console.WriteLine($"[Auth] User logged in via Verified Google Token: {normalizedEmail}");

                return Ok(new { 
                    token = request.Token, // In real apps, you'd issue your own JWT
                    email = profile.Email,
                    fullName = profile.FullName,
                    picture = profile.Picture
                });
            }
            catch (InvalidJwtException ex)
            {
                Console.WriteLine($"[Auth] Google Token Validation Failed: {ex.Message}");
                return Unauthorized("Invalid Google Token");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[Auth] Google Login Error: {ex.Message}");
                return StatusCode(500, "Error processing Google login");
            }
        }

        [HttpGet("profile")]
        public IActionResult GetProfile([FromQuery] string email)
        {
            var normalizedEmail = email.Trim().ToLower();
            if (_users.TryGetValue(normalizedEmail, out var profile))
                return Ok(profile);
            
            return NotFound("User not found");
        }

        [HttpPost("update-profile")]
        public IActionResult UpdateProfile([FromBody] UserProfile updatedProfile)
        {
            if (string.IsNullOrEmpty(updatedProfile.Email))
                return BadRequest("Email is required");

            var normalizedEmail = updatedProfile.Email.Trim().ToLower();
            updatedProfile.Email = normalizedEmail;
            
            _users[normalizedEmail] = updatedProfile;
            SaveUsers();
            Console.WriteLine($"[Auth] Profile updated for: {normalizedEmail}");
            return Ok(updatedProfile);
        }
    }

    public class UserProfile
    {
        public string Email { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string? Picture { get; set; }
    }

    public class GoogleLoginRequest
    {
        public string Email { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string? Picture { get; set; }
        public string Token { get; set; } = string.Empty;
    }

    public class OtpRequest
    {
        public string Email { get; set; } = string.Empty;
    }

    public class VerifyOtpRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Otp { get; set; } = string.Empty;
    }
}
