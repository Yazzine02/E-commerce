using System.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;

namespace e_commerce.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public OrdersController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpPost("CreateOrder")]
        public IActionResult CreateOrder([FromBody] OrderRequest orderRequest)
        {
            string orderQuery = @"
            INSERT INTO Orders (CustomerId, OrderDate, Total) 
            VALUES (@CustomerId, @OrderDate, @Total);
            SELECT CAST(SCOPE_IDENTITY() as int)"; // Get the new OrderId

            string orderProductsQuery = @"
            INSERT INTO OrderProducts (OrderId, ProductId, Quantity, Price) 
            VALUES (@OrderId, @ProductId, @Quantity, @Price)";

            string sqlDataSource = _configuration.GetConnectionString("DefaultConnection");

            try
            {
                using (SqlConnection connection = new SqlConnection(sqlDataSource))
                {
                    connection.Open();

                    using (SqlTransaction transaction = connection.BeginTransaction())
                    {
                        try
                        {
                            int orderId;
                            // Insert the order and get the OrderId
                            using (SqlCommand orderCommand = new SqlCommand(orderQuery, connection, transaction))
                            {
                                orderCommand.Parameters.AddWithValue("@CustomerId", orderRequest.CustomerId);
                                orderCommand.Parameters.AddWithValue("@OrderDate", DateTime.Now);
                                orderCommand.Parameters.AddWithValue("@Total", orderRequest.Total);

                                orderId = (int)orderCommand.ExecuteScalar(); // Get the new OrderId
                            }

                            // Insert each product into OrderProducts
                            foreach (var product in orderRequest.Products)
                            {
                                using (SqlCommand orderProductsCommand = new SqlCommand(orderProductsQuery, connection, transaction))
                                {
                                    orderProductsCommand.Parameters.AddWithValue("@OrderId", orderId);
                                    orderProductsCommand.Parameters.AddWithValue("@ProductId", product.ProductId);
                                    orderProductsCommand.Parameters.AddWithValue("@Quantity", product.Quantity);
                                    orderProductsCommand.Parameters.AddWithValue("@Price", product.Price);

                                    orderProductsCommand.ExecuteNonQuery();
                                }
                            }

                            // Commit the transaction
                            transaction.Commit();
                            return Ok("Order created successfully.");
                        }
                        catch (Exception ex)
                        {
                            transaction.Rollback();
                            return StatusCode(500, $"Internal server error: {ex.Message}");
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: Get all orders
        [HttpGet("GetOrders")]
        public IActionResult GetOrders()
        {
            string query = "SELECT * FROM dbo.Orders";
            DataTable table = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("DefaultConnection");

            try
            {
                using (SqlConnection connection = new SqlConnection(sqlDataSource))
                {
                    connection.Open();
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        SqlDataReader reader = command.ExecuteReader();
                        table.Load(reader);
                        reader.Close();
                    }
                }
                return Ok(table);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: Get order by ID
        [HttpGet("GetOrder/{id}")]
        public IActionResult GetOrder(int id)
        {
            string query = "SELECT * FROM dbo.Orders WHERE Id = @OrderId";
            DataTable table = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("DefaultConnection");

            try
            {
                using (SqlConnection connection = new SqlConnection(sqlDataSource))
                {
                    connection.Open();
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@OrderId", id);

                        SqlDataReader reader = command.ExecuteReader();
                        table.Load(reader);
                        reader.Close();
                    }
                }
                if (table.Rows.Count == 0)
                {
                    return NotFound($"Order with ID {id} not found.");
                }
                return Ok(table);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // DELETE: Delete order by ID
        [HttpDelete("DeleteOrder/{id}")]
        public IActionResult DeleteOrder(int id)
        {
            string query = "DELETE FROM dbo.Orders WHERE Id = @OrderId";
            string sqlDataSource = _configuration.GetConnectionString("DefaultConnection");

            try
            {
                using (SqlConnection connection = new SqlConnection(sqlDataSource))
                {
                    connection.Open();
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@OrderId", id);

                        int rowsAffected = command.ExecuteNonQuery();
                        if (rowsAffected == 0)
                        {
                            return NotFound($"Order with ID {id} not found.");
                        }
                        return Ok($"Order with ID {id} deleted successfully.");
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // PUT: Update an order
        [HttpPut("UpdateOrder/{id}")]
        public IActionResult UpdateOrder(int id, [FromBody] OrderUpdateRequest request)
        {
            string query = @"
                UPDATE dbo.Orders
                SET CustomerId = @CustomerId, Total = @Total, OrderDate = @OrderDate
                WHERE Id = @OrderId";
            string sqlDataSource = _configuration.GetConnectionString("DefaultConnection");

            try
            {
                using (SqlConnection connection = new SqlConnection(sqlDataSource))
                {
                    connection.Open();
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@OrderId", id);
                        command.Parameters.AddWithValue("@CustomerId", request.CustomerId);
                        command.Parameters.AddWithValue("@Total", request.Total);
                        command.Parameters.AddWithValue("@OrderDate", request.OrderDate);

                        int rowsAffected = command.ExecuteNonQuery();
                        if (rowsAffected == 0)
                        {
                            return NotFound($"Order with ID {id} not found.");
                        }
                        return Ok($"Order with ID {id} updated successfully.");
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }

    // Request object for the order
    public class OrderRequest
    {
        public int CustomerId { get; set; }
        public decimal Total { get; set; }
        public List<OrderProductRequest> Products { get; set; }
    }

    // DTO for updating orders
    public class OrderUpdateRequest
    {
        public int CustomerId { get; set; }
        public decimal Total { get; set; }
        public DateTime OrderDate { get; set; }
    }

    public class OrderProductRequest
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
    }
}

