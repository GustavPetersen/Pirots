namespace backend.controllers;

using Microsoft.AspNetCore.Mvc;
using backend.dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using backend.data;

/// <summary>
/// Controller for auth requests
/// </summary>
[ApiController]
[Route("auth")]
[Produces("application/json")]
public class AuthController : ControllerBase
{
    private readonly UserManager<AppUser> _userManager;
    private readonly SignInManager<AppUser> _signInManager;

    /// <summary>
    /// ...
    /// </summary>
    public AuthController(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager)
    {
        _userManager = userManager;
        _signInManager = signInManager;
    }

    /// <summary>
    /// ...
    /// </summary>
    /// <param name="req"> ... </param>
    /// <returns> ... </returns>
    [HttpPost]
    [Route("login")]
    public async Task<IActionResult> Login(LoginRequest req)
    {
        var result = await _signInManager.PasswordSignInAsync(
            req.UserName, req.Password, req.RememberMe, lockoutOnFailure: true
        );
        return result.Succeeded ? Ok() : Unauthorized();
    }

    /// <summary>
    /// ...
    /// </summary>
    /// <returns> ... </returns>
    [Authorize]
    [HttpPost]
    [Route("logout")]
    public async Task<IActionResult> Logout()
    {
        await _signInManager.SignOutAsync();
        return Ok();
    }

    /// <summary>
    /// ...
    /// </summary>
    /// <param name="req"> ... </param>
    /// <returns> ... </returns>
    [HttpPost]
    [Route("signup")]
    public async Task<IActionResult> SignUp(SignUpRequest req)
    {
        AppUser newUser = new()
        {
            UserName = req.UserName
        };

        var result = await _userManager.CreateAsync(newUser, req.Password);
        if (!result.Succeeded)
        {
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(error.Code, error.Description);
            }

            return ValidationProblem();
        }

        return Ok();
    }

    /// <summary>
    /// ...
    /// </summary>
    /// <returns> ... </returns>
    [Authorize]
    [HttpGet]
    [Route("me")]
    public async Task<IActionResult> Me()
    {
        AppUser? curUser = await _userManager.GetUserAsync(User);
        if (curUser is null)
        {
            await _signInManager.SignOutAsync(); // Invalidate the session
            return Unauthorized();
        }

        return Ok(curUser.UserName);
    }
}
