namespace e_commerce.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string Role { get; set; } // "admin" or "customer"
        public string Address { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Password { get; set; } // Store the hashed password
    }

}
