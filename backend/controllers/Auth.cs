namespace backend.controllers;

using Microsoft.AspNetCore.Mvc;
using backend.engine;
using backend.dto;
using Microsoft.AspNetCore.Authorization;

/// <summary>
/// Controller for backend API
/// </summary>
[ApiController]
[Route("auth")]
[Produces("application/json")]
public class AuthController : ControllerBase
{
    /// <summary>
    /// Constructor deluxe
    /// </summary>
    public AuthController()
    {
    }

    /// <summary>
    /// ...
    /// </summary>
    /// <param name="login"> ... </param>
    /// <returns> ... </returns>
    [HttpPost]
    [Route("login")]
    public async Task<IActionResult> Login(LoginRequest login)
    {
        return Ok();
    }

    /// <summary>
    /// ...
    /// </summary>
    /// <returns> ... </returns>
    [Authorize]
    [HttpPost]
    [Route("me")]
    public async Task<IActionResult> Me()
    {
        return Ok();
    }
}
