using e_commerce.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using System.Data;

namespace e_commerce.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public UserController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpPost("Register")]
        public IActionResult Register([FromBody] User user)
        {
            string query = @"
                INSERT INTO dbo.Users (Username, Email, Role, Address, FirstName, LastName, Password) 
                VALUES (@Username, @Email, @Role, @Address, @FirstName, @LastName, @Password)";

            string sqlDataSource = _configuration.GetConnectionString("DefaultConnection");

            try
            {
                using (SqlConnection connection = new SqlConnection(sqlDataSource))
                {
                    connection.Open();
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        if (UserExists(user.Username, user.Email, connection))
                        {
                            return BadRequest("Username or Email already exists.");
                        }

                        // Hash the password before saving
                        string passwordHash = BCrypt.Net.BCrypt.HashPassword(user.Password);

                        command.Parameters.AddWithValue("@Username", user.Username);
                        command.Parameters.AddWithValue("@Email", user.Email);
                        command.Parameters.AddWithValue("@Role", user.Role ?? "customer"); // Default to "customer"
                        command.Parameters.AddWithValue("@Address", user.Address);
                        command.Parameters.AddWithValue("@FirstName", user.FirstName);
                        command.Parameters.AddWithValue("@LastName", user.LastName);
                        command.Parameters.AddWithValue("@Password", passwordHash);

                        command.ExecuteNonQuery();
                    }
                }
                return Ok("User registered successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost("Login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            string query = "SELECT * FROM dbo.Users WHERE Username = @Username";
            string sqlDataSource = _configuration.GetConnectionString("DefaultConnection");

            try
            {
                using (SqlConnection connection = new SqlConnection(sqlDataSource))
                {
                    connection.Open();
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@Username", request.Username);

                        SqlDataReader reader = command.ExecuteReader();
                        if (reader.Read())
                        {
                            string storedPassword = reader["Password"].ToString();
                            string role = reader["Role"].ToString();

                            // Verify the password using BCrypt
                            if (BCrypt.Net.BCrypt.Verify(request.Password, storedPassword))
                            {
                                return Ok(new { username = request.Username, role = role });
                            }
                            else
                            {
                                return Unauthorized("Invalid password.");
                            }
                        }
                        else
                        {
                            return Unauthorized("Invalid credentials.");
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("GetUser")]
        [Authorize(Roles = "customer, admin")]
        public IActionResult GetUser(string username)
        {
            string query = "SELECT Username, Email, Role, FirstName, LastName, Address FROM dbo.Users WHERE Username = @Username";
            string sqlDataSource = _configuration.GetConnectionString("DefaultConnection");

            try
            {
                using (SqlConnection connection = new SqlConnection(sqlDataSource))
                {
                    connection.Open();
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@Username", username);
                        SqlDataReader reader = command.ExecuteReader();

                        if (reader.Read())
                        {
                            return Ok(new
                            {
                                Username = reader["Username"],
                                Email = reader["Email"],
                                Role = reader["Role"],
                                FirstName = reader["FirstName"],
                                LastName = reader["LastName"],
                                Address = reader["Address"]
                            });
                        }
                        else
                        {
                            return NotFound("User not found.");
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        private bool UserExists(string username, string email, SqlConnection connection)
        {
            string checkQuery = "SELECT COUNT(*) FROM dbo.Users WHERE Username = @Username OR Email = @Email";
            using (SqlCommand command = new SqlCommand(checkQuery, connection))
            {
                command.Parameters.AddWithValue("@Username", username);
                command.Parameters.AddWithValue("@Email", email);
                int count = Convert.ToInt32(command.ExecuteScalar());
                return count > 0;
            }
        }
    }

    public class LoginRequest
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
}
