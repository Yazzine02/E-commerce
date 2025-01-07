using System.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;

namespace e_commerce.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private IConfiguration _configuration;
        public ProductsController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet("all")]
        public JsonResult GetProducts()
        {
            string query = "SELECT * FROM dbo.products";
            DataTable table = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("DefaultConnection");

            using (SqlConnection myConnection = new SqlConnection(sqlDataSource))
            {
                myConnection.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myConnection))
                {
                    using (SqlDataReader myReader = myCommand.ExecuteReader())
                    {
                        table.Load(myReader);
                    }
                }
            }
            return new JsonResult(table);
        }

        [HttpGet]
        [Route("Get")]
        public JsonResult GetProduct(int id)
        {
            string query = "SELECT * FROM dbo.products WHERE id = @id";
            DataTable table = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("DefaultConnection");

            using (SqlConnection myConnection = new SqlConnection(sqlDataSource))
            {
                myConnection.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myConnection))
                {
                    myCommand.Parameters.AddWithValue("@id", id);
                    using (SqlDataReader myReader = myCommand.ExecuteReader())
                    {
                        table.Load(myReader);
                    }
                }
            }
            return new JsonResult(table);
        }

        [HttpPost]
        [Route("Add")]
        public JsonResult AddProduct(string name, string description, decimal price, string imageurl, int categoryId)
        {
            string query = @"
                INSERT INTO dbo.products (name, description, price, imageurl, categoryId) 
                VALUES (@name, @description, @price, @imageurl, @categoryId)";
            int rowsAffected;
            string sqlDataSource = _configuration.GetConnectionString("DefaultConnection");

            using (SqlConnection myConnection = new SqlConnection(sqlDataSource))
            {
                myConnection.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myConnection))
                {
                    myCommand.Parameters.AddWithValue("@name", name);
                    myCommand.Parameters.AddWithValue("@description", description);
                    myCommand.Parameters.AddWithValue("@price", price);
                    myCommand.Parameters.AddWithValue("@imageurl", imageurl);
                    myCommand.Parameters.AddWithValue("@categoryId", categoryId);
                    rowsAffected = myCommand.ExecuteNonQuery();
                }
            }
            return new JsonResult($"Product added successfully. Rows affected: {rowsAffected}");
        }

        [HttpPut]
        [Route("Update")]
        public JsonResult UpdateProduct(int id, string name, string description, decimal price, string imageurl, int categoryId)
        {
            string query = @"
                UPDATE dbo.products 
                SET name = @name, 
                    description = @description, 
                    price = @price, 
                    imageurl = @imageurl,
                    categoryId = @categoryId 
                WHERE id = @id";
            int rowsAffected;
            string sqlDataSource = _configuration.GetConnectionString("DefaultConnection");

            using (SqlConnection myConnection = new SqlConnection(sqlDataSource))
            {
                myConnection.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myConnection))
                {
                    myCommand.Parameters.AddWithValue("@id", id);
                    myCommand.Parameters.AddWithValue("@name", name);
                    myCommand.Parameters.AddWithValue("@description", description);
                    myCommand.Parameters.AddWithValue("@price", price);
                    myCommand.Parameters.AddWithValue("@imageurl", imageurl);
                    myCommand.Parameters.AddWithValue("@categoryId", categoryId);
                    rowsAffected = myCommand.ExecuteNonQuery();
                }
            }
            return new JsonResult($"Product updated successfully. Rows affected: {rowsAffected}");
        }

        [HttpDelete]
        [Route("Delete")]
        public JsonResult DeleteProduct(int id)
        {
            string query = "DELETE FROM dbo.products WHERE id = @id";
            int rowsAffected;
            string sqlDataSource = _configuration.GetConnectionString("DefaultConnection");

            using (SqlConnection myConnection = new SqlConnection(sqlDataSource))
            {
                myConnection.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myConnection))
                {
                    myCommand.Parameters.AddWithValue("@id", id);
                    rowsAffected = myCommand.ExecuteNonQuery();
                }
            }
            return new JsonResult($"Product deleted successfully. Rows affected: {rowsAffected}");
        }
        [HttpGet]
        [Route("GetProductsByCategory/{categoryId}")]
        public JsonResult GetProductsByCategory(int categoryId)
        {
            string query = "SELECT * FROM dbo.products where categoryid=@categoryId";
            DataTable table = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("DefaultConnection");
            using (SqlConnection myConnection = new SqlConnection(sqlDataSource))
            {
                myConnection.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myConnection))
                {
                    myCommand.Parameters.AddWithValue("@categoryId", categoryId);
                    using (SqlDataReader myReader = myCommand.ExecuteReader())
                    {
                        table.Load(myReader);
                    }
                }
            }
            return new JsonResult(table);
        }
    }
}
