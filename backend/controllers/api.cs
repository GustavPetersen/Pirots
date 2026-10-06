using Microsoft.AspNetCore.Mvc;

/// <summary>
/// Controller for backend API
/// </summary>
[ApiController]
[Route("api")]
[Produces("application/json")]
public class BackendController : ControllerBase
{
    /// <summary>
    /// Constructor deluxe
    /// </summary>
    public BackendController()
    {
    }

    /// <summary>
    /// bruh
    /// </summary>
    /// <returns>test</returns>
    [HttpGet]
    [Route("test")]
    public async Task<IActionResult> test()
    {
        return Ok("yes");
    }
}