using System.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;

namespace e_commerce.Controllers
{
    [Route("api/Categories")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        public CategoriesController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet]
        [Route("GetCategories")]
        public JsonResult GetCategories()
        {
            string query = "SELECT * FROM dbo.categories";
            DataTable table = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("DefaultConnection");

            try
            {
                using (SqlConnection myConnection = new SqlConnection(sqlDataSource))
                {
                    myConnection.Open();
                    using (SqlCommand myCommand = new SqlCommand(query, myConnection))
                    {
                        using (SqlDataReader reader = myCommand.ExecuteReader())
                        {
                            table.Load(reader);
                        }
                    }
                }
                return new JsonResult(table);
            }
            catch (Exception ex)
            {
                return new JsonResult($"Error: {ex.Message}") { StatusCode = StatusCodes.Status500InternalServerError };
            }
        }

        [HttpGet]
        [Route("GetCategory")]
        public JsonResult GetCategory(int id)
        {
            string query = "SELECT * FROM dbo.categories WHERE id = @id";
            DataTable table = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("DefaultConnection");

            try
            {
                using (SqlConnection myConnection = new SqlConnection(sqlDataSource))
                {
                    myConnection.Open();
                    using (SqlCommand myCommand = new SqlCommand(query, myConnection))
                    {
                        myCommand.Parameters.AddWithValue("@id", id);
                        using (SqlDataReader reader = myCommand.ExecuteReader())
                        {
                            table.Load(reader);
                        }
                    }
                }
                return new JsonResult(table);
            }
            catch (Exception ex)
            {
                return new JsonResult($"Error: {ex.Message}") { StatusCode = StatusCodes.Status500InternalServerError };
            }
        }

        [HttpPost]
        [Route("AddCategory")]
        public JsonResult AddCategory(string name, string description, string imageUrl)
        {
            string query = "INSERT INTO dbo.categories (name, description, imageUrl) VALUES (@name, @description, @imageurl)";
            int rowsAffected;
            string sqlDataSource = _configuration.GetConnectionString("DefaultConnection");

            try
            {
                using (SqlConnection myConnection = new SqlConnection(sqlDataSource))
                {
                    myConnection.Open();
                    using (SqlCommand myCommand = new SqlCommand(query, myConnection))
                    {
                        myCommand.Parameters.AddWithValue("@name", name);
                        myCommand.Parameters.AddWithValue("@description", description);
                        myCommand.Parameters.AddWithValue("@imageurl", imageUrl);
                        rowsAffected = myCommand.ExecuteNonQuery();
                    }
                }
                return new JsonResult(new { Message = "Category added successfully", Name = name, RowsAffected = rowsAffected });
            }
            catch (Exception ex)
            {
                return new JsonResult($"Error: {ex.Message}") { StatusCode = StatusCodes.Status500InternalServerError };
            }
        }

        [HttpPut]
        [Route("UpdateCategory")]
        public JsonResult UpdateCategory(int id, string name, string description, string imageUrl)
        {
            string query = @"
                UPDATE dbo.categories 
                SET name = @name, description = @description, imageUrl = @imageurl 
                WHERE id = @id";
            int rowsAffected;
            string sqlDataSource = _configuration.GetConnectionString("DefaultConnection");

            try
            {
                using (SqlConnection myConnection = new SqlConnection(sqlDataSource))
                {
                    myConnection.Open();
                    using (SqlCommand myCommand = new SqlCommand(query, myConnection))
                    {
                        myCommand.Parameters.AddWithValue("@name", name);
                        myCommand.Parameters.AddWithValue("@description", description);
                        myCommand.Parameters.AddWithValue("@imageurl", imageUrl);
                        myCommand.Parameters.AddWithValue("@id", id);
                        rowsAffected = myCommand.ExecuteNonQuery();
                    }
                }
                return new JsonResult($"Category updated successfully. Rows affected: {rowsAffected}");
            }
            catch (Exception ex)
            {
                return new JsonResult($"Error: {ex.Message}") { StatusCode = StatusCodes.Status500InternalServerError };
            }
        }

        [HttpDelete]
        [Route("DeleteCategory")]
        public JsonResult DeleteCategory(int id)
        {
            string query = "DELETE FROM dbo.categories WHERE id = @id";
            int rowsAffected;
            string sqlDataSource = _configuration.GetConnectionString("DefaultConnection");

            try
            {
                using (SqlConnection myConnection = new SqlConnection(sqlDataSource))
                {
                    myConnection.Open();
                    using (SqlCommand myCommand = new SqlCommand(query, myConnection))
                    {
                        myCommand.Parameters.AddWithValue("@id", id);
                        rowsAffected = myCommand.ExecuteNonQuery();
                    }
                }
                return new JsonResult($"Category deleted successfully. Rows affected: {rowsAffected}");
            }
            catch (Exception ex)
            {
                return new JsonResult($"Error: {ex.Message}") { StatusCode = StatusCodes.Status500InternalServerError };
            }
        }
    }
}
